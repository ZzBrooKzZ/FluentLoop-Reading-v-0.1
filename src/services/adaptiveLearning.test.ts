import assert from 'node:assert/strict';
import test from 'node:test';
import { applyAttemptProgression, createAdaptiveProfile, DIFFICULTY_RANGES, selectNextLesson } from './adaptiveLearning';
import { ReadingLesson } from '../types/reading';

function lesson(id: string, level: ReadingLesson['level'], status: ReadingLesson['status'] = 'published'): ReadingLesson {
  return { id, title: id, level, topic: 'Science and technology', status, estimatedMinutes: 4, introduction: '', passage: 'A short test passage.', illustrationUrl: '', illustrationAlt: '', vocabulary: [], questions: [], createdAt: '', updatedAt: '' };
}
function attempt(lessonId: string, status: 'in_progress' | 'completed' = 'completed', attemptType: 'first' | 'practice' = 'first') {
  return { id: `${lessonId}-attempt`, userId: 'user', lessonId, lessonTitle: lessonId, level: 'B1' as const, topic: 'Science and technology' as const, status, attemptType, score: 0, totalQuestions: 1, accuracy: 0, answers: {}, questionTypeStats: {}, createdAt: '', updatedAt: '2026-01-01' };
}

test('initial state uses chosen starting level and lower-range target', () => {
  const profile = createAdaptiveProfile('B2');
  assert.equal(profile.startingLevel, 'B2');
  assert.equal(profile.currentLevel, 'B2');
  assert.equal(profile.currentDifficultyScore, DIFFICULTY_RANGES.B2.min + 4);
});

test('selector excludes attempted lessons and chooses among nearest candidates', () => {
  const profile = { ...createAdaptiveProfile('B1'), currentDifficultyScore: 50 };
  const lessons = [lesson('far', 'B1'), lesson('near-a', 'B1'), lesson('near-b', 'B1'), lesson('wrong-level', 'B2')];
  const selected = selectNextLesson(profile, lessons, [attempt('near-a')], { far: 58, 'near-b': 51 }, () => 0);
  assert.equal(selected?.id, 'near-b');
});

test('selector resumes unfinished first-time attempt before assigning another', () => {
  const profile = createAdaptiveProfile('B1');
  const lessons = [lesson('current', 'B1'), lesson('other', 'B1')];
  assert.equal(selectNextLesson(profile, lessons, [attempt('current', 'in_progress')])?.id, 'current');
});

test('selector returns completion when all eligible lessons were attempted', () => {
  const profile = createAdaptiveProfile('A1');
  assert.equal(selectNextLesson(profile, [lesson('done', 'A1')], [attempt('done')]), null);
});

test('strong result increases target gradually without changing level', () => {
  const profile = { ...createAdaptiveProfile('B1'), currentDifficultyScore: 48 };
  const result = applyAttemptProgression({ profile, attemptType: 'first', completed: true, pendingReviewCount: 0, accuracy: 90, lessonDifficulty: 48 });
  assert.equal(result.profile.currentDifficultyScore, 52);
  assert.equal(result.profile.currentLevel, 'B1');
});

test('intermediate result holds target and resets both streaks', () => {
  const profile = { ...createAdaptiveProfile('B1'), consecutivePasses: 1, consecutiveFailures: 1 };
  const result = applyAttemptProgression({ profile, attemptType: 'first', completed: true, pendingReviewCount: 0, accuracy: 72, lessonDifficulty: 48 });
  assert.equal(result.profile.currentDifficultyScore, profile.currentDifficultyScore);
  assert.equal(result.profile.consecutivePasses, 0);
  assert.equal(result.profile.consecutiveFailures, 0);
});

test('pending, incomplete, and practice attempts cannot change progression', () => {
  const profile = createAdaptiveProfile('A2');
  for (const input of [
    { attemptType: 'first' as const, completed: false, pendingReviewCount: 0 },
    { attemptType: 'first' as const, completed: true, pendingReviewCount: 1 },
    { attemptType: 'practice' as const, completed: true, pendingReviewCount: 0 },
  ]) {
    const result = applyAttemptProgression({ profile, ...input, accuracy: 0, lessonDifficulty: 20 });
    assert.equal(result.changed, false);
    assert.equal(result.profile.currentLevel, 'A2');
  }
});

