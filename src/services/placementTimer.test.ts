import assert from 'node:assert/strict';
import test from 'node:test';
import {
  abandonPlacementSession,
  calculateConservativeRecommendation,
  clearAllPlacementTimersForTests,
  computeRemainingPlacementSeconds,
  createPlacementSession,
  formatPlacementCountdown,
  getActivePlacementTimerCount,
  getPlacementDraftStorageKey,
  getPlacementTimerVisualState,
  isPlacementAssessmentLocked,
  isPlacementSessionExpired,
  PLACEMENT_DURATION_MS,
  PLACEMENT_DURATION_SECONDS,
  PLACEMENT_TIMEOUT_MESSAGE,
  saveDraftAnswersInPlacementSession,
  stopPlacementSessionTimer,
  subscribePlacementSessionTimer,
} from './placementEngine';
import {
  clearAllPlacementInProgressAnswers,
  loadInProgressAttemptAnswers,
  saveInProgressAttemptAnswers,
} from './optionRandomizer';
import { DIAGNOSTIC_PASSAGES } from '../data/diagnosticPassages';
import {
  abandonPlacementSessionOnServer,
  canUserAccessPlacementSession,
  getPlacementSessionByIdOnServer,
  resetServerPlacementRepositoryForTests,
  savePlacementDraftAnswersOnServer,
  startOrResumePlacementSessionOnServer,
  submitPlacementPassageOnServer,
} from '../server/placementRepository';

function buildCorrectAnswersForPassage(passageId: string, count?: number): Record<string, string> {
  const passage = DIAGNOSTIC_PASSAGES.find((p) => p.id === passageId);
  assert.ok(passage, `Expected diagnostic passage ${passageId} to exist`);
  const limit = count ?? passage.questions.length;
  const answers: Record<string, string> = {};
  passage.questions.slice(0, limit).forEach((q) => {
    answers[q.id] = q.correctAnswer;
  });
  return answers;
}

test('1. Refreshing during Passage 1 resets the unfinished assessment, marks it abandoned, and prevents resumption', () => {
  resetServerPlacementRepositoryForTests();
  const t0 = 1_730_000_000_000;
  const started = startOrResumePlacementSessionOnServer({
    userId: 'learner-p1-refresh',
    isAnonymous: false,
    forceNew: true,
    nowMs: t0,
  });
  assert.equal(started.session.status, 'in_progress');
  assert.equal(started.session.currentLevel, 'B1');

  // Refresh occurs 3 minutes into Passage 1
  const tRefresh = t0 + 180_000;
  const abandoned = abandonPlacementSessionOnServer({
    sessionId: started.session.id,
    userId: 'learner-p1-refresh',
    reason: 'refresh',
    nowMs: tRefresh,
  });

  assert.equal(abandoned.abandoned, true);
  assert.equal(abandoned.alreadyCompleted, false);
  assert.equal(abandoned.session?.status, 'abandoned');
  assert.equal(abandoned.session?.abandonReason, 'refresh');
  assert.equal(abandoned.session?.activePassageId, null);
  assert.equal(computeRemainingPlacementSeconds(abandoned.session!, tRefresh), 0);
  assert.equal(isPlacementAssessmentLocked(abandoned.session!, tRefresh), true);
});

