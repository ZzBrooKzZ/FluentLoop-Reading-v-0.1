import fs from 'fs';
import {
  PlacementAbandonReason,
  PlacementSession,
  ReadingLesson,
} from '../types/reading';
import {
  abandonPlacementSession,
  applyDiagnosticSubmissionToSession,
  createPlacementSession,
  finalizePlacementSessionOnTimeout,
  isPlacementSessionExpired,
  saveDraftAnswersInPlacementSession,
  SERVER_NETWORK_LATENCY_TOLERANCE_MS,
} from '../services/placementEngine';
import {
  getAllDiagnosticPassages,
  getDiagnosticPassageById,
  sanitizeLessonForLearner,
} from './lessonRepository';

interface PlacementGlobalRegistry {
  sessions: Map<string, PlacementSession>;
  latestSessionIdByUserId: Map<string, string>;
  abandonedSessionIds: Set<string>;
  hydratedFromDisk: boolean;
}

const PLACEMENT_CACHE_FILE = '/tmp/fluentloop-placement-sessions.json';

const globalForPlacement = globalThis as unknown as {
  __fluentLoopPlacementRegistry?: PlacementGlobalRegistry;
};

function mergeDiskStateIntoRegistry(registry: PlacementGlobalRegistry): void {
  try {
    if (!fs.existsSync(PLACEMENT_CACHE_FILE)) return;
    const raw = fs.readFileSync(PLACEMENT_CACHE_FILE, 'utf8');
    if (!raw) return;
    const parsed = JSON.parse(raw);

    if (Array.isArray(parsed?.abandonedSessionIds)) {
      for (const sid of parsed.abandonedSessionIds) {
        if (typeof sid === 'string' && sid.trim()) {
          registry.abandonedSessionIds.add(sid.trim());
        }
      }
    }

    if (parsed?.sessions && typeof parsed.sessions === 'object') {
      for (const [id, rawSession] of Object.entries(parsed.sessions)) {
        if (!rawSession || typeof rawSession !== 'object') continue;
        const diskSession = rawSession as PlacementSession;
        if (diskSession.status === 'abandoned') {
          registry.abandonedSessionIds.add(id);
        }

        const memSession = registry.sessions.get(id);
        if (!memSession) {
          registry.sessions.set(id, diskSession);
          continue;
        }

        // Monotonic precedence: 'completed' > 'abandoned' > 'in_progress'
        if (memSession.status === 'completed') {
          continue;
        }
        if (diskSession.status === 'completed') {
          registry.sessions.set(id, diskSession);
          continue;
        }
        if (
          diskSession.status === 'abandoned' ||
          registry.abandonedSessionIds.has(id)
        ) {
          if (memSession.status !== 'abandoned') {
            registry.sessions.set(
              id,
              diskSession.status === 'abandoned'
                ? diskSession
                : abandonPlacementSession(memSession, 'refresh').session
            );
          }
          continue;
        }
        if (
          (diskSession.steps?.length || 0) > (memSession.steps?.length || 0) ||
          (diskSession.updatedAt || '') > (memSession.updatedAt || '')
        ) {
          registry.sessions.set(id, diskSession);
        }
      }
    }

    if (parsed?.latestByUser && typeof parsed.latestByUser === 'object') {
      for (const [uid, sid] of Object.entries(parsed.latestByUser)) {
        if (typeof sid === 'string' && !registry.latestSessionIdByUserId.has(uid)) {
          registry.latestSessionIdByUserId.set(uid, sid);
        }
      }
    }
  } catch {
    // Non-fatal in read-only or ephemeral environments
  }
}

function getPlacementRegistry(): PlacementGlobalRegistry {
  if (!globalForPlacement.__fluentLoopPlacementRegistry) {
    globalForPlacement.__fluentLoopPlacementRegistry = {
      sessions: new Map<string, PlacementSession>(),
      latestSessionIdByUserId: new Map<string, string>(),
      abandonedSessionIds: new Set<string>(),
      hydratedFromDisk: false,
    };
  }
  const registry = globalForPlacement.__fluentLoopPlacementRegistry;
  if (!registry.abandonedSessionIds) {
    registry.abandonedSessionIds = new Set<string>();
  }
  mergeDiskStateIntoRegistry(registry);
  registry.hydratedFromDisk = true;
  return registry;
}