test('two demanding top-boundary passes advance exactly one level', () => {
  const profile = { ...createAdaptiveProfile('B1'), currentDifficultyScore: DIFFICULTY_RANGES.B1.max - 4, consecutivePasses: 1 };
  const result = applyAttemptProgression({ profile, attemptType: 'first', completed: true, pendingReviewCount: 0, accuracy: 90, lessonDifficulty: DIFFICULTY_RANGES.B1.max });
  assert.equal(result.profile.currentLevel, 'B2');
  assert.equal(result.profile.currentDifficultyScore, DIFFICULTY_RANGES.B2.min + 4);
  assert.equal(result.profile.consecutivePasses, 0);
});

test('two easy bottom-boundary failures regress exactly one level', () => {
  const profile = { ...createAdaptiveProfile('B1'), currentDifficultyScore: DIFFICULTY_RANGES.B1.min + 4, consecutiveFailures: 1 };
  const result = applyAttemptProgression({ profile, attemptType: 'first', completed: true, pendingReviewCount: 0, accuracy: 40, lessonDifficulty: DIFFICULTY_RANGES.B1.min });
  assert.equal(result.profile.currentLevel, 'A2');
  assert.equal(result.profile.currentDifficultyScore, DIFFICULTY_RANGES.A2.max - 4);
});

test('progression never moves below A1 or above C1', () => {
  const a1 = applyAttemptProgression({ profile: { ...createAdaptiveProfile('A1'), currentDifficultyScore: 0, consecutiveFailures: 1 }, attemptType: 'first', completed: true, pendingReviewCount: 0, accuracy: 20, lessonDifficulty: 0 });
  const c1 = applyAttemptProgression({ profile: { ...createAdaptiveProfile('C1'), currentDifficultyScore: 100, consecutivePasses: 1 }, attemptType: 'first', completed: true, pendingReviewCount: 0, accuracy: 99, lessonDifficulty: 100 });
  assert.equal(a1.profile.currentLevel, 'A1');
  assert.equal(c1.profile.currentLevel, 'C1');
  assert.ok(c1.profile.currentDifficultyScore <= DIFFICULTY_RANGES.C1.max);
});

test('server learner sanitization strips private answer keys and rubrics before submission', async () => {
  const { getAuthoritativeLessonById, sanitizeLessonForLearner } = await import('../server/lessonRepository');
  const authLesson = getAuthoritativeLessonById('a1-sci-solar-lamps');
  assert.ok(authLesson, 'Authoritative lesson must exist');
  assert.ok(authLesson.questions.length > 0 && authLesson.questions[0].correctAnswer.length > 0);

  const sanitized = sanitizeLessonForLearner(authLesson);
  for (const q of sanitized.questions) {
    assert.equal(q.correctAnswer, '');
    assert.deepEqual(q.acceptedAnswers, []);
    assert.equal(q.rubric, undefined);
    assert.equal(q.explanation, '');
    assert.equal(q.passageEvidence, '');
  }
});

test('server authoritative grading prevents duplicate progression on repeated attemptId submission', async () => {
  const { getAuthoritativeLessonById } = await import('../server/lessonRepository');
  const { gradeLessonSubmissionOnServer } = await import('../server/gradingEngine');
  const authLesson = getAuthoritativeLessonById('a1-sci-solar-lamps');
  assert.ok(authLesson);

  const perfectAnswers: Record<string, string> = {};
  for (const q of authLesson.questions) {
    perfectAnswers[q.id] = q.correctAnswer;
  }

  const startProfile = { ...createAdaptiveProfile('A1'), currentDifficultyScore: 8 };
  const firstRun = await gradeLessonSubmissionOnServer({
    lesson: authLesson,
    answers: perfectAnswers,
    attemptId: 'att-dedup-test-1',
    attemptType: 'first',
    currentProfile: startProfile,
  });

  assert.equal(firstRun.graded.accuracy, 100);
  assert.equal(firstRun.progression?.profile.currentDifficultyScore, 12);

  // Submitting the exact same attemptId again with the updated profile must NOT double-increment difficulty
  const secondRun = await gradeLessonSubmissionOnServer({
    lesson: authLesson,
    answers: perfectAnswers,
    attemptId: 'att-dedup-test-1',
    attemptType: 'first',
    currentProfile: firstRun.progression!.profile,
  });
  assert.equal(secondRun.progression?.profile.currentDifficultyScore, 12);
});