test('2 & 3. Refreshing during Passage 2 or Passage 3 (after submitting 1 or 2 passages) resets the unfinished assessment', () => {
  resetServerPlacementRepositoryForTests();
  const t0 = 1_730_000_000_000;
  const started = startOrResumePlacementSessionOnServer({
    userId: 'learner-p2-p3-refresh',
    isAnonymous: false,
    forceNew: true,
    nowMs: t0,
  });

  // Submit Passage 1 (B1 -> B2)
  const p1Id = started.activePassage!.id;
  const sub1 = submitPlacementPassageOnServer({
    sessionId: started.session.id,
    userId: 'learner-p2-p3-refresh',
    passageId: p1Id,
    answers: buildCorrectAnswersForPassage(p1Id, 6),
    nowMs: t0 + 200_000,
  });
  assert.equal(sub1.session.steps.length, 1);
  assert.equal(sub1.session.status, 'in_progress');
  assert.equal(sub1.session.currentLevel, 'B2');

  // Submit Passage 2 (B2 -> C1)
  const p2Id = sub1.nextPassage!.id;
  const sub2 = submitPlacementPassageOnServer({
    sessionId: started.session.id,
    userId: 'learner-p2-p3-refresh',
    passageId: p2Id,
    answers: buildCorrectAnswersForPassage(p2Id, 6),
    nowMs: t0 + 400_000,
  });
  assert.equal(sub2.session.steps.length, 2);
  assert.equal(sub2.session.status, 'in_progress');
  assert.equal(sub2.session.currentLevel, 'C1');

  // Learner refreshes during Passage 3 before completing the assessment
  const abandoned = abandonPlacementSessionOnServer({
    sessionId: started.session.id,
    userId: 'learner-p2-p3-refresh',
    reason: 'refresh',
    nowMs: t0 + 500_000,
  });
  assert.equal(abandoned.abandoned, true);
  assert.equal(abandoned.session?.status, 'abandoned');

  // Next time learner starts the placement assessment, they start from Passage 1 (B1) with 0 steps
  const restarted = startOrResumePlacementSessionOnServer({
    sessionId: started.session.id,
    userId: 'learner-p2-p3-refresh',
    isAnonymous: false,
    forceNew: false,
    nowMs: t0 + 600_000,
  });
  assert.notEqual(restarted.session.id, started.session.id);
  assert.equal(restarted.session.status, 'in_progress');
  assert.equal(restarted.session.steps.length, 0);
  assert.equal(restarted.session.currentLevel, 'B1');
  assert.equal(restarted.activePassage?.level, 'B1');
});

test('4 & 6. Refreshing after selecting answers clears draft answers so old answers are never restored in a new session', () => {
  resetServerPlacementRepositoryForTests();
  const t0 = 1_730_000_000_000;
  const started = startOrResumePlacementSessionOnServer({
    userId: 'learner-draft-clear',
    isAnonymous: false,
    forceNew: true,
    nowMs: t0,
  });
  const p1Id = started.activePassage!.id;
  const partialAnswers = buildCorrectAnswersForPassage(p1Id, 3);

  // Save draft answers both on server and in client optionRandomizer cache
  savePlacementDraftAnswersOnServer({
    sessionId: started.session.id,
    userId: 'learner-draft-clear',
    passageId: p1Id,
    answers: partialAnswers,
    nowMs: t0 + 60_000,
  });
  const scopedKey = getPlacementDraftStorageKey('learner-draft-clear', started.session.id, p1Id);
  saveInProgressAttemptAnswers(scopedKey, partialAnswers);
  saveInProgressAttemptAnswers('inprog-regular-lesson-1', { q1: 'regular-lesson-answer' });

  assert.deepEqual(loadInProgressAttemptAnswers(scopedKey), partialAnswers);

  // Refresh occurs: clear placement in-progress answers and abandon session on server
  clearAllPlacementInProgressAnswers(started.session.id);
  const abandoned = abandonPlacementSessionOnServer({
    sessionId: started.session.id,
    userId: 'learner-draft-clear',
    reason: 'refresh',
    nowMs: t0 + 120_000,
  });

  // Placement draft answers are wiped on both client and server
  assert.equal(loadInProgressAttemptAnswers(scopedKey), undefined);
  assert.deepEqual(abandoned.session?.draftAnswersByPassage, {});
  // Regular reading lesson in-progress answers are untouched!
  assert.deepEqual(loadInProgressAttemptAnswers('inprog-regular-lesson-1'), {
    q1: 'regular-lesson-answer',
  });
});