function syncRegistryToDisk(): void {
  try {
    const registry = getPlacementRegistry();
    const sessionsObj: Record<string, PlacementSession> = {};
    for (const [id, session] of registry.sessions.entries()) {
      sessionsObj[id] = session;
    }
    const latestObj: Record<string, string> = {};
    for (const [uid, sid] of registry.latestSessionIdByUserId.entries()) {
      latestObj[uid] = sid;
    }
    const abandonedArr = Array.from(registry.abandonedSessionIds.values());
    fs.writeFileSync(
      PLACEMENT_CACHE_FILE,
      JSON.stringify({
        sessions: sessionsObj,
        latestByUser: latestObj,
        abandonedSessionIds: abandonedArr,
      }),
      'utf8'
    );
  } catch {
    // Ignore disk cache write errors
  }
}

export function resetServerPlacementRepositoryForTests(): void {
  const registry = getPlacementRegistry();
  registry.sessions.clear();
  registry.latestSessionIdByUserId.clear();
  registry.abandonedSessionIds.clear();
  try {
    if (fs.existsSync(PLACEMENT_CACHE_FILE)) {
      fs.unlinkSync(PLACEMENT_CACHE_FILE);
    }
  } catch {
    // Ignore
  }
}

/**
 * Enforces strict learner isolation so Account B can never access, resume,
 * abandon, save drafts into, or submit Account A's placement assessment session.
 */
export function canUserAccessPlacementSession(
  session: PlacementSession,
  requestUserId?: string
): boolean {
  if (requestUserId === undefined || requestUserId.trim() === '') {
    return true;
  }
  const normalizedRequester = requestUserId.trim();
  const sessionOwner = session.userId?.trim() || 'guest';
  const linkedOwner = session.linkedToUserId?.trim();

  if (linkedOwner) {
    return normalizedRequester === linkedOwner || normalizedRequester === sessionOwner;
  }

  if (sessionOwner !== 'guest') {
    return normalizedRequester === sessionOwner;
  }

  return normalizedRequester === 'guest';
}

/**
 * Marks an unfinished placement session as abandoned on the server so it can never be
 * resumed, updated with draft answers, or submitted later.
 * Never resets or modifies completed placement assessments.
 */
export function abandonPlacementSessionOnServer(params: {
  sessionId: string;
  userId?: string;
  reason?: PlacementAbandonReason;
  nowMs?: number;
}): {
  session: PlacementSession | null;
  abandoned: boolean;
  alreadyCompleted: boolean;
  alreadyAbandoned: boolean;
  serverNowMs: number;
} {
  const nowMs =
    typeof params.nowMs === 'number' && Number.isFinite(params.nowMs)
      ? Math.floor(params.nowMs)
      : Date.now();
  const sessionId = params.sessionId?.trim();
  if (!sessionId) {
    throw new Error('sessionId is required to abandon a placement session.');
  }

  const registry = getPlacementRegistry();
  const existing = registry.sessions.get(sessionId);

  if (existing) {
    if (!canUserAccessPlacementSession(existing, params.userId)) {
      throw new Error('Placement session belongs to a different learner account.');
    }

    if (existing.status === 'completed') {
      return {
        session: existing,
        abandoned: false,
        alreadyCompleted: true,
        alreadyAbandoned: false,
        serverNowMs: nowMs,
      };
    }

    const result = abandonPlacementSession(
      existing,
      params.reason || 'navigation_exit',
      nowMs
    );
    registry.sessions.set(sessionId, result.session);
    registry.abandonedSessionIds.add(sessionId);

    const ownerUid = existing.userId?.trim();
    if (ownerUid && registry.latestSessionIdByUserId.get(ownerUid) === sessionId) {
      registry.latestSessionIdByUserId.delete(ownerUid);
    }
    syncRegistryToDisk();

    return {
      session: result.session,
      abandoned: true,
      alreadyCompleted: false,
      alreadyAbandoned: result.alreadyAbandoned,
      serverNowMs: nowMs,
    };
  }

  const wasAlreadyInSet = registry.abandonedSessionIds.has(sessionId);
  registry.abandonedSessionIds.add(sessionId);
  syncRegistryToDisk();

  return {
    session: null,
    abandoned: true,
    alreadyCompleted: false,
    alreadyAbandoned: wasAlreadyInSet,
    serverNowMs: nowMs,
  };
}

