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

test('progression never moves below A1 or above C2', () => {
  const a1 = applyAttemptProgression({ profile: { ...createAdaptiveProfile('A1'), currentDifficultyScore: 0, consecutiveFailures: 1 }, attemptType: 'first', completed: true, pendingReviewCount: 0, accuracy: 20, lessonDifficulty: 0 });
  const c2 = applyAttemptProgression({ profile: { ...createAdaptiveProfile('C2'), currentDifficultyScore: 118, consecutivePasses: 1 }, attemptType: 'first', completed: true, pendingReviewCount: 0, accuracy: 99, lessonDifficulty: 120 });
  assert.equal(a1.profile.currentLevel, 'A1');
  assert.equal(c2.profile.currentLevel, 'C2');
  assert.ok(c2.profile.currentDifficultyScore <= DIFFICULTY_RANGES.C2.max);
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

test('diagnostic bank contains 18 validated short passages (3 per CEFR level A1-C2) with 6 objective questions each', async () => {
  const { DIAGNOSTIC_PASSAGES } = await import('../data/diagnosticPassages');
  assert.equal(DIAGNOSTIC_PASSAGES.length, 18);
  for (const lvl of ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const) {
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

  // 4. Submit Passage 2 (B2) and Passage 3 (C1) to complete placement in 3 passages
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

  // 5. Completed session is preserved when queried without forceNew
  const completedFetched = startOrResumePlacementSessionOnServer({
    sessionId: started.session.id,
    userId: 'anon-123',
  });
  assert.equal(completedFetched.session.id, started.session.id);
  assert.equal(completedFetched.session.status, 'completed');
  assert.equal(completedFetched.session.recommendedLevel, 'C1');

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

test('precomputed passage dictionary achieves 100% word coverage across all 114 regular lessons and 18 diagnostic passages with zero missing definitions', async () => {
  const { INITIAL_LESSONS } = await import('../data/initialLessons');
  const { DIAGNOSTIC_PASSAGES } = await import('../data/diagnosticPassages');
  const { computeDictionaryCoverageReport } = await import('./wordLookupService');

  const report = computeDictionaryCoverageReport(INITIAL_LESSONS, DIAGNOSTIC_PASSAGES);
  assert.equal(report.regularPassageCount, 114);
  assert.equal(report.diagnosticPassageCount, 18);
  assert.equal(report.totalPassages, 132);
  assert.ok(report.totalWordTokens > 25000);
  assert.ok(report.distinctNormalizedWords >= 4500);
  assert.equal(
    report.missingDistinctWords.length,
    0,
    `Expected 0 missing words, found: ${report.missingDistinctWords.join(', ')}`
  );
  assert.equal(report.overallCoveragePercent, 100);
  for (const lvl of report.byLevel) {
    assert.equal(lvl.coveragePercent, 100, `Expected 100% coverage for level ${lvl.level}`);
    assert.equal(lvl.missingWordsCount, 0);
  }
  for (const les of report.byLesson) {
    assert.equal(
      les.coveragePercent,
      100,
      `Expected 100% coverage for lesson ${les.lessonId}, missing: ${les.missingWords.join(', ')}`
    );
  }
});

test('lookupPassageWord disambiguates ambiguous/polysemous words by sentence context and makes zero network requests', async () => {
  const { lookupPassageWord, stripSurroundingPunctuation } = await import('./wordLookupService');

  // Verify zero network calls by temporarily throwing if global fetch is called
  const originalFetch = globalThis.fetch;
  let fetchCalled = false;
  globalThis.fetch = (async () => {
    fetchCalled = true;
    throw new Error('Runtime network calls are forbidden during word lookup');
  }) as any;

  try {
    // 1. "conduct" as a verb (research experiment) vs thermal/electrical conduction
    const conductResearch = lookupPassageWord({
      rawWord: 'conduct,',
      sentence: 'Scientists conduct field surveys to measure biodiversity across islands.',
      lessonId: 'b1-test',
    });
    assert.ok(conductResearch);
    assert.equal(conductResearch.word, 'conduct');
    assert.equal(conductResearch.arabicTranslation, undefined);
    assert.ok(
      conductResearch.simpleDefinition.toLowerCase().includes('organize') ||
        conductResearch.simpleDefinition.toLowerCase().includes('carry out')
    );

    const conductHeat = lookupPassageWord({
      rawWord: 'conduct',
      sentence: 'Dense metals conduct heat and electricity far more rapidly than air.',
      lessonId: 'b2-test',
    });
    assert.ok(conductHeat);
    assert.ok(
      conductHeat.simpleDefinition.toLowerCase().includes('heat') ||
        conductHeat.simpleDefinition.toLowerCase().includes('electricity') ||
        conductHeat.simpleDefinition.toLowerCase().includes('transmit')
    );
    assert.notEqual(conductResearch.simpleDefinition, conductHeat.simpleDefinition);

    // 2. "plant" as botanical organism vs industrial power station
    const plantBotany = lookupPassageWord({
      rawWord: '"plant"',
      sentence: 'Each desert plant stores moisture inside thick waxy stems and roots.',
      lessonId: 'a2-test',
    });
    const plantFactory = lookupPassageWord({
      rawWord: 'plant.',
      sentence: 'The geothermal power plant generates electricity using underground steam turbines.',
      lessonId: 'b2-test',
    });
    assert.ok(plantBotany && plantFactory);
    assert.notEqual(plantBotany.simpleDefinition, plantFactory.simpleDefinition);

    // 3. Inflections, contractions, hyphenated words, and surrounding punctuation
    const stripped = stripSurroundingPunctuation('“(ecosystem-wide).”');
    assert.equal(stripped.core, 'ecosystem-wide');
    assert.equal(stripped.leading, '“(');
    assert.equal(stripped.trailing, ').”');

    const contractionLookup = lookupPassageWord({
      rawWord: "don't,",
      sentence: "Many desert reptiles don't emerge until the sun sets.",
    });
    assert.ok(contractionLookup);
    assert.equal(contractionLookup.word, "don't");
    assert.ok(contractionLookup.simpleDefinition.toLowerCase().includes('do not'));

    const inflectedLookup = lookupPassageWord({
      rawWord: 'caravanserais;',
      sentence: 'Merchant caravans rested in fortified caravanserais along the Silk Road.',
    });
    assert.ok(inflectedLookup);
    assert.equal(inflectedLookup.word, 'caravanserais');
    assert.ok(inflectedLookup.simpleDefinition.length > 15);
  } finally {
    globalThis.fetch = originalFetch;
  }

  assert.equal(fetchCalled, false, 'Word lookup must never invoke fetch()');
});

test('tokenizePlainSegment preserves exact character stream and non-key word wrappers have zero layout-shifting styles', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const { INITIAL_LESSONS } = await import('../data/initialLessons');
  const { tokenizePlainSegment } = await import('../components/InteractivePassage');

  // 1. Verify every paragraph in the lesson bank reconstructs identically without losing or adding spaces/punctuation
  for (const lesson of INITIAL_LESSONS.slice(0, 15)) {
    const pieces = tokenizePlainSegment(lesson.passage, 0);
    const reconstructed = pieces
      .map((p) => (p.core && p.normalized ? `${p.leading}${p.core}${p.trailing}` : p.raw))
      .join('');
    assert.equal(
      reconstructed,
      lesson.passage,
      `Tokenized text must match original passage byte-for-byte in ${lesson.id}`
    );
  }

  // 2. Verify InteractivePassage.tsx does not apply padding, border, underline, or hover background classes to data-word-lookup spans
  const componentSource = fs.readFileSync(
    path.join(process.cwd(), 'src/components/InteractivePassage.tsx'),
    'utf8'
  );
  const wordLookupSpanBlock = componentSource.slice(
    componentSource.lastIndexOf('data-word-lookup="true"'),
    componentSource.indexOf('{piece.core}')
  );
  assert.ok(wordLookupSpanBlock.includes('className="cursor-pointer"'));
  assert.equal(wordLookupSpanBlock.includes('px-'), false);
  assert.equal(wordLookupSpanBlock.includes('py-'), false);
  assert.equal(wordLookupSpanBlock.includes('border'), false);
  assert.equal(wordLookupSpanBlock.includes('hover:bg-'), false);
  assert.equal(wordLookupSpanBlock.includes('underline'), false);
  assert.equal(wordLookupSpanBlock.includes('font-bold'), false);
  assert.equal(wordLookupSpanBlock.includes('font-medium'), false);
});

test('security audit: public health payload omits sensitive internals and client components never import private answer keys', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const { getHealthStatusPayload } = await import('../server/gradingEngine');

  // 1. Public health check must only expose { status: 'ok' }
  const publicHealth = getHealthStatusPayload(false) as Record<string, unknown>;
  assert.deepEqual(Object.keys(publicHealth), ['status']);
  assert.equal(publicHealth.status, 'ok');
  assert.equal('adminEmail' in publicHealth, false);
  assert.equal('firebaseProjectId' in publicHealth, false);
  assert.equal('firestoreDatabaseId' in publicHealth, false);
  assert.equal('gradingMetrics' in publicHealth, false);

  // 2. Admin health check returns diagnostics with valid Gemini model ID
  const adminHealth = getHealthStatusPayload(true) as Record<string, unknown>;
  assert.equal(adminHealth.status, 'ok');
  assert.equal(adminHealth.gradingModel, process.env.GEMINI_GRADING_MODEL || 'gemini-3-flash-preview');
  assert.notEqual(adminHealth.gradingModel, 'gemini-3.8-flash');
  assert.ok(adminHealth.gradingMetrics);

  // 3. Client components must not import raw answer-key modules (initialLessons / diagnosticPassages)
  const clientFiles = [
    'src/App.tsx',
    'src/components/PlacementAssessmentView.tsx',
    'src/components/AdminStudio.tsx',
  ];
  for (const relPath of clientFiles) {
    const src = fs.readFileSync(path.join(process.cwd(), relPath), 'utf8');
    assert.equal(
      /from\s+['"][^'"]*initialLessons['"]/.test(src),
      false,
      `${relPath} must not import initialLessons (private answer keys)`
    );
    assert.equal(
      /from\s+['"][^'"]*diagnosticPassages['"]/.test(src),
      false,
      `${relPath} must not import diagnosticPassages (private answer keys)`
    );
  }
  const placementViewSrc = fs.readFileSync(
    path.join(process.cwd(), 'src/components/PlacementAssessmentView.tsx'),
    'utf8'
  );
  assert.equal(
    /from\s+['"][^'"]*placementEngine['"]/.test(placementViewSrc),
    false,
    'PlacementAssessmentView.tsx must not import placementEngine (which pulls in diagnosticPassages)'
  );

  // 4. Upload image route unconditionally enforces verified admin token
  const uploadRouteSource = fs.readFileSync(
    path.join(process.cwd(), 'app/api/admin/upload-image/route.ts'),
    'utf8'
  );
  assert.ok(uploadRouteSource.includes('!verified || !verified.isAdmin'));
  assert.equal(uploadRouteSource.includes('if (authHeader)'), false);
});

test('multi-word expression detection, contextual sense disambiguation, longest-match, separable verbs, and constituent word lookup', async () => {
  const {
    lookupPassageWord,
    detectMultiWordExpressionsInText,
    computeMultiWordExpressionCoverageReport,
  } = await import('./wordLookupService');
  const { INITIAL_LESSONS } = await import('../data/initialLessons');
  const { DIAGNOSTIC_PASSAGES } = await import('../data/diagnosticPassages');

  // Guard against any runtime network calls
  const originalFetch = globalThis.fetch;
  let fetchCalled = false;
  globalThis.fetch = (async () => {
    fetchCalled = true;
    throw new Error('Runtime network calls are forbidden during MWE lookup');
  }) as any;

  try {
    // 1. "back up" in "Please back up your files" -> digital copy meaning
    const s1 = 'Please back up your files before installing the system update.';
    const backUpFilesFromBack = lookupPassageWord({
      rawWord: 'back',
      sentence: s1,
      charOffsetInSentence: s1.indexOf('back'),
    });
    const backUpFilesFromUp = lookupPassageWord({
      rawWord: 'up',
      sentence: s1,
      charOffsetInSentence: s1.indexOf('up'),
    });
    assert.ok(backUpFilesFromBack && backUpFilesFromUp);
    assert.equal(backUpFilesFromBack.word, 'back up');
    assert.equal(backUpFilesFromUp.word, 'back up');
    assert.equal(backUpFilesFromBack.id, backUpFilesFromUp.id);
    assert.equal(backUpFilesFromBack.partOfSpeech, 'Phrasal verb');
    assert.ok(
      backUpFilesFromBack.simpleDefinition.toLowerCase().includes('copy') ||
        backUpFilesFromBack.simpleDefinition.toLowerCase().includes('files')
    );

    // 2. "backs up" in "The evidence backs up her argument" -> support/confirm meaning
    const s2 = 'The geological evidence backs up her argument about ancient sea levels.';
    const backsUpSupport = lookupPassageWord({
      rawWord: 'backs',
      sentence: s2,
      charOffsetInSentence: s2.indexOf('backs'),
    });
    const backsUpFromParticle = lookupPassageWord({
      rawWord: 'up',
      sentence: s2,
      charOffsetInSentence: s2.indexOf('up'),
    });
    assert.ok(backsUpSupport && backsUpFromParticle);
    assert.equal(backsUpSupport.word, 'back up');
    assert.equal(backsUpSupport.matchedText, 'backs up');
    assert.equal(backsUpSupport.id, backsUpFromParticle.id);
    assert.ok(
      backsUpSupport.simpleDefinition.toLowerCase().includes('support') ||
        backsUpSupport.simpleDefinition.toLowerCase().includes('confirm')
    );
    assert.notEqual(backUpFilesFromBack.simpleDefinition, backsUpSupport.simpleDefinition);

    // 3. "backed up" in "The car backed up" -> move backward/reverse meaning
    const s3 = 'The car backed up slowly out of the narrow driveway.';
    const backedUpReverse = lookupPassageWord({
      rawWord: 'backed',
      sentence: s3,
      charOffsetInSentence: s3.indexOf('backed'),
    });
    assert.ok(backedUpReverse);
    assert.equal(backedUpReverse.word, 'back up');
    assert.equal(backedUpReverse.matchedText, 'backed up');
    assert.ok(
      backedUpReverse.simpleDefinition.toLowerCase().includes('backward') ||
        backedUpReverse.simpleDefinition.toLowerCase().includes('reverse')
    );
    assert.notEqual(backedUpReverse.simpleDefinition, backUpFilesFromBack.simpleDefinition);
    assert.notEqual(backedUpReverse.simpleDefinition, backsUpSupport.simpleDefinition);

    // 4. "gave up" in "They gave up trying" -> stop trying meaning
    const s4 = 'They gave up trying to cross the mountain pass before winter.';
    const gaveUpTrying = lookupPassageWord({
      rawWord: 'gave',
      sentence: s4,
      charOffsetInSentence: s4.indexOf('gave'),
    });
    assert.ok(gaveUpTrying);
    assert.equal(gaveUpTrying.word, 'give up');
    assert.equal(gaveUpTrying.matchedText, 'gave up');
    assert.ok(gaveUpTrying.simpleDefinition.toLowerCase().includes('stop trying'));

    // 5. "gave up" in "She gave up her seat" -> surrender/hand over seat meaning
    const s5 = 'She gave up her seat on the crowded train to an elderly passenger.';
    const gaveUpSeat = lookupPassageWord({
      rawWord: 'gave',
      sentence: s5,
      charOffsetInSentence: s5.indexOf('gave'),
    });
    assert.ok(gaveUpSeat);
    assert.equal(gaveUpSeat.word, 'give up');
    assert.equal(gaveUpSeat.matchedText, 'gave up');
    assert.ok(
      gaveUpSeat.simpleDefinition.toLowerCase().includes('hand over') ||
        gaveUpSeat.simpleDefinition.toLowerCase().includes('allow someone else to have')
    );
    assert.notEqual(gaveUpTrying.simpleDefinition, gaveUpSeat.simpleDefinition);

    // 6. "carried out" in "Researchers carried out a study"
    const s6 = 'Researchers carried out a study on coral reef recovery.';
    const carriedOutFromVerb = lookupPassageWord({
      rawWord: 'carried',
      sentence: s6,
      charOffsetInSentence: s6.indexOf('carried'),
    });
    const carriedOutFromParticle = lookupPassageWord({
      rawWord: 'out',
      sentence: s6,
      charOffsetInSentence: s6.indexOf('out'),
    });
    assert.ok(carriedOutFromVerb && carriedOutFromParticle);
    assert.equal(carriedOutFromVerb.word, 'carry out');
    assert.equal(carriedOutFromVerb.matchedText, 'carried out');
    assert.equal(carriedOutFromVerb.id, carriedOutFromParticle.id);
    assert.ok(
      carriedOutFromVerb.simpleDefinition.toLowerCase().includes('perform') ||
        carriedOutFromVerb.simpleDefinition.toLowerCase().includes('conduct')
    );

    // 7. "run out of" in "We ran out of time" (longest match over "run out")
    const s7 = 'We ran out of time before completing the final survey.';
    const ranOutOf = lookupPassageWord({
      rawWord: 'ran',
      sentence: s7,
      charOffsetInSentence: s7.indexOf('ran'),
    });
    const ranOutOfFromOf = lookupPassageWord({
      rawWord: 'of',
      sentence: s7,
      charOffsetInSentence: s7.indexOf('of'),
    });
    assert.ok(ranOutOf && ranOutOfFromOf);
    assert.equal(ranOutOf.word, 'run out of');
    assert.equal(ranOutOf.matchedText, 'ran out of');
    assert.equal(ranOutOf.id, ranOutOfFromOf.id);
    assert.ok(ranOutOf.simpleDefinition.toLowerCase().includes('supply'));

    // 8. "on the other hand"
    const s8 = 'Solar lamps, on the other hand, require no weekly kerosene fuel.';
    const onTheOtherHand = lookupPassageWord({
      rawWord: 'hand',
      sentence: s8,
      charOffsetInSentence: s8.indexOf('hand'),
    });
    assert.ok(onTheOtherHand);
    assert.equal(onTheOtherHand.word, 'on the other hand');
    assert.equal(onTheOtherHand.partOfSpeech, 'Fixed expression');
    assert.ok(onTheOtherHand.simpleDefinition.toLowerCase().includes('contrasting'));

    // 9. "in the long run"
    const s9 = 'Preventive conservation is far less expensive in the long run.';
    const inTheLongRun = lookupPassageWord({
      rawWord: 'run',
      sentence: s9,
      charOffsetInSentence: s9.indexOf('run'),
    });
    assert.ok(inTheLongRun);
    assert.equal(inTheLongRun.word, 'in the long run');
    assert.equal(inTheLongRun.partOfSpeech, 'Idiom');
    assert.ok(inTheLongRun.simpleDefinition.toLowerCase().includes('long period of time'));

    // 10. "take into account"
    const s10 = 'Accurate climate models must take into account cloud cover and ocean currents.';
    const takeIntoAccount = lookupPassageWord({
      rawWord: 'account',
      sentence: s10,
      charOffsetInSentence: s10.indexOf('account'),
    });
    assert.ok(takeIntoAccount);
    assert.equal(takeIntoAccount.word, 'take into account');
    assert.equal(takeIntoAccount.partOfSpeech, 'Academic collocation');
    assert.ok(takeIntoAccount.simpleDefinition.toLowerCase().includes('consider'));

    // 11. Normal single words near an expression still show their single-word definitions
    const filesSingleWord = lookupPassageWord({
      rawWord: 'files',
      sentence: s1,
      charOffsetInSentence: s1.indexOf('files'),
    });
    const evidenceSingleWord = lookupPassageWord({
      rawWord: 'evidence',
      sentence: s2,
      charOffsetInSentence: s2.indexOf('evidence'),
    });
    assert.ok(filesSingleWord && evidenceSingleWord);
    assert.equal(filesSingleWord.word, 'files');
    assert.equal(evidenceSingleWord.word, 'evidence');
    assert.notEqual(filesSingleWord.word, 'back up');
    assert.notEqual(evidenceSingleWord.word, 'back up');

    // 12. Separable phrasal verbs ("back the files up", "turned the job offer down") and clause boundary / spatial guards
    const sSeparated = 'Please back the files up before updating the system.';
    const sepBack = lookupPassageWord({
      rawWord: 'back',
      sentence: sSeparated,
      charOffsetInSentence: sSeparated.indexOf('back'),
    });
    const sepUp = lookupPassageWord({
      rawWord: 'up',
      sentence: sSeparated,
      charOffsetInSentence: sSeparated.indexOf('up'),
    });
    assert.ok(sepBack && sepUp);
    assert.equal(sepBack.word, 'back up');
    assert.equal(sepBack.matchedText, 'back the files up');
    assert.equal(sepBack.id, sepUp.id);

    // Clause boundary guard: comma between "came" and "across" must NOT match "come across"
    const sBoundary = 'When the researchers came, across the valley rain began to fall.';
    const boundaryMatches = detectMultiWordExpressionsInText(sBoundary);
    assert.equal(
      boundaryMatches.some((m) => m.canonical === 'come across'),
      false,
      'Must not match phrasal verb across a comma clause boundary'
    );

    // Literal spatial guard: "walked back up the stairs" and "turned down the narrow street" must not falsely match idiomatic phrasal verbs
    const sLiteralStairs = 'The students walked back up the stairs to the library.';
    assert.equal(
      detectMultiWordExpressionsInText(sLiteralStairs).some((m) => m.canonical === 'back up'),
      false
    );
    const sLiteralStreet = 'The carriage turned down the narrow street toward the harbor.';
    assert.equal(
      detectMultiWordExpressionsInText(sLiteralStreet).some((m) => m.canonical === 'turn down'),
      false
    );

    // 13. Corpus MWE coverage report across all 114 regular lessons and 18 diagnostic passages
    const mweReport = computeMultiWordExpressionCoverageReport(INITIAL_LESSONS, DIAGNOSTIC_PASSAGES);
    assert.equal(mweReport.totalPassagesScanned, 132);
    assert.ok(mweReport.totalDictionaryExpressions >= 80);
    assert.ok(mweReport.polysemousExpressionsCount >= 7);
    assert.ok(mweReport.totalCorpusMWEInstances >= 150);
    assert.ok(mweReport.curatedMultiWordAnnotationsCount >= 250);
  } finally {
    globalThis.fetch = originalFetch;
  }

  assert.equal(fetchCalled, false, 'MWE lookup must never invoke fetch()');
});