test('5, 7, 8. Starting again after refresh or exit creates a new session with a fresh 20-minute timer and never resumes the old session ID', () => {
  resetServerPlacementRepositoryForTests();
  const t0 = 1_730_000_000_000;
  const first = startOrResumePlacementSessionOnServer({
    sessionId: 'ps-custom-initial-1',
    userId: 'learner-restart',
    isAnonymous: false,
    forceNew: false,
    nowMs: t0,
  });
  assert.equal(first.session.id, 'ps-custom-initial-1');
  assert.equal(first.session.startedAtMs, t0);
  assert.equal(first.session.deadlineAtMs, t0 + PLACEMENT_DURATION_MS);

  // Even if caller passes the old sessionId without forceNew 8 minutes later,
  // startOrResumePlacementSessionOnServer marks the old unfinished session abandoned
  // and creates a brand-new session with a fresh 20-minute timer and new session ID.
  const tRestart = t0 + 480_000;
  const second = startOrResumePlacementSessionOnServer({
    sessionId: first.session.id,
    userId: 'learner-restart',
    isAnonymous: false,
    forceNew: false,
    nowMs: tRestart,
  });

  assert.notEqual(second.session.id, first.session.id);
  assert.equal(second.session.status, 'in_progress');
  assert.equal(second.session.startedAtMs, tRestart);
  assert.equal(second.session.deadlineAtMs, tRestart + PLACEMENT_DURATION_MS);
  assert.equal(second.session.durationSeconds, PLACEMENT_DURATION_SECONDS);
  assert.equal(computeRemainingPlacementSeconds(second.session, tRestart), 1200);
  assert.equal(formatPlacementCountdown(computeRemainingPlacementSeconds(second.session, tRestart)), '20:00');
  assert.equal(second.session.steps.length, 0);
  assert.deepEqual(second.session.draftAnswersByPassage, {});

  // Verify the old session in repository is marked abandoned
  const oldRecord = getPlacementSessionByIdOnServer(first.session.id);
  assert.equal(oldRecord?.status, 'abandoned');
});

test('9 & 10. Abandoned sessions cannot accept draft updates or passage submissions', () => {
  resetServerPlacementRepositoryForTests();
  const t0 = 1_730_000_000_000;
  const started = startOrResumePlacementSessionOnServer({
    userId: 'learner-abandoned-reject',
    isAnonymous: false,
    forceNew: true,
    nowMs: t0,
  });
  const passageId = started.activePassage!.id;

  // Abandon session
  abandonPlacementSessionOnServer({
    sessionId: started.session.id,
    userId: 'learner-abandoned-reject',
    reason: 'navigation_exit',
    nowMs: t0 + 60_000,
  });

  // Attempting to save draft answers to the abandoned session throws an abandoned error
  assert.throws(
    () =>
      savePlacementDraftAnswersOnServer({
        sessionId: started.session.id,
        userId: 'learner-abandoned-reject',
        passageId,
        answers: { q1: 'draft' },
        nowMs: t0 + 70_000,
      }),
    /abandoned/i
  );

  // Attempting to submit a passage to the abandoned session throws an abandoned error
  assert.throws(
    () =>
      submitPlacementPassageOnServer({
        sessionId: started.session.id,
        userId: 'learner-abandoned-reject',
        passageId,
        answers: buildCorrectAnswersForPassage(passageId, 6),
        nowMs: t0 + 80_000,
      }),
    /abandoned/i
  );
});

test('11 & 12. Leaving the assessment through internal navigation or Exit control abandons the session idempotently and stops the timer', () => {
  resetServerPlacementRepositoryForTests();
  clearAllPlacementTimersForTests();
  const t0 = 1_730_000_000_000;

  const started = startOrResumePlacementSessionOnServer({
    userId: 'learner-exit',
    isAnonymous: false,
    forceNew: true,
    nowMs: t0,
  });

  // Subscribe a timer for the active session
  subscribePlacementSessionTimer({
    sessionId: started.session.id,
    getDeadlineAtMs: () => started.session.deadlineAtMs,
    getAuthoritativeNowMs: () => t0 + 30_000,
    onTick: () => {},
  });
  assert.equal(getActivePlacementTimerCount(), 1);

  // Learner clicks Exit or internal navigation
  stopPlacementSessionTimer(started.session.id);
  assert.equal(getActivePlacementTimerCount(), 0);

  const firstAbandon = abandonPlacementSessionOnServer({
    sessionId: started.session.id,
    userId: 'learner-exit',
    reason: 'navigation_exit',
    nowMs: t0 + 45_000,
  });
  assert.equal(firstAbandon.abandoned, true);
  assert.equal(firstAbandon.alreadyAbandoned, false);
  assert.equal(firstAbandon.session?.status, 'abandoned');
  assert.equal(firstAbandon.session?.abandonReason, 'navigation_exit');

  // Calling abandon a second time is idempotent
  const secondAbandon = abandonPlacementSessionOnServer({
    sessionId: started.session.id,
    userId: 'learner-exit',
    reason: 'refresh',
    nowMs: t0 + 50_000,
  });
  assert.equal(secondAbandon.abandoned, true);
  assert.equal(secondAbandon.alreadyAbandoned, true);
  assert.equal(secondAbandon.session?.abandonReason, 'navigation_exit');
});