/**
 * Starts a fresh placement assessment session or returns an already-completed placement session.
 * IMPORTANT: Unfinished (`in_progress`) or `'abandoned'` sessions are NEVER resumed.
 * Any unfinished session referenced by `sessionId`, `abandonSessionId`, or `latestSessionIdByUserId`
 * is marked `'abandoned'` and a brand-new 20-minute session with a new unique ID is created.
 */
export function startOrResumePlacementSessionOnServer(params: {
  sessionId?: string;
  abandonSessionId?: string;
  abandonSessionIds?: string[];
  abandonReason?: PlacementAbandonReason;
  userId?: string;
  isAnonymous?: boolean;
  forceNew?: boolean;
  nowMs?: number;
  clientRecoveryStartedAtMs?: number;
  clientRecoveryDraftAnswers?: Record<string, Record<string, string>>;
  clientRecoverySteps?: Array<{
    passageId: string;
    answers: Record<string, string>;
  }>;
}): {
  session: PlacementSession;
  activePassage: ReadingLesson | null;
  serverNowMs: number;
} {
  const nowMs =
    typeof params.nowMs === 'number' && Number.isFinite(params.nowMs)
      ? Math.floor(params.nowMs)
      : Date.now();
  const userId = params.userId?.trim() || 'guest';
  const isAnonymous = params.isAnonymous ?? true;
  const diagnosticBank = getAllDiagnosticPassages();
  const registry = getPlacementRegistry();

  const idsToAbandon = new Set<string>();
  if (params.abandonSessionId?.trim()) {
    idsToAbandon.add(params.abandonSessionId.trim());
  }
  if (Array.isArray(params.abandonSessionIds)) {
    for (const rawId of params.abandonSessionIds.slice(0, 50)) {
      if (typeof rawId === 'string' && rawId.trim()) {
        idsToAbandon.add(rawId.trim());
      }
    }
  }

  for (const abandonId of idsToAbandon) {
    const existingToAbandon = registry.sessions.get(abandonId);
    if (!existingToAbandon || canUserAccessPlacementSession(existingToAbandon, userId)) {
      abandonPlacementSessionOnServer({
        sessionId: abandonId,
        userId,
        reason: params.abandonReason || 'refresh',
        nowMs,
      });
    }
  }

  const requestedSessionId = params.sessionId?.trim();
  if (requestedSessionId) {
    const existing = registry.sessions.get(requestedSessionId);
    if (existing && canUserAccessPlacementSession(existing, userId)) {
      if (existing.status === 'completed' && !params.forceNew) {
        return {
          session: existing,
          activePassage: null,
          serverNowMs: nowMs,
        };
      }
      if (existing.status === 'in_progress') {
        const abandoned = abandonPlacementSession(
          existing,
          params.abandonReason || 'refresh',
          nowMs
        );
        registry.sessions.set(existing.id, abandoned.session);
        registry.abandonedSessionIds.add(existing.id);
      }
    }
  }

  if (userId !== 'guest') {
    const latestForUser = registry.latestSessionIdByUserId.get(userId);
    if (latestForUser) {
      const latestSession = registry.sessions.get(latestForUser);
      if (latestSession && canUserAccessPlacementSession(latestSession, userId)) {
        if (
          latestSession.status === 'completed' &&
          !params.forceNew &&
          !requestedSessionId &&
          idsToAbandon.size === 0
        ) {
          return {
            session: latestSession,
            activePassage: null,
            serverNowMs: nowMs,
          };
        }
        if (latestSession.status === 'in_progress') {
          const abandoned = abandonPlacementSession(
            latestSession,
            params.abandonReason || 'superseded',
            nowMs
          );
          registry.sessions.set(latestSession.id, abandoned.session);
          registry.abandonedSessionIds.add(latestSession.id);
        }
      }
    }
  }

  let fresh = createPlacementSession(
    userId,
    isAnonymous,
    diagnosticBank,
    undefined,
    nowMs
  );

  // Only honor a caller-supplied custom sessionId if it has NEVER been used or abandoned
  // and forceNew is false (e.g., initial creation with a deterministic test ID).
  if (
    requestedSessionId &&
    !params.forceNew &&
    /^[a-zA-Z0-9_-]{4,128}$/.test(requestedSessionId) &&
    !registry.sessions.has(requestedSessionId) &&
    !registry.abandonedSessionIds.has(requestedSessionId)
  ) {
    fresh = { ...fresh, id: requestedSessionId };
  }

  // Ensure the new session ID never collides with any existing or abandoned session ID
  while (
    registry.sessions.has(fresh.id) ||
    registry.abandonedSessionIds.has(fresh.id)
  ) {
    fresh = {
      ...fresh,
      id: `ps-${nowMs}-${Math.random().toString(36).slice(2, 9)}`,
    };
  }

  registry.sessions.set(fresh.id, fresh);
  if (userId !== 'guest') {
    registry.latestSessionIdByUserId.set(userId, fresh.id);
  }
  syncRegistryToDisk();

  const firstPassage = fresh.activePassageId
    ? getDiagnosticPassageById(fresh.activePassageId)
    : null;

  return {
    session: fresh,
    activePassage: firstPassage ? sanitizeLessonForLearner(firstPassage) : null,
    serverNowMs: nowMs,
  };
}

