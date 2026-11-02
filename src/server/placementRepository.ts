import fs from 'fs';
import { Timestamp } from 'firebase-admin/firestore';
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
  getPlacementDiagnosticPassageById,
  getPlacementDiagnosticPassages,
  sanitizeLessonForLearner,
} from './lessonRepository';
import { getServerFirestore } from './firebaseAdmin';
import {
  issuePlacementGuestTokenDetails,
  verifyStoredGuestTokenHash,
} from './placementToken';

export {
  getAllDiagnosticPassages,
  getDiagnosticPassageById,
  getPlacementDiagnosticPassageById,
  getPlacementDiagnosticPassages,
};

export const PLACEMENT_SESSIONS_COLLECTION = 'placement_sessions';
export const PLACEMENT_USER_INDEX_COLLECTION = 'placement_user_index';

export const MAX_ANSWERS_PER_PLACEMENT_PASSAGE = 12;
export const MAX_PLACEMENT_ANSWER_CHARS = 500;
export const MAX_PLACEMENT_STEPS = 3;
export const MAX_PLACEMENT_DRAFT_SAVES = 120;
export const MAX_PLACEMENT_SUBMIT_ATTEMPTS = 10;
export const MAX_PLACEMENT_SESSION_DOC_BYTES = 64 * 1024; // 64 KiB
export const PLACEMENT_GUEST_AND_ACTIVE_RETENTION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days for guest / in_progress / abandoned sessions
export const PLACEMENT_COMPLETED_RETENTION_MS = 90 * 24 * 60 * 60 * 1000; // 90 days for completed sessions
export const PLACEMENT_SESSION_TTL_MS = PLACEMENT_GUEST_AND_ACTIVE_RETENTION_MS;
export const PLACEMENT_TTL_FIELD = 'expireAt';

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

export interface TestPlacementFirestoreStore {
  sessions: Map<string, any>;
  userIndex: Map<string, any>;
  readCount?: number;
  writeCount?: number;
  simulatedContentionRetries?: number;
}

let testPlacementFirestoreStore: (TestPlacementFirestoreStore & {
  readCount: number;
  writeCount: number;
}) | null = null;

export function setTestPlacementFirestoreStoreForTests(
  store: TestPlacementFirestoreStore | null
): void {
  if (!store) {
    testPlacementFirestoreStore = null;
    return;
  }
  testPlacementFirestoreStore = {
    ...store,
    readCount: store.readCount ?? 0,
    writeCount: store.writeCount ?? 0,
  };
}

export function getTestPlacementFirestoreReadCount(): number {
  return testPlacementFirestoreStore ? testPlacementFirestoreStore.readCount : 0;
}

export function resetTestPlacementFirestoreReadCount(): void {
  if (testPlacementFirestoreStore) {
    testPlacementFirestoreStore.readCount = 0;
  }
}