test('13 & 14. Completed placement assessments and timeout-finalized assessments are NEVER reset or abandoned by refresh or exit', () => {
  resetServerPlacementRepositoryForTests();
  const t0 = 1_730_000_000_000;

  // Case A: Assessment completed normally across 3 passages
  const normalStart = startOrResumePlacementSessionOnServer({
    userId: 'learner-completed-safe',
    isAnonymous: false,
    forceNew: true,
    nowMs: t0,
  });
  const p1 = normalStart.activePassage!.id;
  const s1 = submitPlacementPassageOnServer({
    sessionId: normalStart.session.id,
    userId: 'learner-completed-safe',
    passageId: p1,
    answers: buildCorrectAnswersForPassage(p1, 6),
    nowMs: t0 + 100_000,
  });
  const p2 = s1.nextPassage!.id;
  const s2 = submitPlacementPassageOnServer({
    sessionId: normalStart.session.id,
    userId: 'learner-completed-safe',
    passageId: p2,
    answers: buildCorrectAnswersForPassage(p2, 6),
    nowMs: t0 + 200_000,
  });
  const p3 = s2.nextPassage!.id;
  const s3 = submitPlacementPassageOnServer({
    sessionId: normalStart.session.id,
    userId: 'learner-completed-safe',
    passageId: p3,
    answers: buildCorrectAnswersForPassage(p3, 6),
    nowMs: t0 + 300_000,
  });
  assert.equal(s3.session.status, 'completed');
  assert.equal(s3.session.recommendedLevel, 'C1');

  // Attempting to abandon a completed session does NOT alter or reset it
  const abandonCompleted = abandonPlacementSessionOnServer({
    sessionId: normalStart.session.id,
    userId: 'learner-completed-safe',
    reason: 'refresh',
    nowMs: t0 + 350_000,
  });
  assert.equal(abandonCompleted.abandoned, false);
  assert.equal(abandonCompleted.alreadyCompleted, true);
  assert.equal(abandonCompleted.session?.status, 'completed');
  assert.equal(abandonCompleted.session?.recommendedLevel, 'C1');
  assert.equal(abandonCompleted.session?.steps.length, 3);

  // Case B: Assessment finalized automatically when 20-minute timer reaches 00:00
  const timeoutStart = startOrResumePlacementSessionOnServer({
    userId: 'learner-timeout-safe',
    isAnonymous: false,
    forceNew: true,
    nowMs: t0,
  });
  const tp1 = timeoutStart.activePassage!.id;
  const preDeadlineAnswers = buildCorrectAnswersForPassage(tp1, 4);
  savePlacementDraftAnswersOnServer({
    sessionId: timeoutStart.session.id,
    userId: 'learner-timeout-safe',
    passageId: tp1,
    answers: preDeadlineAnswers,
    nowMs: t0 + 600_000,
  });

  const autoFinalized = submitPlacementPassageOnServer({
    sessionId: timeoutStart.session.id,
    userId: 'learner-timeout-safe',
    passageId: tp1,
    answers: preDeadlineAnswers,
    autoSubmitOnTimeout: true,
    nowMs: t0 + PLACEMENT_DURATION_MS,
  });
  assert.equal(autoFinalized.session.status, 'completed');
  assert.equal(autoFinalized.session.timedOut, true);
  assert.ok(autoFinalized.session.recommendedLevel);
  assert.ok(autoFinalized.session.explanationSummary?.includes(PLACEMENT_TIMEOUT_MESSAGE));

  // Refreshing after timeout finalization preserves the completed result
  const abandonTimeoutCompleted = abandonPlacementSessionOnServer({
    sessionId: timeoutStart.session.id,
    userId: 'learner-timeout-safe',
    reason: 'refresh',
    nowMs: t0 + PLACEMENT_DURATION_MS + 5000,
  });
  assert.equal(abandonTimeoutCompleted.abandoned, false);
  assert.equal(abandonTimeoutCompleted.alreadyCompleted, true);
  assert.equal(abandonTimeoutCompleted.session?.status, 'completed');
  assert.equal(
    abandonTimeoutCompleted.session?.recommendedLevel,
    autoFinalized.session.recommendedLevel
  );
});