test('diagnostic bank contains 15 validated short passages (3 per CEFR level) with 6 objective questions each', async () => {
  const { DIAGNOSTIC_PASSAGES } = await import('../data/diagnosticPassages');
  assert.equal(DIAGNOSTIC_PASSAGES.length, 15);
  for (const lvl of ['A1', 'A2', 'B1', 'B2', 'C1'] as const) {
    const levelPassages = DIAGNOSTIC_PASSAGES.filter((p) => p.level === lvl);
    assert.equal(levelPassages.length, 3, `Expected 3 diagnostic passages for ${lvl}`);
    for (const p of levelPassages) {
      assert.equal(p.isDiagnostic, true);
      assert.equal(p.questions.length, 6, `Expected 6 questions in ${p.id}`);
      for (const q of p.questions) {
        assert.ok(q.correctAnswer.trim().length > 0, `Missing correctAnswer in ${q.id}`);
        assert.ok(q.explanation.trim().length > 0, `Missing explanation in ${q.id}`);
        assert.ok(q.passageEvidence.trim().length > 0, `Missing passageEvidence in ${q.id}`);
      }
    }
  }
});

test('placement starts at B1 and steps up on strong performance (>=80%) or down on weak (<60%)', async () => {
  const {
    createPlacementSession,
    decideNextDiagnosticPassage,
    MAX_PLACEMENT_PASSAGES,
  } = await import('./placementEngine');

  assert.equal(MAX_PLACEMENT_PASSAGES, 3);
  const session = createPlacementSession('test-init', true);
  assert.equal(session.currentLevel, 'B1');
  assert.ok(session.activePassageId?.startsWith('diag-b1-'));

  // Strong B1 result (83%) -> steps up to B2
  const afterStrongB1 = decideNextDiagnosticPassage([
    {
      passageId: 'diag-b1-1',
      passageTitle: 'B1 Core',
      level: 'B1',
      diagnosticBand: 'core',
      score: 5,
      totalQuestions: 6,
      accuracy: 83,
      answers: {},
      results: [],
      submittedAt: new Date().toISOString(),
    },
  ]);
  assert.equal(afterStrongB1.shouldComplete, false);
  assert.equal(afterStrongB1.nextLevel, 'B2');
  assert.ok(afterStrongB1.nextPassage?.id.startsWith('diag-b2-'));

  // Weak B1 result (33%) -> steps down to A2
  const afterWeakB1 = decideNextDiagnosticPassage([
    {
      passageId: 'diag-b1-1',
      passageTitle: 'B1 Core',
      level: 'B1',
      diagnosticBand: 'core',
      score: 2,
      totalQuestions: 6,
      accuracy: 33,
      answers: {},
      results: [],
      submittedAt: new Date().toISOString(),
    },
  ]);
  assert.equal(afterWeakB1.shouldComplete, false);
  assert.equal(afterWeakB1.nextLevel, 'A2');
  assert.ok(afterWeakB1.nextPassage?.id.startsWith('diag-a2-'));
});

test('placement handles borderline performance (60-79%) and stops early after 2 consistent B1 passages', async () => {
  const { decideNextDiagnosticPassage, calculateConservativeRecommendation } = await import(
    './placementEngine'
  );

  // First passage borderline at B1 (67% = 4/6) -> stays at B1 to confirm
  const step1 = {
    passageId: 'diag-b1-1',
    passageTitle: 'B1 1',
    level: 'B1' as const,
    diagnosticBand: 'core' as const,
    score: 4,
    totalQuestions: 6,
    accuracy: 67,
    answers: {},
    results: [],
    submittedAt: new Date().toISOString(),
  };
  const decisionAfter1 = decideNextDiagnosticPassage([step1]);
  assert.equal(decisionAfter1.shouldComplete, false);
  assert.equal(decisionAfter1.nextLevel, 'B1');

  // Second passage also borderline at B1 (67% = 4/6) -> finishes early after 2 passages!
  const step2 = {
    passageId: 'diag-b1-2',
    passageTitle: 'B1 2',
    level: 'B1' as const,
    diagnosticBand: 'foundation' as const,
    score: 4,
    totalQuestions: 6,
    accuracy: 67,
    answers: {},
    results: [],
    submittedAt: new Date().toISOString(),
  };
  const decisionAfter2 = decideNextDiagnosticPassage([step1, step2]);
  assert.equal(decisionAfter2.shouldComplete, true);
  assert.equal(decisionAfter2.nextPassage, null);

  const rec = calculateConservativeRecommendation([step1, step2]);
  assert.equal(rec.recommendedLevel, 'B1');
  assert.ok(rec.explanationSummary.includes('estimated starting level'));
});

