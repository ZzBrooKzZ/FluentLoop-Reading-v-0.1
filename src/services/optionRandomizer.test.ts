import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { INITIAL_LESSONS } from '../data/initialLessons';
import { DIAGNOSTIC_PASSAGES } from '../data/diagnosticPassages';
import {
  auditQuestionBankDistributions,
  clearAttemptOptionOrders,
  createSeededRng,
  exportOptionOrderSnapshot,
  fisherYatesShuffle,
  getOrCreateAttemptOptionOrders,
  getRandomizedOptionsForQuestion,
  getRandomizedQuestionsForAttempt,
  isOptionCorrectForQuestion,
  loadInProgressAttemptAnswers,
  restoreOptionOrderSnapshotAfterRefresh,
  saveInProgressAttemptAnswers,
  shouldRandomizeQuestionOptions,
} from './optionRandomizer';
import {
  evaluateQuestionLocally,
  gradeLessonAttempt,
  normalizeAnswer,
} from './gradingService';
import { gradeLessonSubmissionOnServer } from '../server/gradingEngine';
import { gradeDiagnosticPassage } from './placementEngine';

const ALL_PASSAGES = [...INITIAL_LESSONS, ...DIAGNOSTIC_PASSAGES];

describe('FluentLoop Answer-Position Bias Audit & Option Randomization Suite', () => {
  beforeEach(() => {
    clearAttemptOptionOrders();
  });

  it('1. Shuffled options contain the exact same options as the original', () => {
    const rng = createSeededRng('test-exact-same-options-1');
    for (const lesson of ALL_PASSAGES) {
      for (const q of lesson.questions) {
        if (!Array.isArray(q.options) || q.options.length === 0) continue;
        const randomized = getRandomizedOptionsForQuestion(
          q,
          `att-same-${lesson.id}`,
          rng
        );
        const originalSorted = [...q.options].sort();
        const shuffledValuesSorted = randomized.map((item) => item.value).sort();
        const shuffledLabelsSorted = randomized.map((item) => item.label).sort();

        assert.deepStrictEqual(
          shuffledValuesSorted,
          originalSorted,
          `Shuffled option values must match original options for ${q.id}`
        );
        assert.deepStrictEqual(
          shuffledLabelsSorted,
          originalSorted,
          `Shuffled option labels must match original options for ${q.id}`
        );
      }
    }
  });

  it('2. No option is lost or duplicated after shuffling', () => {
    const rng = createSeededRng('test-no-lost-or-duplicated-2');
    for (const lesson of ALL_PASSAGES) {
      for (const q of lesson.questions) {
        if (!Array.isArray(q.options) || q.options.length === 0) continue;
        const randomized = getRandomizedOptionsForQuestion(
          q,
          `att-nodup-${lesson.id}`,
          rng
        );

        assert.equal(
          randomized.length,
          q.options.length,
          `Option count must remain ${q.options.length} for ${q.id}`
        );

        const uniqueOriginalIndices = new Set(randomized.map((r) => r.originalIndex));
        assert.equal(
          uniqueOriginalIndices.size,
          q.options.length,
          `Every originalIndex 0..${q.options.length - 1} must appear once for ${q.id}`
        );

        const uniqueOptionIds = new Set(randomized.map((r) => r.id));
        assert.equal(
          uniqueOptionIds.size,
          q.options.length,
          `Every option ID must be unique for ${q.id}`
        );
      }
    }
  });

  it('3. Correct answer identity remains unchanged after shuffling', () => {
    const rng = createSeededRng('test-correct-identity-3');
    for (const lesson of ALL_PASSAGES) {
      for (const q of lesson.questions) {
        if (!shouldRandomizeQuestionOptions(q) || !q.options) continue;
        const originalCorrect = q.correctAnswer;
        const originalCorrectList = q.correctAnswers ? [...q.correctAnswers] : undefined;

        const randomized = getRandomizedOptionsForQuestion(
          q,
          `att-identity-${lesson.id}`,
          rng
        );

        assert.equal(q.correctAnswer, originalCorrect);
        assert.deepStrictEqual(q.correctAnswers, originalCorrectList);

        if (q.type === 'multiple_choice_two') {
          const matchingCorrectItems = randomized.filter((item) =>
            isOptionCorrectForQuestion(q, item.value)
          );
          assert.equal(
            matchingCorrectItems.length,
            2,
            `Multiple-choice-two question ${q.id} must still have 2 correct options after shuffle`
          );
        } else {
          const matchingCorrectItems = randomized.filter((item) =>
            isOptionCorrectForQuestion(q, item.value)
          );
          assert.equal(
            matchingCorrectItems.length,
            1,
            `Single-choice question ${q.id} must still have 1 canonical correct option after shuffle`
          );
          assert.equal(
            normalizeAnswer(matchingCorrectItems[0].value),
            normalizeAnswer(originalCorrect)
          );
        }
      }
    }
  });

  it('4. Grading accepts the correct option regardless of its displayed position (client & server)', async () => {
    const sampleLesson = INITIAL_LESSONS[0];
    const mcQuestion = sampleLesson.questions.find((q) => q.type === 'multiple_choice')!;
    assert.ok(mcQuestion && mcQuestion.options && mcQuestion.options.length === 4);

    const correctIdx = mcQuestion.options.findIndex(
      (opt) => normalizeAnswer(opt) === normalizeAnswer(mcQuestion.correctAnswer)
    );
    const otherIndices = [0, 1, 2, 3].filter((i) => i !== correctIdx);

    // Test placing the correct option in Displayed Position 1, Position 2, Position 3, and Position 4
    for (let targetDisplayPos = 0; targetDisplayPos < 4; targetDisplayPos++) {
      const permutation = [...otherIndices];
      permutation.splice(targetDisplayPos, 0, correctIdx);

      const shuffledOptions = permutation.map((idx) => mcQuestion.options![idx]);
      const displayedQuestion = {
        ...mcQuestion,
        options: shuffledOptions,
      };

      // The correct option is now at `shuffledOptions[targetDisplayPos]`
      const learnerSelectedValue = displayedQuestion.options[targetDisplayPos];
      assert.equal(
        normalizeAnswer(learnerSelectedValue),
        normalizeAnswer(mcQuestion.correctAnswer)
      );

      // Client-side evaluation against displayed question and authoritative question
      const localEvalDisplayed = evaluateQuestionLocally(
        displayedQuestion,
        learnerSelectedValue,
        sampleLesson.passage
      );
      const localEvalAuthoritative = evaluateQuestionLocally(
        mcQuestion,
        learnerSelectedValue,
        sampleLesson.passage
      );
      assert.equal(localEvalDisplayed.isCorrect, true);
      assert.equal(localEvalDisplayed.scoreAwarded, 1);
      assert.equal(localEvalAuthoritative.isCorrect, true);
      assert.equal(localEvalAuthoritative.scoreAwarded, 1);

      // Also verify option ID resolution works if option ID is passed
      const idEval = evaluateQuestionLocally(
        mcQuestion,
        `${mcQuestion.id}__opt_${correctIdx}`,
        sampleLesson.passage
      );
      assert.equal(idEval.isCorrect, true);

      // Server-side authoritative grading
      const serverSubmission = await gradeLessonSubmissionOnServer({
        lesson: sampleLesson,
        answers: { [mcQuestion.id]: learnerSelectedValue },
        attemptId: `test-pos-${targetDisplayPos}`,
        attemptType: 'practice',
      });
      const serverQResult = serverSubmission.graded.results.find(
        (r) => r.questionId === mcQuestion.id
      );
      assert.ok(serverQResult);
      assert.equal(
        serverQResult.isCorrect,
        true,
        `Server grading must accept correct option at displayed position ${targetDisplayPos + 1}`
      );
    }

    // Also verify Diagnostic Placement passage grading when options are shuffled
    const diagPassage = DIAGNOSTIC_PASSAGES[0];
    const diagAnswers: Record<string, string> = {};
    for (const q of diagPassage.questions) {
      const shuffledOpts = getRandomizedOptionsForQuestion(
        q,
        'diag-session-test',
        createSeededRng('diag-seed')
      );
      const correctOpt = shuffledOpts.find((o) => isOptionCorrectForQuestion(q, o.value));
      diagAnswers[q.id] = correctOpt ? correctOpt.value : q.correctAnswer;
    }
    const diagResult = gradeDiagnosticPassage(diagPassage, diagAnswers);
    assert.equal(diagResult.score, diagPassage.questions.length);
    assert.equal(diagResult.accuracy, 100);
  });

  it('5. Selecting an incorrect option remains incorrect in every displayed position', async () => {
    const sampleLesson = INITIAL_LESSONS[0];
    for (const q of sampleLesson.questions) {
      if (!shouldRandomizeQuestionOptions(q) || !q.options) continue;
      const shuffled = getRandomizedOptionsForQuestion(
        q,
        'att-incorrect-check',
        createSeededRng('incorrect-seed')
      );
      for (const optItem of shuffled) {
        const isActuallyCorrect = isOptionCorrectForQuestion(q, optItem.value);
        if (!isActuallyCorrect) {
          const evalRes = evaluateQuestionLocally(q, optItem.value, sampleLesson.passage);
          assert.equal(
            evalRes.isCorrect,
            false,
            `Distractor "${optItem.value}" at displayIndex ${optItem.displayIndex} must be graded incorrect`
          );
          assert.equal(evalRes.scoreAwarded, 0);
          assert.equal(evalRes.verdict, 'incorrect');
        }
      }
    }
  });

  it('6. Re-rendering does not change the randomized option order during an attempt', () => {
    const lesson = INITIAL_LESSONS[2];
    const attemptKey = 'att-active-session-rerender-test';

    // Initial render
    const firstRenderByQ = lesson.questions.map((q) =>
      getRandomizedOptionsForQuestion(q, attemptKey)
    );
    const firstRenderQuestions = getRandomizedQuestionsForAttempt(
      lesson.questions,
      attemptKey
    );

    // Simulate 15 subsequent React re-renders while the learner selects answers, toggles theme, or highlights words
    for (let renderPass = 1; renderPass <= 15; renderPass++) {
      const nextRenderByQ = lesson.questions.map((q) =>
        getRandomizedOptionsForQuestion(q, attemptKey)
      );
      const nextRenderQuestions = getRandomizedQuestionsForAttempt(
        lesson.questions,
        attemptKey
      );

      assert.deepStrictEqual(
        nextRenderByQ,
        firstRenderByQ,
        `Re-render #${renderPass} must preserve exact option order`
      );
      assert.deepStrictEqual(
        nextRenderQuestions,
        firstRenderQuestions,
        `Re-render #${renderPass} question view must preserve exact option order`
      );
    }
  });

  it('7. An in_progress attempt restores its saved option order (and draft answers) after refresh, while Practice Again generates a new shuffle', () => {
    const lesson = INITIAL_LESSONS[1];
    const inProgressAttemptId = 'att-inprog-refresh-101';

    // 1. Learner starts attempt and options are randomized
    const initialOrders = getOrCreateAttemptOptionOrders(
      inProgressAttemptId,
      lesson.questions,
      createSeededRng('initial-session-entropy-99')
    );
    const initialOptionViews = lesson.questions.map((q) =>
      getRandomizedOptionsForQuestion(q, inProgressAttemptId)
    );
    saveInProgressAttemptAnswers(inProgressAttemptId, {
      [lesson.questions[0].id]: lesson.questions[0].correctAnswer,
    });

    // 2. Simulate full browser page refresh: serialize persisted storage, wipe memory, and restore
    const persistedSnapshot = exportOptionOrderSnapshot();
    clearAttemptOptionOrders();
    restoreOptionOrderSnapshotAfterRefresh(persistedSnapshot);

    // 3. Learner resumes the in_progress attempt after refresh
    const restoredOptionViews = lesson.questions.map((q) =>
      getRandomizedOptionsForQuestion(q, inProgressAttemptId)
    );
    const restoredOrders = getOrCreateAttemptOptionOrders(
      inProgressAttemptId,
      lesson.questions
    );
    const restoredDraft = loadInProgressAttemptAnswers(inProgressAttemptId);

    assert.deepStrictEqual(
      restoredOrders,
      initialOrders,
      'Restored option index permutations after refresh must match pre-refresh order'
    );
    assert.deepStrictEqual(
      restoredOptionViews,
      initialOptionViews,
      'Restored option views after refresh must match pre-refresh order'
    );
    assert.equal(
      restoredDraft?.[lesson.questions[0].id],
      lesson.questions[0].correctAnswer
    );

    // 4. Starting a new "Practice Again" attempt with a fresh attemptId generates a new order
    const practiceAttemptId = 'att-prac-new-take-202';
    const practiceOrders = getOrCreateAttemptOptionOrders(
      practiceAttemptId,
      lesson.questions,
      createSeededRng('practice-again-entropy-777')
    );
    assert.notDeepStrictEqual(
      practiceOrders,
      initialOrders,
      'Practice Again attempt with a new attemptId should generate a fresh option order'
    );
  });

  it('8. Existing saved attempts and Review mode still work correctly', async () => {
    const lesson = INITIAL_LESSONS[0];
    // Simulate a historical completed attempt persisted in Firestore with canonical answers
    const historicalAnswers: Record<string, string> = {};
    for (const q of lesson.questions) {
      if (q.type === 'multiple_choice_two' && q.correctAnswers) {
        historicalAnswers[q.id] = q.correctAnswers.join(' | ');
      } else {
        historicalAnswers[q.id] = q.correctAnswer;
      }
    }

    const clientGraded = gradeLessonAttempt(
      lesson.questions,
      historicalAnswers,
      lesson.passage
    );
    assert.equal(clientGraded.score, lesson.questions.length);
    assert.equal(clientGraded.accuracy, 100);

    const serverReview = await gradeLessonSubmissionOnServer({
      lesson,
      answers: historicalAnswers,
      attemptId: 'historical-attempt-2025',
      attemptType: 'review',
    });
    assert.equal(serverReview.graded.score, lesson.questions.length);
    assert.equal(serverReview.graded.accuracy, 100);
    assert.equal(serverReview.progression, null);

    // Verify Review mode produces a deterministic, stable option order for historical attempts
    const reviewOrder1 = lesson.questions.map((q) =>
      getRandomizedOptionsForQuestion(
        q,
        'historical-attempt-2025',
        createSeededRng('historical-attempt-2025')
      )
    );
    const reviewOrder2 = lesson.questions.map((q) =>
      getRandomizedOptionsForQuestion(
        q,
        'historical-attempt-2025',
        createSeededRng('historical-attempt-2025')
      )
    );
    assert.deepStrictEqual(reviewOrder1, reviewOrder2);
  });

  it('9. Shuffle implementation is unbiased by construction (uniformity & question-bank audit)', () => {
    const rng = createSeededRng('unbiased-monte-carlo-2026');
    const positionCounts = [0, 0, 0, 0];
    const trials = 12000;
    const baseOptions = ['Correct Option', 'Distractor 1', 'Distractor 2', 'Distractor 3'];

    for (let i = 0; i < trials; i++) {
      const shuffled = fisherYatesShuffle(baseOptions, rng);
      const pos = shuffled.indexOf('Correct Option');
      positionCounts[pos] += 1;
    }

    // Expected count per position is 12,000 / 4 = 3,000 (25.0%).
    // Assert every position is within [23.5%, 26.5%].
    for (let pos = 0; pos < 4; pos++) {
      const pct = (positionCounts[pos] / trials) * 100;
      assert.ok(
        pct >= 23.5 && pct <= 26.5,
        `Position ${pos + 1} received ${pct.toFixed(2)}% (expected ~25%)`
      );
    }

    // Run full question-bank audit before and after shuffling
    const audit = auditQuestionBankDistributions(ALL_PASSAGES, {
      shuffleTrials: 50,
      seed: 'question-bank-audit-2026',
    });

    // Confirm the expanded question bank (221 MC questions across 132 passages) is balanced at the storage layer AND after shuffling
    assert.equal(audit.rawMultipleChoicePositions.total, 221);
    for (const pos of [1, 2, 3, 4]) {
      const rawPct = audit.rawMultipleChoicePositions.percentagesByPosition[pos];
      assert.ok(
        rawPct >= 20.0 && rawPct <= 30.0,
        `Raw stored MC Position ${pos} percentage ${rawPct}% must be balanced around 25%`
      );
      const postPct = audit.shuffledMultipleChoicePositions.percentagesByPosition[pos];
      assert.ok(
        postPct >= 22.0 && postPct <= 28.0,
        `Post-shuffle MC Position ${pos} percentage ${postPct}% must be balanced around 25%`
      );
    }
  });

  it('10. No mutation occurs to the original question-bank data', () => {
    const initialSnapshot = JSON.stringify(INITIAL_LESSONS);
    const diagnosticSnapshot = JSON.stringify(DIAGNOSTIC_PASSAGES);

    const rng = createSeededRng('immutability-verification');
    for (const lesson of ALL_PASSAGES) {
      const randomizedQuestions = getRandomizedQuestionsForAttempt(
        lesson.questions,
        `att-immut-${lesson.id}`,
        rng
      );
      assert.equal(randomizedQuestions.length, lesson.questions.length);
      for (const q of lesson.questions) {
        getRandomizedOptionsForQuestion(q, `att-immut-${lesson.id}`, rng);
      }
    }

    assert.equal(
      JSON.stringify(INITIAL_LESSONS),
      initialSnapshot,
      'INITIAL_LESSONS must remain 100% unmutated'
    );
    assert.equal(
      JSON.stringify(DIAGNOSTIC_PASSAGES),
      diagnosticSnapshot,
      'DIAGNOSTIC_PASSAGES must remain 100% unmutated'
    );
  });

  it('11. Verifies strict CEFR word-count calibration, bespoke paragraph individuality, and T/F/NG + Y/N/NG balance across all 132 passages', async () => {
    const { CEFR_TARGET_WORD_RANGES } = await import('../data/ieltsAcademicUpgrade');
    const expectedCounts: Record<string, number> = {
      A1: 21,
      A2: 21,
      B1: 21,
      B2: 21,
      C1: 20,
      C2: 10,
    };

    assert.equal(INITIAL_LESSONS.length, 114);
    assert.equal(DIAGNOSTIC_PASSAGES.length, 18);

    const seenParagraphs = new Set<string>();
    for (const [level, expectedCount] of Object.entries(expectedCounts)) {
      const levelLessons = INITIAL_LESSONS.filter((l) => l.level === level);
      assert.equal(
        levelLessons.length,
        expectedCount,
        `Expected ${expectedCount} lessons for ${level}, found ${levelLessons.length}`
      );

      const range = CEFR_TARGET_WORD_RANGES[level as keyof typeof CEFR_TARGET_WORD_RANGES];
      for (const lesson of levelLessons) {
        const actualWords = lesson.passage.trim().split(/\s+/).filter(Boolean).length;
        assert.equal(lesson.wordCount, actualWords, `wordCount mismatch on ${lesson.id}`);
        assert.ok(
          actualWords >= range.min && actualWords <= range.max,
          `${lesson.id} (${level}) has ${actualWords} words, expected [${range.min}, ${range.max}]`
        );
        assert.ok(
          lesson.questions.length >= 8 && lesson.questions.length <= 12,
          `${lesson.id} has ${lesson.questions.length} questions, expected 8-12`
        );

        const paragraphs = lesson.passage.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
        for (const p of paragraphs) {
          assert.equal(
            seenParagraphs.has(p),
            false,
            `Duplicate boilerplate paragraph detected in ${lesson.id}`
          );
          seenParagraphs.add(p);
        }
      }
    }

    const audit = auditQuestionBankDistributions(ALL_PASSAGES, {
      shuffleTrials: 20,
      seed: 'cefr-calibration-audit',
    });
    for (const label of ['True', 'False', 'Not Given'] as const) {
      const pct = audit.trueFalseNotGivenDistribution.percentages[label];
      assert.ok(
        pct >= 28 && pct <= 40,
        `TFNG label ${label} percentage ${pct}% out of balanced range [28%, 40%]`
      );
    }
    for (const label of ['Yes', 'No', 'Not Given'] as const) {
      const pct = audit.yesNoNotGivenDistribution.percentages[label];
      assert.ok(
        pct >= 28 && pct <= 40,
        `YNNG label ${label} percentage ${pct}% out of balanced range [28%, 40%]`
      );
    }
  });
});