test('15 & 16. Multi-tab abandonment invalidates the session across all tabs so another tab cannot submit or resume it', () => {
  resetServerPlacementRepositoryForTests();
  const t0 = 1_730_000_000_000;

  // Tab 1 starts an assessment
  const tab1 = startOrResumePlacementSessionOnServer({
    userId: 'learner-multitab-abandon',
    isAnonymous: false,
    forceNew: true,
    nowMs: t0,
  });
  const p1Id = tab1.activePassage!.id;

  // Tab 2 refreshes or exits, abandoning the session on the server
  const tab2Abandon = abandonPlacementSessionOnServer({
    sessionId: tab1.session.id,
    userId: 'learner-multitab-abandon',
    reason: 'refresh',
    nowMs: t0 + 120_000,
  });
  assert.equal(tab2Abandon.abandoned, true);

  // Tab 1 subsequently attempts to save draft answers or submit the passage -> rejected as abandoned
  assert.throws(
    () =>
      savePlacementDraftAnswersOnServer({
        sessionId: tab1.session.id,
        userId: 'learner-multitab-abandon',
        passageId: p1Id,
        answers: { q1: 'tab1-answer' },
        nowMs: t0 + 125_000,
      }),
    /abandoned/i
  );

  assert.throws(
    () =>
      submitPlacementPassageOnServer({
        sessionId: tab1.session.id,
        userId: 'learner-multitab-abandon',
        passageId: p1Id,
        answers: buildCorrectAnswersForPassage(p1Id, 6),
        nowMs: t0 + 130_000,
      }),
    /abandoned/i
  );
});

test('17. Timer visual tiers, continuous countdown across passages, late submission rejection, and duplicate submission prevention remain intact', () => {
  resetServerPlacementRepositoryForTests();
  const t0 = 1_730_000_000_000;

  // Visual state tiers
  assert.equal(getPlacementTimerVisualState(1200).tier, 'normal_sage');
  assert.equal(getPlacementTimerVisualState(301).tier, 'normal_sage');
  assert.equal(getPlacementTimerVisualState(300).tier, 'subtle_amber');
  assert.equal(getPlacementTimerVisualState(121).tier, 'subtle_amber');
  assert.equal(getPlacementTimerVisualState(120).tier, 'noticeable_warning');
  assert.equal(getPlacementTimerVisualState(61).tier, 'noticeable_warning');
  assert.equal(getPlacementTimerVisualState(60).tier, 'red_warning');
  assert.equal(getPlacementTimerVisualState(0).tier, 'red_warning');

  // Continuous countdown across passages without resetting deadline
  const started = startOrResumePlacementSessionOnServer({
    userId: 'learner-timer-preserved',
    isAnonymous: false,
    forceNew: true,
    nowMs: t0,
  });
  const p1Id = started.activePassage!.id;
  const sub1 = submitPlacementPassageOnServer({
    sessionId: started.session.id,
    userId: 'learner-timer-preserved',
    passageId: p1Id,
    answers: buildCorrectAnswersForPassage(p1Id, 6),
    nowMs: t0 + 240_000,
  });
  assert.equal(sub1.session.startedAtMs, t0);
  assert.equal(sub1.session.deadlineAtMs, t0 + PLACEMENT_DURATION_MS);
  assert.equal(computeRemainingPlacementSeconds(sub1.session, t0 + 240_000), 960);

  // Late manual submission after 20-minute deadline is rejected and scores only pre-deadline drafts
  const p2Id = sub1.nextPassage!.id;
  savePlacementDraftAnswersOnServer({
    sessionId: started.session.id,
    userId: 'learner-timer-preserved',
    passageId: p2Id,
    answers: buildCorrectAnswersForPassage(p2Id, 3),
    nowMs: t0 + 800_000,
  });
  const lateSub = submitPlacementPassageOnServer({
    sessionId: started.session.id,
    userId: 'learner-timer-preserved',
    passageId: p2Id,
    answers: buildCorrectAnswersForPassage(p2Id, 6),
    autoSubmitOnTimeout: false,
    nowMs: t0 + PLACEMENT_DURATION_MS + 10_000,
  });
  assert.equal(lateSub.lateRejected, true);
  assert.equal(lateSub.timedOut, true);
  assert.equal(lateSub.session.status, 'completed');
  assert.equal(lateSub.session.steps[1].score, 3);
  const expectedRec = calculateConservativeRecommendation(lateSub.session.steps);
  assert.equal(lateSub.session.recommendedLevel, expectedRec.recommendedLevel);
});