export function savePlacementDraftAnswersOnServer(params: {
  sessionId: string;
  userId?: string;
  passageId: string;
  answers: Record<string, string>;
  nowMs?: number;
}): {
  accepted: boolean;
  lateRejected: boolean;
  session: PlacementSession;
  serverNowMs: number;
} {
  const nowMs =
    typeof params.nowMs === 'number' && Number.isFinite(params.nowMs)
      ? Math.floor(params.nowMs)
      : Date.now();
  const registry = getPlacementRegistry();
  const diagnosticBank = getAllDiagnosticPassages();
  const session = registry.sessions.get(params.sessionId);

  if (
    registry.abandonedSessionIds.has(params.sessionId) ||
    session?.status === 'abandoned'
  ) {
    if (session && !canUserAccessPlacementSession(session, params.userId)) {
      throw new Error('Placement session belongs to a different learner account.');
    }
    throw new Error('Placement session has been abandoned and cannot accept draft answers.');
  }

  if (!session) {
    throw new Error(`Placement session "${params.sessionId}" not found.`);
  }

  if (!canUserAccessPlacementSession(session, params.userId)) {
    throw new Error('Placement session belongs to a different learner account.');
  }

  if (session.status === 'completed') {
    return {
      accepted: false,
      lateRejected: true,
      session,
      serverNowMs: nowMs,
    };
  }

  if (isPlacementSessionExpired(session, nowMs)) {
    const finalized = finalizePlacementSessionOnTimeout(
      session,
      diagnosticBank,
      undefined,
      undefined,
      nowMs
    );
    registry.sessions.set(finalized.session.id, finalized.session);
    syncRegistryToDisk();
    return {
      accepted: false,
      lateRejected: true,
      session: finalized.session,
      serverNowMs: nowMs,
    };
  }

  const updatedResult = saveDraftAnswersInPlacementSession(
    session,
    params.passageId,
    params.answers,
    nowMs
  );
  registry.sessions.set(updatedResult.session.id, updatedResult.session);
  syncRegistryToDisk();

  return {
    accepted: updatedResult.accepted,
    lateRejected: updatedResult.lateRejected,
    session: updatedResult.session,
    serverNowMs: nowMs,
  };
}