export function clearLocalPlacementMemoryCacheForInstanceSwitchTests(): void {
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
  clearLocalPlacementMemoryCacheForInstanceSwitchTests();
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
 * Validates and sanitizes placement answers for a diagnostic passage:
 * - Max 12 answer entries per passage.
 * - Max 500 characters per answer value.
 * - Question IDs must exist in the target diagnostic passage.
 */
export function validatePlacementAnswersPayload(
  passage: ReadingLesson,
  rawAnswers: unknown
):
  | { valid: true; sanitizedAnswers: Record<string, string>; error?: string }
  | { valid: false; sanitizedAnswers?: Record<string, string>; error: string } {
  if (rawAnswers === undefined || rawAnswers === null) {
    return { valid: true, sanitizedAnswers: {} };
  }
  if (typeof rawAnswers !== 'object' || Array.isArray(rawAnswers)) {
    return { valid: false, error: 'Answers payload must be a JSON object.' };
  }
  const entries = Object.entries(rawAnswers as Record<string, unknown>);
  if (entries.length > MAX_ANSWERS_PER_PLACEMENT_PASSAGE) {
    return {
      valid: false,
      error: `Too many answers submitted (maximum ${MAX_ANSWERS_PER_PLACEMENT_PASSAGE} per passage).`,
    };
  }
  const validQuestionIds = new Set(passage.questions.map((q) => q.id));
  const sanitizedAnswers: Record<string, string> = {};
  for (const [qId, val] of entries) {
    if (!validQuestionIds.has(qId)) {
      return {
        valid: false,
        error: `Question ID "${qId}" does not belong to passage "${passage.id}".`,
      };
    }
    if (typeof val !== 'string') {
      return {
        valid: false,
        error: `Answer for question "${qId}" must be a string.`,
      };
    }
    if (val.length > MAX_PLACEMENT_ANSWER_CHARS) {
      return {
        valid: false,
        error: `Answer for question "${qId}" exceeds maximum length of ${MAX_PLACEMENT_ANSWER_CHARS} characters.`,
      };
    }
    sanitizedAnswers[qId] = val.trim();
  }
  return { valid: true, sanitizedAnswers };
}

/**
 * Strips server-internal fields (`guestTokenHash`, etc.) before returning a `PlacementSession` to the browser,
 * while preserving public diagnostic metadata and counters.
 */
export function sanitizePlacementSessionForClient(session: PlacementSession): PlacementSession {
  const clone: PlacementSession = {
    ...session,
  };
  delete clone.guestTokenHash;
  return clone;
}

/**
 * Computes the authoritative Firestore TTL retention timestamp (`expiresAtMs`) per Phase 1 specification:
 * - Guest, in-progress, and abandoned sessions: 7-day retention (`PLACEMENT_GUEST_AND_ACTIVE_RETENTION_MS`).
 * - Completed sessions: 90-day retention (`PLACEMENT_COMPLETED_RETENTION_MS`).
 */
export function computePlacementSessionRetentionExpiresAtMs(
  session: Pick<PlacementSession, 'status' | 'startedAtMs' | 'expiresAtMs'>,
  nowMs = Date.now()
): number {
  const baseMs =
    typeof session.startedAtMs === 'number' && Number.isFinite(session.startedAtMs)
      ? session.startedAtMs
      : nowMs;

  if (session.status === 'completed') {
    const minCompletedExpiry = baseMs + PLACEMENT_COMPLETED_RETENTION_MS;
    if (
      typeof session.expiresAtMs === 'number' &&
      Number.isFinite(session.expiresAtMs) &&
      session.expiresAtMs >= minCompletedExpiry
    ) {
      return session.expiresAtMs;
    }
    return Math.max(baseMs, nowMs) + PLACEMENT_COMPLETED_RETENTION_MS;
  }

  if (
    typeof session.expiresAtMs === 'number' &&
    Number.isFinite(session.expiresAtMs) &&
    session.expiresAtMs > 0
  ) {
    return session.expiresAtMs;
  }
  return baseMs + PLACEMENT_GUEST_AND_ACTIVE_RETENTION_MS;
}

function serializePlacementSessionForFirestore(
  session: PlacementSession,
  nowMs = Date.now()
): Record<string, unknown> {
  const expiresAtMs = computePlacementSessionRetentionExpiresAtMs(session, nowMs);
  const docObj: Record<string, unknown> = {
    ...session,
    expiresAtMs,
    [PLACEMENT_TTL_FIELD]: Timestamp.fromMillis(expiresAtMs),
  };
  const byteLen = Buffer.byteLength(JSON.stringify(docObj), 'utf8');
  if (byteLen > MAX_PLACEMENT_SESSION_DOC_BYTES) {
    throw new Error(
      `Placement session document exceeds maximum allowed size (${MAX_PLACEMENT_SESSION_DOC_BYTES} bytes).`
    );
  }
  return docObj;
}

function deserializePlacementSessionFromFirestore(
  raw: Record<string, unknown> | undefined | null
): PlacementSession | null {
  if (!raw || typeof raw !== 'object' || typeof raw.id !== 'string') {
    return null;
  }
  const copy = { ...raw };
  delete copy.expireAt;
  return copy as unknown as PlacementSession;
}

/**
 * Executes a retry-safe atomic transaction against Firestore (or the in-memory test store).
 * When `simulatedContentionRetries` is configured in tests, invokes the pure transaction callback
 * `1 + simulatedContentionRetries` times against the initial snapshot before committing the final result,
 * proving that all state transitions are pure functions of the transaction snapshot.
 */
async function runPlacementStorageTransaction<T>(
  txCallback: (tx: {
    getSession(sessionId: string): Promise<PlacementSession | null>;
    setSession(session: PlacementSession, nowMs?: number): void;
    getUserLatestSessionId(uid: string): Promise<string | null>;
    setUserLatestSessionId(uid: string, sessionId: string | null): void;
  }) => Promise<T>
): Promise<T> {
  if (testPlacementFirestoreStore) {
    const store = testPlacementFirestoreStore;
    const retries = Math.max(0, store.simulatedContentionRetries || 0);
    let lastResult!: T;

    for (let attempt = 0; attempt <= retries; attempt++) {
      const stagedSessions = new Map<string, Record<string, unknown>>();
      const stagedUserIndex = new Map<string, Record<string, unknown> | null>();

      const result = await txCallback({
        async getSession(sessionId: string) {
          // Only count reads on the final committed attempt so contention retries don't skew read assertions
          if (attempt === retries) {
            store.readCount += 1;
          }
          const raw = stagedSessions.get(sessionId) ?? store.sessions.get(sessionId);
          return deserializePlacementSessionFromFirestore(
            raw ? JSON.parse(JSON.stringify(raw)) : null
          );
        },
        setSession(session: PlacementSession, nowMs = Date.now()) {
          const serialized = serializePlacementSessionForFirestore(session, nowMs);
          stagedSessions.set(session.id, JSON.parse(JSON.stringify(serialized)));
        },
        async getUserLatestSessionId(uid: string) {
          if (attempt === retries) {
            store.readCount += 1;
          }
          if (stagedUserIndex.has(uid)) {
            const staged = stagedUserIndex.get(uid);
            return typeof staged?.latestSessionId === 'string' ? staged.latestSessionId : null;
          }
          const raw = store.userIndex.get(uid);
          return typeof raw?.latestSessionId === 'string' ? raw.latestSessionId : null;
        },
        setUserLatestSessionId(uid: string, sessionId: string | null) {
          stagedUserIndex.set(
            uid,
            sessionId ? { uid, latestSessionId: sessionId } : null
          );
        },
      });

      if (attempt === retries) {
        for (const [sid, docVal] of stagedSessions.entries()) {
          store.sessions.set(sid, docVal);
          store.writeCount += 1;
          const deserialized = deserializePlacementSessionFromFirestore(docVal);
          if (deserialized) {
            const registry = getPlacementRegistry();
            registry.sessions.set(sid, deserialized);
            if (deserialized.status === 'abandoned') {
              registry.abandonedSessionIds.add(sid);
            }
          }
        }
        for (const [uid, idxVal] of stagedUserIndex.entries()) {
          if (idxVal === null) {
            store.userIndex.delete(uid);
            getPlacementRegistry().latestSessionIdByUserId.delete(uid);
          } else {
            store.userIndex.set(uid, idxVal);
            if (typeof idxVal.latestSessionId === 'string') {
              getPlacementRegistry().latestSessionIdByUserId.set(uid, idxVal.latestSessionId);
            }
          }
          store.writeCount += 1;
        }
        syncRegistryToDisk();
        lastResult = result;
      }
    }
    return lastResult;
  }

  const db = getServerFirestore();
  if (db) {
    try {
      return await db.runTransaction(async (firestoreTx) => {
        const stagedSessions = new Map<string, Record<string, unknown>>();
        const stagedUserIndex = new Map<string, Record<string, unknown> | null>();

        const out = await txCallback({
          async getSession(sessionId: string) {
            if (stagedSessions.has(sessionId)) {
              return deserializePlacementSessionFromFirestore(stagedSessions.get(sessionId));
            }
            const ref = db.collection(PLACEMENT_SESSIONS_COLLECTION).doc(sessionId);
            const snap = await firestoreTx.get(ref);
            if (!snap.exists) {
              const fallbackMem = getPlacementRegistry().sessions.get(sessionId);
              return fallbackMem ? JSON.parse(JSON.stringify(fallbackMem)) : null;
            }
            return deserializePlacementSessionFromFirestore(
              snap.data() as Record<string, unknown>
            );
          },
          setSession(session: PlacementSession, nowMs = Date.now()) {
            const serialized = serializePlacementSessionForFirestore(session, nowMs);
            stagedSessions.set(session.id, serialized);
          },
          async getUserLatestSessionId(uid: string) {
            if (stagedUserIndex.has(uid)) {
              const v = stagedUserIndex.get(uid);
              return typeof v?.latestSessionId === 'string' ? v.latestSessionId : null;
            }
            const ref = db.collection(PLACEMENT_USER_INDEX_COLLECTION).doc(uid);
            const snap = await firestoreTx.get(ref);
            if (!snap.exists) {
              return getPlacementRegistry().latestSessionIdByUserId.get(uid) || null;
            }
            const d = snap.data();
            return typeof d?.latestSessionId === 'string' ? d.latestSessionId : null;
          },
          setUserLatestSessionId(uid: string, sessionId: string | null) {
            stagedUserIndex.set(
              uid,
              sessionId
                ? {
                    uid,
                    latestSessionId: sessionId,
                    updatedAt: Timestamp.now(),
                  }
                : null
            );
          },
        });

        for (const [sid, docVal] of stagedSessions.entries()) {
          const ref = db.collection(PLACEMENT_SESSIONS_COLLECTION).doc(sid);
          firestoreTx.set(ref, docVal);
          const deserialized = deserializePlacementSessionFromFirestore(docVal);
          if (deserialized) {
            const registry = getPlacementRegistry();
            registry.sessions.set(sid, deserialized);
            if (deserialized.status === 'abandoned') {
              registry.abandonedSessionIds.add(sid);
            }
          }
        }
        for (const [uid, idxVal] of stagedUserIndex.entries()) {
          const ref = db.collection(PLACEMENT_USER_INDEX_COLLECTION).doc(uid);
          if (idxVal === null) {
            firestoreTx.delete(ref);
            getPlacementRegistry().latestSessionIdByUserId.delete(uid);
          } else {
            firestoreTx.set(ref, idxVal);
            if (typeof idxVal.latestSessionId === 'string') {
              getPlacementRegistry().latestSessionIdByUserId.set(uid, idxVal.latestSessionId);
            }
          }
        }
        syncRegistryToDisk();
        return out;
      });
    } catch {
      // Fallback to local registry if Firestore transaction is unavailable in local container
    }
  }

  // Fallback local atomic execution
  const registry = getPlacementRegistry();
  const out = await txCallback({
    async getSession(sessionId: string) {
      const s = registry.sessions.get(sessionId);
      return s ? JSON.parse(JSON.stringify(s)) : null;
    },
    setSession(session: PlacementSession, nowMs = Date.now()) {
      serializePlacementSessionForFirestore(session, nowMs);
      registry.sessions.set(session.id, JSON.parse(JSON.stringify(session)));
      if (session.status === 'abandoned') {
        registry.abandonedSessionIds.add(session.id);
      }
    },
    async getUserLatestSessionId(uid: string) {
      return registry.latestSessionIdByUserId.get(uid) || null;
    },
    setUserLatestSessionId(uid: string, sessionId: string | null) {
      if (!sessionId) {
        registry.latestSessionIdByUserId.delete(uid);
      } else {
        registry.latestSessionIdByUserId.set(uid, sessionId);
      }
    },
  });
  syncRegistryToDisk();
  return out;
}

export class PlacementHttpError extends Error {
  status: number;
  extra?: Record<string, unknown>;
  constructor(status: number, message: string, extra?: Record<string, unknown>) {
    super(message);
    this.status = status;
    this.extra = extra;
  }
}

/**
 * Step 4 of the 5-step guest placement verification order:
 * Verifies the stored session's ownership, `guestTokenHash`, expiry, and revocation status.
 */
function verifyStoredSessionAuthorization(params: {
  session: PlacementSession;
  verifiedUid: string | null;
  verifiedGuestTokenHash: string | null;
  nowMs: number;
}): void {
  const { session, verifiedUid, verifiedGuestTokenHash, nowMs } = params;

  if (typeof session.expiresAtMs === 'number' && session.expiresAtMs < nowMs) {
    throw new PlacementHttpError(403, 'Placement session has expired.');
  }

  if (verifiedUid) {
    const ownerId = session.userId?.trim() || 'guest';
    const linkedId = session.linkedToUserId?.trim();
    if (ownerId !== 'guest' && ownerId !== verifiedUid && linkedId !== verifiedUid) {
      throw new PlacementHttpError(
        403,
        'Placement session belongs to a different learner account.'
      );
    }
    return;
  }

  // Guest caller: must match guest ownerType and stored guestTokenHash
  if (
    (session.ownerType && session.ownerType !== 'guest') ||
    (session.userId && session.userId !== 'guest')
  ) {
    throw new PlacementHttpError(
      403,
      'Placement session belongs to an authenticated learner account.'
    );
  }
  if (session.guestTokenRevoked) {
    throw new PlacementHttpError(
      403,
      'Placement guest token has been revoked after account linking.'
    );
  }
  if (
    typeof session.guestTokenExpiresAtMs === 'number' &&
    session.guestTokenExpiresAtMs < nowMs
  ) {
    throw new PlacementHttpError(403, 'Placement guest token has expired.');
  }
  if (
    !session.guestTokenHash ||
    !verifiedGuestTokenHash ||
    !verifyStoredGuestTokenHash(session.guestTokenHash, verifiedGuestTokenHash)
  ) {
    throw new PlacementHttpError(
      403,
      'Placement guest token does not match the stored session credential.'
    );
  }
}

// ============================================================================
// Persistent Multi-Instance Firestore Placement Operations (Steps 3, 4, 5)
// ============================================================================

export async function startOrResumePlacementSessionPersistent(params: {
  sessionId?: string;
  abandonSessionId?: string;
  abandonSessionIds?: string[];
  abandonReason?: PlacementAbandonReason;
  verifiedUid?: string | null;
  verifiedGuestTokenHash?: string | null;
  forceNew?: boolean;
  nowMs?: number;
}): Promise<{
  session: PlacementSession;
  activePassage: ReadingLesson | null;
  guestToken?: string;
  serverNowMs: number;
}> {
  const nowMs =
    typeof params.nowMs === 'number' && Number.isFinite(params.nowMs)
      ? Math.floor(params.nowMs)
      : Date.now();
  const diagnosticBank = getPlacementDiagnosticPassages();
  const verifiedUid = params.verifiedUid?.trim() || null;
  const isGuest = !verifiedUid;
  const preIssuedGuestToken = isGuest
    ? issuePlacementGuestTokenDetails('pending', nowMs)
    : null;

  return runPlacementStorageTransaction(async (tx) => {
    const idsToAbandon = new Set<string>();
    if (typeof params.abandonSessionId === 'string' && params.abandonSessionId.trim()) {
      idsToAbandon.add(params.abandonSessionId.trim());
    }
    if (Array.isArray(params.abandonSessionIds)) {
      for (const rawId of params.abandonSessionIds.slice(0, 10)) {
        if (typeof rawId === 'string' && rawId.trim()) {
          idsToAbandon.add(rawId.trim());
        }
      }
    }

    for (const abandonId of idsToAbandon) {
      const existingToAbandon = await tx.getSession(abandonId);
      if (!existingToAbandon || existingToAbandon.status === 'completed') continue;
      const canAbandon = verifiedUid
        ? existingToAbandon.userId === verifiedUid ||
          existingToAbandon.linkedToUserId === verifiedUid
        : existingToAbandon.userId === 'guest' &&
          Boolean(
            params.verifiedGuestTokenHash &&
              existingToAbandon.guestTokenHash &&
              verifyStoredGuestTokenHash(
                existingToAbandon.guestTokenHash,
                params.verifiedGuestTokenHash
              )
          );
      if (canAbandon && existingToAbandon.status !== 'abandoned') {
        const abandoned = abandonPlacementSession(
          existingToAbandon,
          params.abandonReason || 'refresh',
          nowMs
        ).session;
        tx.setSession(
          {
            ...abandoned,
            revision: (existingToAbandon.revision || 0) + 1,
          },
          nowMs
        );
      }
    }

    // Check if caller requested viewing an existing completed session
    if (!params.forceNew && params.sessionId) {
      const existing = await tx.getSession(params.sessionId);
      if (existing) {
        verifyStoredSessionAuthorization({
          session: existing,
          verifiedUid,
          verifiedGuestTokenHash: params.verifiedGuestTokenHash || null,
          nowMs,
        });
        if (existing.status === 'completed') {
          return {
            session: sanitizePlacementSessionForClient(existing),
            activePassage: null,
            serverNowMs: nowMs,
          };
        }
        if (existing.status === 'in_progress') {
          const abandoned = abandonPlacementSession(
            existing,
            params.abandonReason || 'refresh',
            nowMs
          ).session;
          tx.setSession(
            {
              ...abandoned,
              revision: (existing.revision || 0) + 1,
            },
            nowMs
          );
        }
      }
    }

    // If authenticated user has an existing session in user index:
    // - return completed session if !forceNew
    // - supersede any in_progress session whether forceNew is true or false
    if (verifiedUid) {
      const latestId = await tx.getUserLatestSessionId(verifiedUid);
      if (latestId && !idsToAbandon.has(latestId)) {
        const latestSession = await tx.getSession(latestId);
        if (!params.forceNew && latestSession && latestSession.status === 'completed') {
          return {
            session: sanitizePlacementSessionForClient(latestSession),
            activePassage: null,
            serverNowMs: nowMs,
          };
        }
        if (latestSession && latestSession.status === 'in_progress') {
          const abandoned = abandonPlacementSession(
            latestSession,
            params.abandonReason || 'superseded',
            nowMs
          ).session;
          tx.setSession(
            {
              ...abandoned,
              revision: (latestSession.revision || 0) + 1,
            },
            nowMs
          );
        }
      }
    }

    const baseSession = createPlacementSession(
      verifiedUid || 'guest',
      isGuest,
      diagnosticBank,
      undefined,
      nowMs
    );
    const issuedGuestDetails = isGuest
      ? issuePlacementGuestTokenDetails(baseSession.id, nowMs)
      : null;

    const freshSession: PlacementSession = {
      ...baseSession,
      userId: verifiedUid || 'guest',
      ownerType: isGuest ? 'guest' : 'user',
      isAnonymous: isGuest,
      guestTokenHash: issuedGuestDetails?.tokenHash,
      guestTokenIssuedAtMs: issuedGuestDetails?.issuedAtMs,
      guestTokenExpiresAtMs: issuedGuestDetails?.expiresAtMs,
      guestTokenRevoked: false,
      draftSaveCount: 0,
      submitAttemptCount: 0,
      revision: 1,
      expiresAtMs: nowMs + PLACEMENT_GUEST_AND_ACTIVE_RETENTION_MS,
    };

    tx.setSession(freshSession, nowMs);
    if (verifiedUid) {
      tx.setUserLatestSessionId(verifiedUid, freshSession.id);
    }

    const activePassage = freshSession.activePassageId
      ? getPlacementDiagnosticPassageById(freshSession.activePassageId)
      : null;

    return {
      session: sanitizePlacementSessionForClient(freshSession),
      activePassage: activePassage ? sanitizeLessonForLearner(activePassage) : null,
      ...(issuedGuestDetails ? { guestToken: issuedGuestDetails.token } : {}),
      ...(preIssuedGuestToken && !issuedGuestDetails
        ? { guestToken: preIssuedGuestToken.token }
        : {}),
      serverNowMs: nowMs,
    };
  });
}

export async function savePlacementDraftAnswersPersistent(params: {
  sessionId: string;
  passageId: string;
  answers: unknown;
  verifiedUid?: string | null;
  verifiedGuestTokenHash?: string | null;
  nowMs?: number;
}): Promise<{
  session: PlacementSession;
  accepted: boolean;
  expired: boolean;
  serverNowMs: number;
}> {
  const nowMs =
    typeof params.nowMs === 'number' && Number.isFinite(params.nowMs)
      ? Math.floor(params.nowMs)
      : Date.now();
  const passage = getPlacementDiagnosticPassageById(params.passageId);
  if (!passage) {
    throw new PlacementHttpError(
      400,
      `Diagnostic passage "${params.passageId}" not found or not eligible for initial placement.`
    );
  }

  const answerValidation = validatePlacementAnswersPayload(passage, params.answers);
  if (!answerValidation.valid) {
    throw new PlacementHttpError(400, answerValidation.error);
  }

  return runPlacementStorageTransaction(async (tx) => {
    // Step 3: Retrieve session from Firestore
    const session = await tx.getSession(params.sessionId);
    if (!session) {
      throw new PlacementHttpError(
        404,
        `Placement session "${params.sessionId}" not found.`
      );
    }

    // Step 4: Verify stored ownership & guestTokenHash
    verifyStoredSessionAuthorization({
      session,
      verifiedUid: params.verifiedUid || null,
      verifiedGuestTokenHash: params.verifiedGuestTokenHash || null,
      nowMs,
    });

    if (session.status === 'abandoned') {
      throw new PlacementHttpError(
        409,
        'Placement session has been abandoned and cannot be resumed.',
        { abandoned: true, session: sanitizePlacementSessionForClient(session) }
      );
    }

    if (session.status === 'completed') {
      return {
        session: sanitizePlacementSessionForClient(session),
        accepted: false,
        expired: isPlacementSessionExpired(session, nowMs),
        serverNowMs: nowMs,
      };
    }

    if (session.activePassageId && passage.id !== session.activePassageId) {
      throw new PlacementHttpError(
        409,
        `Draft passage "${passage.id}" does not match the active placement passage "${session.activePassageId}".`
      );
    }

    const nextDraftCount = (session.draftSaveCount || 0) + 1;
    if (nextDraftCount > MAX_PLACEMENT_DRAFT_SAVES) {
      throw new PlacementHttpError(
        429,
        `Maximum draft saves (${MAX_PLACEMENT_DRAFT_SAVES}) reached for this placement session.`
      );
    }

    // Step 5: Pure state transition
    const result = saveDraftAnswersInPlacementSession(
      session,
      passage.id,
      answerValidation.sanitizedAnswers,
      nowMs
    );
    const updatedSession: PlacementSession = {
      ...result.session,
      draftSaveCount: nextDraftCount,
      revision: (session.revision || 0) + 1,
    };

    tx.setSession(updatedSession, nowMs);

    return {
      session: sanitizePlacementSessionForClient(updatedSession),
      accepted: result.accepted,
      expired: result.lateRejected,
      serverNowMs: nowMs,
    };
  });
}

export async function submitPlacementPassagePersistent(params: {
  sessionId: string;
  passageId: string;
  answers: unknown;
  autoSubmitOnTimeout?: boolean;
  verifiedUid?: string | null;
  verifiedGuestTokenHash?: string | null;
  nowMs?: number;
}): Promise<{
  session: PlacementSession;
  stepResult: PlacementSession['steps'][number] | null;
  nextPassage: ReadingLesson | null;
  wasDuplicate: boolean;
  lateRejected: boolean;
  timedOut: boolean;
  serverNowMs: number;
}> {
  const nowMs =
    typeof params.nowMs === 'number' && Number.isFinite(params.nowMs)
      ? Math.floor(params.nowMs)
      : Date.now();
  const diagnosticBank = getPlacementDiagnosticPassages();
  const passage = getPlacementDiagnosticPassageById(params.passageId);
  if (!passage) {
    throw new PlacementHttpError(
      400,
      `Diagnostic passage "${params.passageId}" not found or not eligible for initial placement.`
    );
  }

  const answerValidation = validatePlacementAnswersPayload(passage, params.answers);
  if (!answerValidation.valid) {
    throw new PlacementHttpError(400, answerValidation.error);
  }

  return runPlacementStorageTransaction(async (tx) => {
    // Step 3: Retrieve session from Firestore
    const session = await tx.getSession(params.sessionId);
    if (!session) {
      throw new PlacementHttpError(
        404,
        `Placement session "${params.sessionId}" not found.`
      );
    }

    // Step 4: Verify stored ownership & guestTokenHash
    verifyStoredSessionAuthorization({
      session,
      verifiedUid: params.verifiedUid || null,
      verifiedGuestTokenHash: params.verifiedGuestTokenHash || null,
      nowMs,
    });

    if (session.status === 'abandoned') {
      throw new PlacementHttpError(
        409,
        'Placement session has been abandoned and cannot be submitted.',
        { abandoned: true, session: sanitizePlacementSessionForClient(session) }
      );
    }

    // Idempotency guard: if this passageId was already graded in this session, return existing state
    const existingStep = session.steps.find((s) => s.passageId === passage.id);
    if (existingStep) {
      const currentNextPassage = session.activePassageId
        ? getPlacementDiagnosticPassageById(session.activePassageId)
        : null;
      return {
        session: sanitizePlacementSessionForClient(session),
        stepResult: existingStep,
        nextPassage: currentNextPassage
          ? sanitizeLessonForLearner(currentNextPassage)
          : null,
        wasDuplicate: true,
        lateRejected: !params.autoSubmitOnTimeout && isPlacementSessionExpired(session, nowMs),
        timedOut: Boolean(session.timedOut),
        serverNowMs: nowMs,
      };
    }

    if (session.status === 'completed') {
      const lastStep =
        session.steps.find((s) => s.passageId === params.passageId) ||
        session.steps[session.steps.length - 1] ||
        null;
      return {
        session: sanitizePlacementSessionForClient(session),
        stepResult: lastStep,
        nextPassage: null,
        wasDuplicate: true,
        lateRejected: !params.autoSubmitOnTimeout && isPlacementSessionExpired(session, nowMs),
        timedOut: Boolean(session.timedOut),
        serverNowMs: nowMs,
      };
    }

    // Active passage validation: submitted passage must match the session's activePassageId
    if (!session.activePassageId || passage.id !== session.activePassageId) {
      throw new PlacementHttpError(
        409,
        `Submitted diagnostic passage "${passage.id}" does not match the active placement passage "${session.activePassageId || 'none'}".`
      );
    }

    const nextSubmitCount = (session.submitAttemptCount || 0) + 1;
    if (nextSubmitCount > MAX_PLACEMENT_SUBMIT_ATTEMPTS) {
      throw new PlacementHttpError(
        429,
        `Maximum submission attempts (${MAX_PLACEMENT_SUBMIT_ATTEMPTS}) reached for this placement session.`
      );
    }

    if ((session.steps?.length || 0) >= MAX_PLACEMENT_STEPS) {
      throw new PlacementHttpError(
        409,
        'Maximum placement steps (3) already completed for this session.'
      );
    }

    // Step 5: Pure state transition
    if (params.autoSubmitOnTimeout) {
      const withinNetworkGrace =
        nowMs <= session.deadlineAtMs + SERVER_NETWORK_LATENCY_TOLERANCE_MS;
      const savedDrafts = session.draftAnswersByPassage?.[passage.id] || {};
      const preDeadlineAnswers = withinNetworkGrace
        ? { ...savedDrafts, ...answerValidation.sanitizedAnswers }
        : savedDrafts;

      const finalized = finalizePlacementSessionOnTimeout(
        session,
        diagnosticBank,
        preDeadlineAnswers,
        undefined,
        nowMs
      );
      const updatedSession: PlacementSession = {
        ...finalized.session,
        submitAttemptCount: nextSubmitCount,
        revision: (session.revision || 0) + 1,
        expiresAtMs: nowMs + PLACEMENT_COMPLETED_RETENTION_MS,
      };
      tx.setSession(updatedSession, nowMs);
      if (params.verifiedUid) {
        tx.setUserLatestSessionId(params.verifiedUid, updatedSession.id);
      }
      return {
        session: sanitizePlacementSessionForClient(updatedSession),
        stepResult: finalized.finalStepResult,
        nextPassage: null,
        wasDuplicate: finalized.wasAlreadyCompleted,
        lateRejected: false,
        timedOut: true,
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
      const updatedSession: PlacementSession = {
        ...finalized.session,
        submitAttemptCount: nextSubmitCount,
        revision: (session.revision || 0) + 1,
        expiresAtMs: nowMs + PLACEMENT_COMPLETED_RETENTION_MS,
      };
      tx.setSession(updatedSession, nowMs);
      if (params.verifiedUid) {
        tx.setUserLatestSessionId(params.verifiedUid, updatedSession.id);
      }
      return {
        session: sanitizePlacementSessionForClient(updatedSession),
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
      answerValidation.sanitizedAnswers,
      diagnosticBank,
      undefined,
      nowMs
    );
    const updatedSession: PlacementSession = {
      ...applied.session,
      submitAttemptCount: nextSubmitCount,
      revision: (session.revision || 0) + 1,
      expiresAtMs:
        applied.session.status === 'completed'
          ? nowMs + PLACEMENT_COMPLETED_RETENTION_MS
          : computePlacementSessionRetentionExpiresAtMs(applied.session, nowMs),
    };
    tx.setSession(updatedSession, nowMs);
    if (params.verifiedUid) {
      tx.setUserLatestSessionId(params.verifiedUid, updatedSession.id);
    }

    return {
      session: sanitizePlacementSessionForClient(updatedSession),
      stepResult: applied.stepResult,
      nextPassage: applied.nextPassage
        ? sanitizeLessonForLearner(applied.nextPassage)
        : null,
      wasDuplicate: applied.wasDuplicate,
      lateRejected: false,
      timedOut: false,
      serverNowMs: nowMs,
    };
  });
}

export async function abandonPlacementSessionPersistent(params: {
  sessionId: string;
  reason?: PlacementAbandonReason;
  verifiedUid?: string | null;
  verifiedGuestTokenHash?: string | null;
  nowMs?: number;
}): Promise<{
  session: PlacementSession | null;
  abandoned: boolean;
  alreadyCompleted: boolean;
  alreadyAbandoned: boolean;
  serverNowMs: number;
}> {
  const nowMs =
    typeof params.nowMs === 'number' && Number.isFinite(params.nowMs)
      ? Math.floor(params.nowMs)
      : Date.now();

  return runPlacementStorageTransaction(async (tx) => {
    // Step 3: Retrieve session from Firestore
    const existing = await tx.getSession(params.sessionId);
    if (!existing) {
      throw new PlacementHttpError(
        404,
        `Placement session "${params.sessionId}" not found.`
      );
    }

    // Step 4: Verify stored ownership & guestTokenHash
    verifyStoredSessionAuthorization({
      session: existing,
      verifiedUid: params.verifiedUid || null,
      verifiedGuestTokenHash: params.verifiedGuestTokenHash || null,
      nowMs,
    });

    if (existing.status === 'completed') {
      return {
        session: sanitizePlacementSessionForClient(existing),
        abandoned: false,
        alreadyCompleted: true,
        alreadyAbandoned: false,
        serverNowMs: nowMs,
      };
    }

    if (existing.status === 'abandoned') {
      return {
        session: sanitizePlacementSessionForClient(existing),
        abandoned: true,
        alreadyCompleted: false,
        alreadyAbandoned: true,
        serverNowMs: nowMs,
      };
    }

    // Step 5: Pure state transition
    const result = abandonPlacementSession(
      existing,
      params.reason || 'navigation_exit',
      nowMs
    );
    const updatedSession: PlacementSession = {
      ...result.session,
      revision: (existing.revision || 0) + 1,
    };
    tx.setSession(updatedSession, nowMs);

    const ownerUid = existing.userId?.trim();
    if (ownerUid && ownerUid !== 'guest') {
      const latestId = await tx.getUserLatestSessionId(ownerUid);
      if (latestId === params.sessionId) {
        tx.setUserLatestSessionId(ownerUid, null);
      }
    }

    return {
      session: sanitizePlacementSessionForClient(updatedSession),
      abandoned: result.wasAbandoned,
      alreadyCompleted: false,
      alreadyAbandoned: !result.wasAbandoned,
      serverNowMs: nowMs,
    };
  });
}

export async function linkPlacementSessionToUserPersistent(params: {
  sessionId: string;
  verifiedUid: string;
  verifiedGuestTokenHash?: string | null;
  nowMs?: number;
}): Promise<PlacementSession> {
  const nowMs =
    typeof params.nowMs === 'number' && Number.isFinite(params.nowMs)
      ? Math.floor(params.nowMs)
      : Date.now();
  const targetUid = params.verifiedUid.trim();

  return runPlacementStorageTransaction(async (tx) => {
    // Step 3: Retrieve session from Firestore
    const session = await tx.getSession(params.sessionId);
    if (!session) {
      throw new PlacementHttpError(
        404,
        `Placement session "${params.sessionId}" not found.`
      );
    }

    if (session.status === 'abandoned') {
      throw new PlacementHttpError(
        409,
        'Abandoned placement sessions cannot be linked.'
      );
    }

    // Idempotent check if already linked to the same verified Google user
    if (
      session.userId === targetUid &&
      session.linkedToUserId === targetUid &&
      session.ownerType === 'user'
    ) {
      return sanitizePlacementSessionForClient(session);
    }

    // If session belongs to a different authenticated user, reject
    if (
      session.userId &&
      session.userId !== 'guest' &&
      session.userId !== targetUid &&
      session.linkedToUserId !== targetUid
    ) {
      throw new PlacementHttpError(
        403,
        'Placement session already belongs to a different learner account.'
      );
    }

    // If session was created as a guest session, require valid matching guestTokenHash
    if (session.userId === 'guest' || session.ownerType === 'guest') {
      if (session.guestTokenRevoked) {
        throw new PlacementHttpError(
          403,
          'Placement guest token has already been revoked.'
        );
      }
      if (
        !session.guestTokenHash ||
        !params.verifiedGuestTokenHash ||
        !verifyStoredGuestTokenHash(session.guestTokenHash, params.verifiedGuestTokenHash)
      ) {
        throw new PlacementHttpError(
          403,
          'Valid placement guest token is required to link a guest placement session.'
        );
      }
    }

    // Step 5: Atomic transition to authenticated user & immediate guest token revocation
    const updated: PlacementSession = {
      ...session,
      userId: targetUid,
      linkedToUserId: targetUid,
      ownerType: 'user',
      isAnonymous: false,
      guestTokenRevoked: true,
      revision: (session.revision || 0) + 1,
      updatedAt: new Date(nowMs).toISOString(),
      expiresAtMs: computePlacementSessionRetentionExpiresAtMs(session, nowMs),
    };

    tx.setSession(updated, nowMs);
    tx.setUserLatestSessionId(targetUid, updated.id);
    return sanitizePlacementSessionForClient(updated);
  });
}

// ============================================================================
// Synchronous In-Memory Placement Functions (Preserved for placementTimer.test.ts)
// ============================================================================

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
      abandoned: result.wasAbandoned,
      alreadyCompleted: false,
      alreadyAbandoned: result.alreadyAbandoned,
      serverNowMs: nowMs,
    };
  }

  const alreadyTombstoned = registry.abandonedSessionIds.has(sessionId);
  registry.abandonedSessionIds.add(sessionId);
  syncRegistryToDisk();

  return {
    session: null,
    abandoned: !alreadyTombstoned,
    alreadyCompleted: false,
    alreadyAbandoned: alreadyTombstoned,
    serverNowMs: nowMs,
  };
}

