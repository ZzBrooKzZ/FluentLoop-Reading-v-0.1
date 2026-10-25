import { PlacementSession, ReadingLesson } from '../types/reading';
import {
  applyDiagnosticSubmissionToSession,
  createPlacementSession,
} from '../services/placementEngine';
import {
  getAllDiagnosticPassages,
  getDiagnosticPassageById,
  sanitizeLessonForLearner,
} from './lessonRepository';

/**
 * Server-authoritative placement session registry.
 * Ensures clients cannot forge diagnostic scores or bypass the 3-passage cap.
 */
const serverPlacementSessions = new Map<string, PlacementSession>();
const latestSessionIdByUserId = new Map<string, string>();

export function startOrResumePlacementSessionOnServer(params: {
  sessionId?: string;
  userId?: string;
  isAnonymous?: boolean;
  forceNew?: boolean;
  clientRecoverySteps?: Array<{
    passageId: string;
    answers: Record<string, string>;
  }>;
}): {
  session: PlacementSession;
  activePassage: ReadingLesson | null;
} {
  const userId = params.userId?.trim() || 'guest';
  const isAnonymous = params.isAnonymous ?? true;
  const diagnosticBank = getAllDiagnosticPassages();

  if (!params.forceNew) {
    const lookupId =
      params.sessionId?.trim() || latestSessionIdByUserId.get(userId) || undefined;
    if (lookupId && serverPlacementSessions.has(lookupId)) {
      const existing = serverPlacementSessions.get(lookupId)!;
      const activePassage = existing.activePassageId
        ? getDiagnosticPassageById(existing.activePassageId)
        : null;
      return {
        session: existing,
        activePassage: activePassage ? sanitizeLessonForLearner(activePassage) : null,
      };
    }

    // If the server restarted while the visitor was mid-placement, reconstruct authoritatively
    // by re-grading the raw answers against the server's diagnostic answer keys (never trusting client scores).
    if (
      Array.isArray(params.clientRecoverySteps) &&
      params.clientRecoverySteps.length > 0
    ) {
      let recovered = createPlacementSession(userId, isAnonymous, diagnosticBank);
      if (params.sessionId && /^[a-zA-Z0-9_-]{4,128}$/.test(params.sessionId)) {
        recovered = { ...recovered, id: params.sessionId };
      }

      for (const rawStep of params.clientRecoverySteps.slice(0, 3)) {
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

      serverPlacementSessions.set(recovered.id, recovered);
      if (userId !== 'guest') {
        latestSessionIdByUserId.set(userId, recovered.id);
      }

      const activePassage = recovered.activePassageId
        ? getDiagnosticPassageById(recovered.activePassageId)
        : null;
      return {
        session: recovered,
        activePassage: activePassage ? sanitizeLessonForLearner(activePassage) : null,
      };
    }
  }

  const fresh = createPlacementSession(userId, isAnonymous, diagnosticBank);
  serverPlacementSessions.set(fresh.id, fresh);
  if (userId !== 'guest') {
    latestSessionIdByUserId.set(userId, fresh.id);
  }

  const firstPassage = fresh.activePassageId
    ? getDiagnosticPassageById(fresh.activePassageId)
    : null;

  return {
    session: fresh,
    activePassage: firstPassage ? sanitizeLessonForLearner(firstPassage) : null,
  };
}

export function submitPlacementPassageOnServer(params: {
  sessionId: string;
  userId?: string;
  passageId: string;
  answers: Record<string, string>;
  priorStepsForRecovery?: Array<{
    passageId: string;
    answers: Record<string, string>;
  }>;
}): {
  session: PlacementSession;
  stepResult: PlacementSession['steps'][number];
  nextPassage: ReadingLesson | null;
  wasDuplicate: boolean;
} {
  const diagnosticBank = getAllDiagnosticPassages();
  const passage = getDiagnosticPassageById(params.passageId);
  if (!passage) {
    throw new Error(`Diagnostic passage "${params.passageId}" not found.`);
  }

  let session = serverPlacementSessions.get(params.sessionId);
  if (!session) {
    const resumed = startOrResumePlacementSessionOnServer({
      sessionId: params.sessionId,
      userId: params.userId,
      clientRecoverySteps: params.priorStepsForRecovery,
    });
    session = resumed.session;
  }

  const applied = applyDiagnosticSubmissionToSession(
    session,
    passage,
    params.answers,
    diagnosticBank
  );

  serverPlacementSessions.set(applied.session.id, applied.session);
  if (params.userId && params.userId !== 'guest') {
    latestSessionIdByUserId.set(params.userId, applied.session.id);
  }

  return {
    session: applied.session,
    stepResult: applied.stepResult,
    nextPassage: applied.nextPassage
      ? sanitizeLessonForLearner(applied.nextPassage)
      : null,
    wasDuplicate: applied.wasDuplicate,
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
  let session = serverPlacementSessions.get(params.sessionId);
  if (!session && Array.isArray(params.recoverySteps) && params.recoverySteps.length > 0) {
    const recovered = startOrResumePlacementSessionOnServer({
      sessionId: params.sessionId,
      userId: params.targetUserId,
      isAnonymous: false,
      clientRecoverySteps: params.recoverySteps,
    });
    session = recovered.session;
  }

  if (!session) return null;

  const updated: PlacementSession = {
    ...session,
    linkedToUserId: params.targetUserId,
    isAnonymous: false,
    updatedAt: new Date().toISOString(),
  };

  serverPlacementSessions.set(updated.id, updated);
  latestSessionIdByUserId.set(params.targetUserId, updated.id);
  return updated;
}

export function getPlacementSessionByIdOnServer(
  sessionId: string
): PlacementSession | null {
  return serverPlacementSessions.get(sessionId) || null;
}