export function submitPlacementPassageOnServer(params: {
  sessionId: string;
  userId?: string;
  passageId: string;
  answers: Record<string, string>;
  autoSubmitOnTimeout?: boolean;
  nowMs?: number;
  clientRecoveryStartedAtMs?: number;
  priorStepsForRecovery?: Array<{
    passageId: string;
    answers: Record<string, string>;
  }>;
}): {
  session: PlacementSession;
  stepResult: PlacementSession['steps'][number] | null;
  nextPassage: ReadingLesson | null;
  wasDuplicate: boolean;
  lateRejected: boolean;
  timedOut: boolean;
  serverNowMs: number;
} {
  const nowMs =
    typeof params.nowMs === 'number' && Number.isFinite(params.nowMs)
      ? Math.floor(params.nowMs)
      : Date.now();
  const diagnosticBank = getAllDiagnosticPassages();
  const passage = getDiagnosticPassageById(params.passageId);
  if (!passage) {
    throw new Error(`Diagnostic passage "${params.passageId}" not found.`);
  }

  const registry = getPlacementRegistry();
  let session = registry.sessions.get(params.sessionId);

  if (
    registry.abandonedSessionIds.has(params.sessionId) ||
    session?.status === 'abandoned'
  ) {
    if (session && !canUserAccessPlacementSession(session, params.userId)) {
      throw new Error('Placement session belongs to a different learner account.');
    }
    throw new Error('Placement session has been abandoned and cannot accept submissions.');
  }

  if (!session) {
    const safeStartedAtMs =
      typeof params.clientRecoveryStartedAtMs === 'number' &&
      Number.isFinite(params.clientRecoveryStartedAtMs) &&
      params.clientRecoveryStartedAtMs > 0
        ? Math.min(nowMs, Math.floor(params.clientRecoveryStartedAtMs))
        : nowMs;
    const userId = params.userId?.trim() || 'guest';
    let reconstructed = createPlacementSession(
      userId,
      userId === 'guest',
      diagnosticBank,
      undefined,
      safeStartedAtMs
    );
    if (/^[a-zA-Z0-9_-]{4,128}$/.test(params.sessionId)) {
      reconstructed = { ...reconstructed, id: params.sessionId };
    }
    if (Array.isArray(params.priorStepsForRecovery)) {
      for (const rawStep of params.priorStepsForRecovery.slice(0, 3)) {
        const priorPassage = getDiagnosticPassageById(rawStep.passageId);
        if (!priorPassage) continue;
        const appliedPrior = applyDiagnosticSubmissionToSession(
          reconstructed,
          priorPassage,
          rawStep.answers || {},
          diagnosticBank,
          undefined,
          safeStartedAtMs
        );
        reconstructed = appliedPrior.session;
      }
    }
    registry.sessions.set(reconstructed.id, reconstructed);
    session = reconstructed;
  }

  if (!canUserAccessPlacementSession(session, params.userId)) {
    throw new Error('Placement session belongs to a different learner account.');
  }

  // Prevent duplicate final submissions idempotently
  if (session.status === 'completed') {
    const lastStep =
      session.steps.find((s) => s.passageId === params.passageId) ||
      session.steps[session.steps.length - 1] ||
      null;
    return {
      session,
      stepResult: lastStep,
      nextPassage: null,
      wasDuplicate: true,
      lateRejected: !params.autoSubmitOnTimeout && isPlacementSessionExpired(session, nowMs),
      timedOut: Boolean(session.timedOut),
      serverNowMs: nowMs,
    };
  }

  // Automatic timeout submission triggered when timer hits 00:00
  if (params.autoSubmitOnTimeout) {
    const withinNetworkGrace =
      nowMs <= session.deadlineAtMs + SERVER_NETWORK_LATENCY_TOLERANCE_MS;
    const savedDrafts = session.draftAnswersByPassage?.[passage.id] || {};
    const preDeadlineAnswers = withinNetworkGrace
      ? { ...savedDrafts, ...(params.answers || {}) }
      : savedDrafts;

    const finalized = finalizePlacementSessionOnTimeout(
      session,
      diagnosticBank,
      preDeadlineAnswers,
      undefined,
      nowMs
    );

    registry.sessions.set(finalized.session.id, finalized.session);
    if (params.userId && params.userId !== 'guest') {
      registry.latestSessionIdByUserId.set(params.userId, finalized.session.id);
    }
    syncRegistryToDisk();

    return {
      session: finalized.session,
      stepResult: finalized.finalStepResult,
      nextPassage: null,
      wasDuplicate: finalized.wasAlreadyCompleted,
      lateRejected: false,
      timedOut: true,
      serverNowMs: nowMs,
    };
  }

  // Strict server-side deadline validation: reject manual submissions arriving after deadlineAtMs
  if (isPlacementSessionExpired(session, nowMs)) {
    const finalized = finalizePlacementSessionOnTimeout(
      session,
      diagnosticBank,
      undefined,
      undefined,
      nowMs
    );

    registry.sessions.set(finalized.session.id, finalized.session);
    if (params.userId && params.userId !== 'guest') {
      registry.latestSessionIdByUserId.set(params.userId, finalized.session.id);
    }
    syncRegistryToDisk();

    return {
      session: finalized.session,
      stepResult: finalized.finalStepResult,
      nextPassage: null,
      wasDuplicate: false,
      lateRejected: true,
      timedOut: true,
      serverNowMs: nowMs,
    };
  }

  const applied = applyDiagnosticSubmissionToSession(
    session,
    passage,
    params.answers,
    diagnosticBank,
    undefined,
    nowMs
  );

  registry.sessions.set(applied.session.id, applied.session);
  if (params.userId && params.userId !== 'guest') {
    registry.latestSessionIdByUserId.set(params.userId, applied.session.id);
  }
  syncRegistryToDisk();

  return {
    session: applied.session,
    stepResult: applied.stepResult,
    nextPassage: applied.nextPassage
      ? sanitizeLessonForLearner(applied.nextPassage)
      : null,
    wasDuplicate: applied.wasDuplicate,
    lateRejected: false,
    timedOut: false,
    serverNowMs: nowMs,
  };
}