test('placement strictly enforces the 3-passage hard limit and never selects a 4th passage', async () => {
  const { decideNextDiagnosticPassage } = await import('./placementEngine');
  const threeSteps = [
    {
      passageId: 'diag-b1-1',
      passageTitle: 'B1 1',
      level: 'B1' as const,
      score: 6,
      totalQuestions: 6,
      accuracy: 100,
      answers: {},
      results: [],
      submittedAt: new Date().toISOString(),
    },
    {
      passageId: 'diag-b2-1',
      passageTitle: 'B2 1',
      level: 'B2' as const,
      score: 4,
      totalQuestions: 6,
      accuracy: 67,
      answers: {},
      results: [],
      submittedAt: new Date().toISOString(),
    },
    {
      passageId: 'diag-b2-2',
      passageTitle: 'B2 2',
      level: 'B2' as const,
      score: 4,
      totalQuestions: 6,
      accuracy: 67,
      answers: {},
      results: [],
      submittedAt: new Date().toISOString(),
    },
  ];
  const decision = decideNextDiagnosticPassage(threeSteps);
  assert.equal(decision.shouldComplete, true);
  assert.equal(decision.nextPassage, null);
  assert.equal(decision.nextLevel, null);
});

test('conservative recommendation chooses lower safer level on contradictory or erratic 3-passage results', async () => {
  const { calculateConservativeRecommendation } = await import('./placementEngine');

  // Case A: B1 strong (83%), B2 weak (33%), B1 weak (50%) -> erratic at B1/B2, conservatively recommends A2
  const erraticB1B2 = calculateConservativeRecommendation([
    {
      passageId: 'diag-b1-1',
      passageTitle: 'B1 1',
      level: 'B1',
      score: 5,
      totalQuestions: 6,
      accuracy: 83,
      answers: {},
      results: [],
      submittedAt: '',
    },
    {
      passageId: 'diag-b2-1',
      passageTitle: 'B2 1',
      level: 'B2',
      score: 2,
      totalQuestions: 6,
      accuracy: 33,
      answers: {},
      results: [],
      submittedAt: '',
    },
    {
      passageId: 'diag-b1-2',
      passageTitle: 'B1 2',
      level: 'B1',
      score: 3,
      totalQuestions: 6,
      accuracy: 50,
      answers: {},
      results: [],
      submittedAt: '',
    },
  ]);
  assert.equal(erraticB1B2.recommendedLevel, 'A2');

  // Case B: B1 strong (83%), B2 strong (83%), C1 weak (33%) -> recommends B2 (not C1)
  const confirmedB2NotC1 = calculateConservativeRecommendation([
    {
      passageId: 'diag-b1-1',
      passageTitle: 'B1 1',
      level: 'B1',
      score: 5,
      totalQuestions: 6,
      accuracy: 83,
      answers: {},
      results: [],
      submittedAt: '',
    },
    {
      passageId: 'diag-b2-1',
      passageTitle: 'B2 1',
      level: 'B2',
      score: 5,
      totalQuestions: 6,
      accuracy: 83,
      answers: {},
      results: [],
      submittedAt: '',
    },
    {
      passageId: 'diag-c1-1',
      passageTitle: 'C1 1',
      level: 'C1',
      score: 2,
      totalQuestions: 6,
      accuracy: 33,
      answers: {},
      results: [],
      submittedAt: '',
    },
  ]);
  assert.equal(confirmedB2NotC1.recommendedLevel, 'B2');
});