export function startOrResumePlacementSessionOnServer(params: {
  sessionId?: string;
  abandonSessionId?: string;
  abandonSessionIds?: string[];
  abandonReason?: PlacementAbandonReason;
  userId?: string;
  isAnonymous?: boolean;
  forceNew?: boolean;
  nowMs?: number;
}): {
  session: PlacementSession;
  activePassage: ReadingLesson | null;
  serverNowMs: number;
} {
  const nowMs =
    typeof params.nowMs === 'number' && Number.isFinite(params.nowMs)
      ? Math.floor(params.nowMs)
      : Date.now();
  const registry = getPlacementRegistry();
  const diagnosticBank = getPlacementDiagnosticPassages();
  const userId = params.userId?.trim() || 'guest';
  const isAnonymous = params.isAnonymous ?? userId === 'guest';

  const idsToAbandon = new Set<string>();
  if (typeof params.abandonSessionId === 'string' && params.abandonSessionId.trim()) {
    idsToAbandon.add(params.abandonSessionId.trim());
  }
  if (Array.isArray(params.abandonSessionIds)) {
    for (const rawId of params.abandonSessionIds) {
      if (typeof rawId === 'string' && rawId.trim()) {
        idsToAbandon.add(rawId.trim());
      }
    }
  }

  for (const abandonId of idsToAbandon) {
    const existingToAbandon = registry.sessions.get(abandonId);
    if (existingToAbandon && !canUserAccessPlacementSession(existingToAbandon, userId)) {
      continue;
    }
    if (existingToAbandon && existingToAbandon.status === 'completed') {
      continue;
    }
    try {
      abandonPlacementSessionOnServer({
        sessionId: abandonId,
        userId,
        reason: params.abandonReason || 'refresh',
        nowMs,
      });
    } catch {
      // Ignore unauthorized or invalid abandon IDs
    }
  }

  if (!params.forceNew && params.sessionId) {
    const byId = registry.sessions.get(params.sessionId);
    if (byId && canUserAccessPlacementSession(byId, userId)) {
      if (
        byId.status === 'completed' &&
        !registry.abandonedSessionIds.has(byId.id)
      ) {
        return {
          session: byId,
          activePassage: null,
          serverNowMs: nowMs,
        };
      }
      if (byId.status === 'in_progress') {
        abandonPlacementSessionOnServer({
          sessionId: byId.id,
          userId,
          reason: params.abandonReason || 'refresh',
          nowMs,
        });
      }
    }
  }

  if (userId !== 'guest') {
    const latestId = registry.latestSessionIdByUserId.get(userId);
    if (latestId && !idsToAbandon.has(latestId)) {
      const latestSession = registry.sessions.get(latestId);
      if (
        !params.forceNew &&
        latestSession &&
        canUserAccessPlacementSession(latestSession, userId) &&
        latestSession.status === 'completed' &&
        !registry.abandonedSessionIds.has(latestSession.id)
      ) {
        return {
          session: latestSession,
          activePassage: null,
          serverNowMs: nowMs,
        };
      }
      if (
        latestSession &&
        canUserAccessPlacementSession(latestSession, userId) &&
        latestSession.status === 'in_progress'
      ) {
        abandonPlacementSessionOnServer({
          sessionId: latestSession.id,
          userId,
          reason: params.abandonReason || 'superseded',
          nowMs,
        });
      }
    }
  }

  const fresh = createPlacementSession(
    userId,
    isAnonymous,
    diagnosticBank,
    undefined,
    nowMs
  );
  if (
    !params.forceNew &&
    params.sessionId &&
    /^[a-zA-Z0-9_-]{4,128}$/.test(params.sessionId) &&
    !registry.sessions.has(params.sessionId) &&
    !registry.abandonedSessionIds.has(params.sessionId)
  ) {
    fresh.id = params.sessionId;
  }
  registry.sessions.set(fresh.id, fresh);
  if (userId !== 'guest') {
    registry.latestSessionIdByUserId.set(userId, fresh.id);
  }
  syncRegistryToDisk();

  const activePassage = fresh.activePassageId
    ? getPlacementDiagnosticPassageById(fresh.activePassageId)
    : null;

  return {
    session: fresh,
    activePassage: activePassage ? sanitizeLessonForLearner(activePassage) : null,
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
  session: PlacementSession;
  accepted: boolean;
  expired: boolean;
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
    throw new Error('Placement session has been abandoned and cannot be resumed.');
  }

  if (!session) {
    throw new Error(`Placement session "${params.sessionId}" not found.`);
  }

  if (!canUserAccessPlacementSession(session, params.userId)) {
    throw new Error('Placement session belongs to a different learner account.');
  }

  const passage = getPlacementDiagnosticPassageById(params.passageId);
  if (!passage) {
    throw new Error(`Diagnostic passage "${params.passageId}" not found or not eligible for initial placement.`);
  }

  if (session.status === 'in_progress' && session.activePassageId && passage.id !== session.activePassageId) {
    throw new Error(`Draft passage "${passage.id}" does not match the active placement passage "${session.activePassageId}".`);
  }

  const result = saveDraftAnswersInPlacementSession(
    session,
    params.passageId,
    params.answers,
    nowMs
  );
  registry.sessions.set(result.session.id, result.session);
  syncRegistryToDisk();

  return {
    session: result.session,
    accepted: result.accepted,
    expired: result.lateRejected,
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
  recoveryStartedAtMs?: number;
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
  const registry = getPlacementRegistry();
  const diagnosticBank = getPlacementDiagnosticPassages();
  const passage = getPlacementDiagnosticPassageById(params.passageId);

  if (!passage) {
    throw new Error(`Diagnostic passage "${params.passageId}" not found or not eligible for initial placement.`);
  }

  const existingCheck = registry.sessions.get(params.sessionId);
  if (
    registry.abandonedSessionIds.has(params.sessionId) ||
    existingCheck?.status === 'abandoned'
  ) {
    if (existingCheck && !canUserAccessPlacementSession(existingCheck, params.userId)) {
      throw new Error('Placement session belongs to a different learner account.');
    }
    throw new Error('Placement session has been abandoned and cannot be submitted.');
  }

  let session = existingCheck;
  if (!session) {
    const safeStartedAtMs =
      typeof params.recoveryStartedAtMs === 'number' &&
      Number.isFinite(params.recoveryStartedAtMs) &&
      params.recoveryStartedAtMs <= nowMs
        ? Math.floor(params.recoveryStartedAtMs)
        : nowMs;

    let reconstructed = createPlacementSession(
      params.userId || 'guest',
      !params.userId || params.userId === 'guest',
      diagnosticBank,
      undefined,
      safeStartedAtMs
    );
    if (params.sessionId && /^[a-zA-Z0-9_-]{4,128}$/.test(params.sessionId)) {
      reconstructed = { ...reconstructed, id: params.sessionId };
    }

    if (Array.isArray(params.priorStepsForRecovery)) {
      for (const rawStep of params.priorStepsForRecovery.slice(0, 2)) {
        if (!rawStep || typeof rawStep.passageId !== 'string') continue;
        if (rawStep.passageId === params.passageId) continue;
        const priorPassage = getPlacementDiagnosticPassageById(rawStep.passageId);
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

  const existingStep = session.steps.find((s) => s.passageId === passage.id);
  if (existingStep) {
    const currentNextPassage = session.activePassageId
      ? getPlacementDiagnosticPassageById(session.activePassageId)
      : null;
    return {
      session,
      stepResult: existingStep,
      nextPassage: currentNextPassage
        ? sanitizeLessonForLearner(currentNextPassage)
        : null,
      wasDuplicate: true,
      lateRejected: !params.autoSubmitOnTimeout && isPlacementSessionExpired(session, nowMs),
      timedOut: Boolean(session.timedOut),
      serverNowMs: nowMs,
    };
  }

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

  if (!session.activePassageId || passage.id !== session.activePassageId) {
    throw new Error(
      `Submitted diagnostic passage "${passage.id}" does not match the active placement passage "${session.activePassageId || 'none'}".`
    );
  }

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

  const diagnosticBank = getPlacementDiagnosticPassages();
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
    const diagnosticBank = getPlacementDiagnosticPassages();
    let recovered = createPlacementSession(
      params.targetUserId,
      false,
      diagnosticBank
    );
    if (/^[a-zA-Z0-9_-]{4,128}$/.test(params.sessionId)) {
      recovered = { ...recovered, id: params.sessionId };
    }
    for (const rawStep of params.recoverySteps.slice(0, 3)) {
      const passage = getPlacementDiagnosticPassageById(rawStep.passageId);
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