export function finalizeExpiredPlacementSessionOnServer(params: {
  sessionId: string;
  userId?: string;
  preDeadlineActiveAnswers?: Record<string, string>;
  nowMs?: number;
}): {
  session: PlacementSession;
  stepResult: PlacementSession['steps'][number] | null;
  wasDuplicate: boolean;
  serverNowMs: number;
} {
  const nowMs =
    typeof params.nowMs === 'number' && Number.isFinite(params.nowMs)
      ? Math.floor(params.nowMs)
      : Date.now();
  const registry = getPlacementRegistry();
  const session = registry.sessions.get(params.sessionId);

  if (
    registry.abandonedSessionIds.has(params.sessionId) ||
    session?.status === 'abandoned'
  ) {
    if (session && !canUserAccessPlacementSession(session, params.userId)) {
      throw new Error('Placement session belongs to a different learner account.');
    }
    throw new Error('Placement session has been abandoned and cannot be finalized.');
  }

  if (!session) {
    throw new Error(`Placement session "${params.sessionId}" not found.`);
  }
  if (!canUserAccessPlacementSession(session, params.userId)) {
    throw new Error('Placement session belongs to a different learner account.');
  }

  const diagnosticBank = getAllDiagnosticPassages();
  const finalized = finalizePlacementSessionOnTimeout(
    session,
    diagnosticBank,
    params.preDeadlineActiveAnswers,
    undefined,
    nowMs
  );

  registry.sessions.set(finalized.session.id, finalized.session);
  syncRegistryToDisk();

  return {
    session: finalized.session,
    stepResult: finalized.finalStepResult,
    wasDuplicate: finalized.wasAlreadyCompleted,
    serverNowMs: nowMs,
  };
}

export function linkPlacementSessionToUserOnServer(params: {
  sessionId: string;
  targetUserId: string;
  recoverySteps?: Array<{
    passageId: string;
    answers: Record<string, string>;
  }>;
}): PlacementSession | null {
  const registry = getPlacementRegistry();
  if (registry.abandonedSessionIds.has(params.sessionId)) {
    return null;
  }

  let session = registry.sessions.get(params.sessionId);
  if (
    !session &&
    Array.isArray(params.recoverySteps) &&
    params.recoverySteps.length >= 3
  ) {
    const diagnosticBank = getAllDiagnosticPassages();
    let recovered = createPlacementSession(
      params.targetUserId,
      false,
      diagnosticBank
    );
    if (/^[a-zA-Z0-9_-]{4,128}$/.test(params.sessionId)) {
      recovered = { ...recovered, id: params.sessionId };
    }
    for (const rawStep of params.recoverySteps.slice(0, 3)) {
      const passage = getDiagnosticPassageById(rawStep.passageId);
      if (!passage) continue;
      const applied = applyDiagnosticSubmissionToSession(
        recovered,
        passage,
        rawStep.answers || {},
        diagnosticBank
      );
      recovered = applied.session;
    }
    if (recovered.status === 'completed') {
      registry.sessions.set(recovered.id, recovered);
      session = recovered;
    }
  }

  if (!session || session.status === 'abandoned') return null;

  // Do not allow linking a session that already belongs to a different non-anonymous authenticated user
  if (
    !session.isAnonymous &&
    session.userId !== 'guest' &&
    session.userId !== params.targetUserId &&
    session.linkedToUserId !== params.targetUserId
  ) {
    return null;
  }

  const updated: PlacementSession = {
    ...session,
    userId: session.userId === 'guest' ? params.targetUserId : session.userId,
    linkedToUserId: params.targetUserId,
    isAnonymous: false,
    updatedAt: new Date().toISOString(),
  };

  registry.sessions.set(updated.id, updated);
  registry.latestSessionIdByUserId.set(params.targetUserId, updated.id);
  syncRegistryToDisk();
  return updated;
}

export function getPlacementSessionByIdOnServer(
  sessionId: string
): PlacementSession | null {
  const registry = getPlacementRegistry();
  return registry.sessions.get(sessionId) || null;
}