test('server placement repository strips diagnostic answer keys, prevents duplicate submissions, and supports refresh recovery + user linking', async () => {
  const {
    startOrResumePlacementSessionOnServer,
    submitPlacementPassageOnServer,
    linkPlacementSessionToUserOnServer,
  } = await import('../server/placementRepository');
  const { getDiagnosticPassageById } = await import('../server/lessonRepository');

  // 1. Start session and verify answer keys are stripped from activePassage
  const started = startOrResumePlacementSessionOnServer({
    sessionId: 'ps-test-flow-1',
    userId: 'anon-123',
    isAnonymous: true,
  });
  assert.equal(started.session.status, 'in_progress');
  assert.ok(started.activePassage);
  for (const q of started.activePassage.questions) {
    assert.equal(q.correctAnswer, '', 'Diagnostic correctAnswer must not be sent to client');
    assert.equal(q.explanation, '', 'Diagnostic explanation must not be sent to client before submit');
  }

  // 2. Submit Passage 1 (B1) with 100% correct answers
  const authP1 = getDiagnosticPassageById(started.activePassage.id)!;
  const p1Answers = Object.fromEntries(authP1.questions.map((q) => [q.id, q.correctAnswer]));
  const sub1 = submitPlacementPassageOnServer({
    sessionId: started.session.id,
    passageId: authP1.id,
    answers: p1Answers,
    userId: 'anon-123',
  });
  assert.equal(sub1.session.steps.length, 1);
  assert.equal(sub1.stepResult.accuracy, 100);
  assert.equal(sub1.session.currentLevel, 'B2');

  // 3. Duplicate submission of Passage 1 is idempotent and does not add a second step
  const sub1Dup = submitPlacementPassageOnServer({
    sessionId: started.session.id,
    passageId: authP1.id,
    answers: p1Answers,
    userId: 'anon-123',
  });
  assert.equal(sub1Dup.session.steps.length, 1);

  // 4. Refresh recovery: resume session with same sessionId returns exact step 2 without repeating step 1
  const resumed = startOrResumePlacementSessionOnServer({
    sessionId: started.session.id,
    userId: 'anon-123',
  });
  assert.equal(resumed.session.steps.length, 1);
  assert.equal(resumed.activePassage?.id, sub1.nextPassage?.id);

  // 5. Submit Passage 2 (B2) and Passage 3 (C1) to complete placement in 3 passages
  const authP2 = getDiagnosticPassageById(sub1.nextPassage!.id)!;
  const p2Answers = Object.fromEntries(authP2.questions.map((q) => [q.id, q.correctAnswer]));
  const sub2 = submitPlacementPassageOnServer({
    sessionId: started.session.id,
    passageId: authP2.id,
    answers: p2Answers,
  });
  assert.equal(sub2.session.steps.length, 2);
  assert.equal(sub2.session.currentLevel, 'C1');

  const authP3 = getDiagnosticPassageById(sub2.nextPassage!.id)!;
  const p3Answers = Object.fromEntries(authP3.questions.map((q) => [q.id, q.correctAnswer]));
  const sub3 = submitPlacementPassageOnServer({
    sessionId: started.session.id,
    passageId: authP3.id,
    answers: p3Answers,
  });
  assert.equal(sub3.session.steps.length, 3);
  assert.equal(sub3.session.status, 'completed');
  assert.equal(sub3.session.recommendedLevel, 'C1');
  assert.equal(sub3.nextPassage, null);

  // 6. Link completed session to Google user UID
  const linked = linkPlacementSessionToUserOnServer({
    sessionId: started.session.id,
    targetUserId: 'google-uid-999',
  });
  assert.equal(linked?.linkedToUserId, 'google-uid-999');
  assert.equal(linked?.recommendedLevel, 'C1');
});

test('regular course lesson selector excludes diagnostic passages', () => {
  const profile = createAdaptiveProfile('B1');
  const diagLesson: ReadingLesson = {
    ...lesson('diag-b1-1', 'B1'),
    isDiagnostic: true,
  };
  const regularLesson = lesson('b1-reg-1', 'B1');
  const selected = selectNextLesson(profile, [diagLesson, regularLesson], []);
  assert.equal(selected?.id, 'b1-reg-1');
});