test('18. Authentication and account isolation: User B cannot abandon, resume, save drafts into, or submit User A placement session', () => {
  resetServerPlacementRepositoryForTests();
  const t0 = 1_730_000_000_000;

  const userA = startOrResumePlacementSessionOnServer({
    userId: 'user-A',
    isAnonymous: false,
    forceNew: true,
    nowMs: t0,
  });
  const passageId = userA.activePassage!.id;

  assert.equal(canUserAccessPlacementSession(userA.session, 'user-B'), false);

  // User B cannot abandon User A's session
  assert.throws(
    () =>
      abandonPlacementSessionOnServer({
        sessionId: userA.session.id,
        userId: 'user-B',
        reason: 'navigation_exit',
        nowMs: t0 + 10_000,
      }),
    /different learner account/
  );

  // User A's session remains in_progress
  const sessionA = getPlacementSessionByIdOnServer(userA.session.id);
  assert.equal(sessionA?.status, 'in_progress');

  // User B starting a session gets their own fresh session
  const userB = startOrResumePlacementSessionOnServer({
    sessionId: userA.session.id,
    userId: 'user-B',
    isAnonymous: false,
    forceNew: false,
    nowMs: t0 + 20_000,
  });
  assert.notEqual(userB.session.id, userA.session.id);
  assert.equal(userB.session.userId, 'user-B');
  assert.equal(getPlacementSessionByIdOnServer(userA.session.id)?.status, 'in_progress');

  // Pure engine helper also protects completed sessions from abandonment
  const completedMock = {
    ...userA.session,
    status: 'completed' as const,
    recommendedLevel: 'B2' as const,
  };
  const attemptAbandonCompleted = abandonPlacementSession(completedMock, 'refresh', t0 + 30_000);
  assert.equal(attemptAbandonCompleted.alreadyCompleted, true);
  assert.equal(attemptAbandonCompleted.session.status, 'completed');
  assert.equal(
    getPlacementDraftStorageKey('user-A', userA.session.id, passageId) !==
      getPlacementDraftStorageKey('user-B', userA.session.id, passageId),
    true
  );
  assert.equal(isPlacementSessionExpired(userA.session, t0 + PLACEMENT_DURATION_MS), true);
});

test('19. Simulated browser refresh where POST /api/placement/abandon never reaches the server: old session cannot be resumed or interfere with next session (authenticated & guest)', () => {
  resetServerPlacementRepositoryForTests();
  const t0 = 1_730_000_000_000;

  // Case A: Authenticated learner starts Session 1, selects answers, refreshes, and /api/placement/abandon is dropped
  const authS1 = startOrResumePlacementSessionOnServer({
    userId: 'auth-dropped-abandon',
    isAnonymous: false,
    forceNew: true,
    nowMs: t0,
  });
  const p1Id = authS1.activePassage!.id;
  savePlacementDraftAnswersOnServer({
    sessionId: authS1.session.id,
    userId: 'auth-dropped-abandon',
    passageId: p1Id,
    answers: buildCorrectAnswersForPassage(p1Id, 3),
    nowMs: t0 + 60_000,
  });

  // Notice: abandonPlacementSessionOnServer is NEVER called (simulating dropped POST /api/placement/abandon).
  // Next, the learner explicitly starts a new placement assessment:
  const authS2 = startOrResumePlacementSessionOnServer({
    userId: 'auth-dropped-abandon',
    isAnonymous: false,
    forceNew: true,
    nowMs: t0 + 180_000,
  });
  assert.notEqual(authS2.session.id, authS1.session.id);
  assert.equal(authS2.session.status, 'in_progress');
  assert.equal(authS2.session.startedAtMs, t0 + 180_000);
  assert.equal(authS2.session.deadlineAtMs, t0 + 180_000 + PLACEMENT_DURATION_MS);
  assert.equal(authS2.session.steps.length, 0);

  // Old session S1 was automatically marked 'abandoned' (reason: 'superseded') and cannot overwrite or submit
  const oldAuthRecord = getPlacementSessionByIdOnServer(authS1.session.id);
  assert.equal(oldAuthRecord?.status, 'abandoned');
  assert.throws(
    () =>
      submitPlacementPassageOnServer({
        sessionId: authS1.session.id,
        userId: 'auth-dropped-abandon',
        passageId: p1Id,
        answers: buildCorrectAnswersForPassage(p1Id, 6),
        nowMs: t0 + 190_000,
      }),
    /abandoned/i
  );

  // Case B: Guest learner starts Session 1, refreshes (/api/placement/abandon dropped), and starts Session 2 sending local abandonSessionIds
  const guestS1 = startOrResumePlacementSessionOnServer({
    userId: 'guest',
    isAnonymous: true,
    forceNew: true,
    nowMs: t0,
  });
  const guestP1 = guestS1.activePassage!.id;

  const guestS2 = startOrResumePlacementSessionOnServer({
    userId: 'guest',
    isAnonymous: true,
    abandonSessionIds: [guestS1.session.id],
    abandonReason: 'superseded',
    forceNew: true,
    nowMs: t0 + 120_000,
  });
  assert.notEqual(guestS2.session.id, guestS1.session.id);
  assert.equal(getPlacementSessionByIdOnServer(guestS1.session.id)?.status, 'abandoned');
  assert.throws(
    () =>
      submitPlacementPassageOnServer({
        sessionId: guestS1.session.id,
        userId: 'guest',
        passageId: guestP1,
        answers: buildCorrectAnswersForPassage(guestP1, 6),
        nowMs: t0 + 130_000,
      }),
    /abandoned/i
  );
});

test('20. Multi-worker and server-restart disk synchronization enforces monotonic status precedence (completed > abandoned > in_progress)', () => {
  resetServerPlacementRepositoryForTests();
  const t0 = 1_730_000_000_000;

  // Worker 1 starts a session and persists to /tmp/fluentloop-placement-sessions.json
  const started = startOrResumePlacementSessionOnServer({
    userId: 'worker-sync-user',
    isAnonymous: false,
    forceNew: true,
    nowMs: t0,
  });
  const sessionId = started.session.id;
  const passageId = started.activePassage!.id;

  // Simulate Worker 2 having a stale in-memory copy where status is still 'in_progress'
  // while Worker 1 writes 'abandoned' to disk
  abandonPlacementSessionOnServer({
    sessionId,
    userId: 'worker-sync-user',
    reason: 'refresh',
    nowMs: t0 + 30_000,
  });

  const globalRef = globalThis as unknown as {
    __fluentLoopPlacementRegistry?: {
      sessions: Map<string, any>;
      abandonedSessionIds: Set<string>;
    };
  };
  // Mutate in-memory registry back to stale 'in_progress' (as if a second worker had not seen the abandon call in memory)
  globalRef.__fluentLoopPlacementRegistry!.sessions.set(sessionId, {
    ...started.session,
    status: 'in_progress',
  });
  globalRef.__fluentLoopPlacementRegistry!.abandonedSessionIds.delete(sessionId);

  // When Worker 2 handles a submission, getPlacementRegistry() merges /tmp/fluentloop-placement-sessions.json
  // with monotonic precedence ('abandoned' > 'in_progress') and rejects the submission!
  assert.throws(
    () =>
      submitPlacementPassageOnServer({
        sessionId,
        userId: 'worker-sync-user',
        passageId,
        answers: buildCorrectAnswersForPassage(passageId, 6),
        nowMs: t0 + 40_000,
      }),
    /abandoned/i
  );
  assert.equal(getPlacementSessionByIdOnServer(sessionId)?.status, 'abandoned');
});

