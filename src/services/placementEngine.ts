import {
  CEFRLevel,
  PlacementAbandonReason,
  PlacementSession,
  PlacementStepResult,
  ReadingLesson,
} from '../types/reading';
import { DIAGNOSTIC_PASSAGES } from '../data/diagnosticPassages';
import { ADAPTIVE_LEVELS, DIFFICULTY_RANGES } from './adaptiveLearning';
import { evaluateQuestionLocally } from './gradingService';

export interface PlacementSettings {
  initialLevel: CEFRLevel;
  /** Strict hard cap: a learner must NEVER receive more than 3 diagnostic passages. */
  maxPassages: number;
  /** Minimum passages required before an early stop can occur. */
  minPassagesForEarlyStop: number;
  /** 80% or higher indicates strong comprehension at the tested level. */
  strongThreshold: number;
  /** Below 60% indicates insufficient demonstrated comprehension at the tested level. */
  weakThreshold: number;
  /** Minimum combined/confirmed accuracy to treat a level as sufficiently demonstrated. */
  confirmedCompetenceThreshold: number;
}

import {
  clearAllPlacementTimersForTests,
  computeRemainingPlacementMs,
  computeRemainingPlacementSeconds,
  formatPlacementCountdown,
  getActivePlacementTimerCount,
  getPlacementDraftStorageKey,
  getPlacementTimerVisualState,
  isPlacementAssessmentLocked,
  isPlacementSessionExpired,
  MAX_PLACEMENT_PASSAGES,
  PLACEMENT_DURATION_MS,
  PLACEMENT_DURATION_SECONDS,
  PLACEMENT_TIMEOUT_MESSAGE,
  PlacementTimerVisualState,
  PlacementTimerVisualTier,
  SERVER_NETWORK_LATENCY_TOLERANCE_MS,
  stopPlacementSessionTimer,
  subscribePlacementSessionTimer,
} from './placementTimerService';

export {
  clearAllPlacementTimersForTests,
  computeRemainingPlacementMs,
  computeRemainingPlacementSeconds,
  formatPlacementCountdown,
  getActivePlacementTimerCount,
  getPlacementDraftStorageKey,
  getPlacementTimerVisualState,
  isPlacementAssessmentLocked,
  isPlacementSessionExpired,
  MAX_PLACEMENT_PASSAGES,
  PLACEMENT_DURATION_MS,
  PLACEMENT_DURATION_SECONDS,
  PLACEMENT_TIMEOUT_MESSAGE,
  SERVER_NETWORK_LATENCY_TOLERANCE_MS,
  stopPlacementSessionTimer,
  subscribePlacementSessionTimer,
};
export type { PlacementTimerVisualState, PlacementTimerVisualTier };

export const DEFAULT_PLACEMENT_SETTINGS: PlacementSettings = {
  initialLevel: 'B1',
  maxPassages: MAX_PLACEMENT_PASSAGES,
  minPassagesForEarlyStop: 2,
  strongThreshold: 80,
  weakThreshold: 60,
  confirmedCompetenceThreshold: 67,
};

export const LEVEL_LABELS: Record<CEFRLevel, string> = {
  A1: 'Beginner',
  A2: 'Elementary',
  B1: 'Intermediate',
  B2: 'Upper-Intermediate',
  C1: 'Advanced',
  C2: 'Proficiency',
};

export const LEVEL_PLACEMENT_DESCRIPTIONS: Record<CEFRLevel, string> = {
  A1: 'You are ready to build a strong foundation with clear, concrete passages about everyday and popular science topics while expanding core English vocabulary in context.',
  A2: 'You understand clear factual passages and everyday explanations, and you are ready to develop confidence with multi-paragraph texts and high-frequency academic vocabulary.',
  B1: 'You can follow structured multi-paragraph articles, identify main ideas and supporting details, and infer meaning from context across familiar academic subjects.',
  B2: 'You demonstrate strong comprehension of analytical texts, nuanced arguments, and cause-and-effect relationships typical of upper-intermediate academic reading.',
  C1: 'You handle dense scholarly prose, subtle conceptual distinctions, and complex inference at an advanced academic reading level.',
  C2: 'You demonstrate full academic proficiency with complex interdisciplinary synthesis, rhetorical subtlety, and high-density scholarly arguments.',
};

export const PLACEMENT_LEVELS: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1'];
export const MAX_PLACEMENT_LEVEL: CEFRLevel = 'C1';

export function isAllowedPlacementLevel(
  level: unknown
): level is 'A1' | 'A2' | 'B1' | 'B2' | 'C1' {
  return typeof level === 'string' && PLACEMENT_LEVELS.includes(level as CEFRLevel);
}

export function getPlacementDiagnosticPool(
  passageBank: ReadingLesson[] = DIAGNOSTIC_PASSAGES
): ReadingLesson[] {
  return passageBank.filter((passage) => isAllowedPlacementLevel(passage.level));
}

function clampMaxPassages(requested?: number): number {
  if (typeof requested !== 'number' || !Number.isFinite(requested)) {
    return DEFAULT_PLACEMENT_SETTINGS.maxPassages;
  }
  // Enforce the non-negotiable rule: NEVER allow more than 3 passages in a placement assessment
  return Math.max(1, Math.min(3, Math.floor(requested)));
}

export function resolvePlacementSettings(
  overrides?: Partial<PlacementSettings>
): PlacementSettings {
  const requestedInitial = overrides?.initialLevel;
  const safeInitialLevel: CEFRLevel = isAllowedPlacementLevel(requestedInitial)
    ? requestedInitial
    : DEFAULT_PLACEMENT_SETTINGS.initialLevel;
  return {
    ...DEFAULT_PLACEMENT_SETTINGS,
    ...overrides,
    initialLevel: safeInitialLevel,
    maxPassages: clampMaxPassages(overrides?.maxPassages),
  };
}

function stepLevelIndex(level: CEFRLevel): number {
  const idx = PLACEMENT_LEVELS.indexOf(level);
  return idx >= 0 ? idx : PLACEMENT_LEVELS.length - 1;
}

function shiftCefrLevel(level: CEFRLevel, delta: -1 | 0 | 1): CEFRLevel {
  const idx = stepLevelIndex(level);
  const nextIdx = Math.max(0, Math.min(PLACEMENT_LEVELS.length - 1, idx + delta));
  return PLACEMENT_LEVELS[nextIdx];
}

/**
 * Picks an unseen diagnostic passage for the target CEFR level (strictly A1–C1) and preferred band.
 */
export function pickUnseenDiagnosticPassage(
  targetLevel: CEFRLevel,
  attemptedPassageIds: Set<string>,
  preferredBand: 'foundation' | 'core' | 'stretch' = 'foundation',
  passageBank: ReadingLesson[] = DIAGNOSTIC_PASSAGES
): ReadingLesson | null {
  const pool = getPlacementDiagnosticPool(passageBank);
  const safeTargetLevel: CEFRLevel = isAllowedPlacementLevel(targetLevel)
    ? targetLevel
    : MAX_PLACEMENT_LEVEL;

  const candidatesAtLevel = pool.filter(
    (p) => p.level === safeTargetLevel && !attemptedPassageIds.has(p.id)
  );
  if (candidatesAtLevel.length > 0) {
    const exactBand = candidatesAtLevel.find((p) => p.diagnosticBand === preferredBand);
    return exactBand || candidatesAtLevel[0];
  }

  // Fallback to nearest adjacent allowed placement level (A1–C1) if all 3 at targetLevel were exhausted
  const targetIdx = stepLevelIndex(safeTargetLevel);
  const remaining = pool
    .filter((p) => !attemptedPassageIds.has(p.id))
    .sort(
      (a, b) =>
        Math.abs(stepLevelIndex(a.level) - targetIdx) -
        Math.abs(stepLevelIndex(b.level) - targetIdx)
    );
  return remaining[0] || null;
}

export interface NextDiagnosticDecision {
  shouldComplete: boolean;
  nextLevel: CEFRLevel | null;
  nextPassage: ReadingLesson | null;
  reason: string;
}

/**
 * Determines whether the placement assessment should finish early (at 2 passages),
 * finish at the strict 3-passage cap, or select the next diagnostic passage.
 *
 * STRICT INVARIANTS:
 * - Once steps.length >= 3, shouldComplete is ALWAYS true. A fourth passage is never assigned.
 * - Active placement selection is strictly capped at C1; C2 passages are never selected.
 */
export function decideNextDiagnosticPassage(
  steps: PlacementStepResult[],
  passageBank: ReadingLesson[] = DIAGNOSTIC_PASSAGES,
  customSettings?: Partial<PlacementSettings>
): NextDiagnosticDecision {
  const settings = resolvePlacementSettings(customSettings);
  const pool = getPlacementDiagnosticPool(passageBank);
  const attemptedIds = new Set(steps.map((s) => s.passageId));

  // Initial state: Passage 1 always starts at B1 (or configured A1–C1 initialLevel)
  if (steps.length === 0) {
    const firstPassage = pickUnseenDiagnosticPassage(
      settings.initialLevel,
      attemptedIds,
      'foundation',
      pool
    );
    return {
      shouldComplete: false,
      nextLevel: firstPassage?.level || settings.initialLevel,
      nextPassage: firstPassage,
      reason: `Starting adaptive placement assessment at ${settings.initialLevel}.`,
    };
  }

  // STRICT CAP: Never administer a 4th passage
  if (steps.length >= settings.maxPassages) {
    return {
      shouldComplete: true,
      nextLevel: null,
      nextPassage: null,
      reason: 'Reached the maximum of three diagnostic passages.',
    };
  }

  const lastStep = steps[steps.length - 1];
  const lastStepLevel: CEFRLevel = isAllowedPlacementLevel(lastStep.level)
    ? lastStep.level
    : MAX_PLACEMENT_LEVEL;

  // After Passage 1 (typically at B1):
  if (steps.length === 1) {
    if (lastStep.accuracy >= settings.strongThreshold) {
      const nextLevel = shiftCefrLevel(lastStepLevel, 1);
      const preferredBand = nextLevel === lastStepLevel ? 'stretch' : 'core';
      const nextPassage = pickUnseenDiagnosticPassage(
        nextLevel,
        attemptedIds,
        preferredBand,
        pool
      );
      return {
        shouldComplete: !nextPassage,
        nextLevel: nextPassage ? nextPassage.level : null,
        nextPassage,
        reason: `Strong result (${lastStep.accuracy}%) at ${lastStepLevel}; stepping up one level to ${nextLevel}.`,
      };
    }

    if (lastStep.accuracy < settings.weakThreshold) {
      const nextLevel = shiftCefrLevel(lastStepLevel, -1);
      const preferredBand = nextLevel === lastStepLevel ? 'foundation' : 'core';
      const nextPassage = pickUnseenDiagnosticPassage(
        nextLevel,
        attemptedIds,
        preferredBand,
        pool
      );
      return {
        shouldComplete: !nextPassage,
        nextLevel: nextPassage ? nextPassage.level : null,
        nextPassage,
        reason: `Below-threshold result (${lastStep.accuracy}%) at ${lastStepLevel}; stepping down one level to ${nextLevel}.`,
      };
    }

    // Borderline result (60%–79%): gather more evidence at the same level
    const nextPassage = pickUnseenDiagnosticPassage(
      lastStepLevel,
      attemptedIds,
      'core',
      pool
    );
    return {
      shouldComplete: !nextPassage,
      nextLevel: nextPassage ? nextPassage.level : null,
      nextPassage,
      reason: `Borderline result (${lastStep.accuracy}%) at ${lastStepLevel}; selecting a second passage at ${lastStepLevel} to confirm comprehension.`,
    };
  }

  // After Passage 2 (steps.length === 2):
  const firstStep = steps[0];
  const secondStep = steps[1];
  const firstStepLevel: CEFRLevel = isAllowedPlacementLevel(firstStep.level)
    ? firstStep.level
    : MAX_PLACEMENT_LEVEL;
  const secondStepLevel: CEFRLevel = isAllowedPlacementLevel(secondStep.level)
    ? secondStep.level
    : MAX_PLACEMENT_LEVEL;

  // Early-stop checks when 2 passages already establish a clear, consistent level:
  if (
    firstStepLevel === secondStepLevel &&
    firstStep.accuracy >= settings.weakThreshold &&
    secondStep.accuracy >= settings.weakThreshold
  ) {
    const avg = Math.round((firstStep.accuracy + secondStep.accuracy) / 2);
    if (avg >= settings.confirmedCompetenceThreshold && avg < settings.strongThreshold + 5) {
      return {
        shouldComplete: true,
        nextLevel: null,
        nextPassage: null,
        reason: `Two consistent passages at ${secondStepLevel} (${firstStep.accuracy}% and ${secondStep.accuracy}%) establish ${secondStepLevel} without needing a third passage.`,
      };
    }
  }

  // Otherwise, select the 3rd (and final) passage adaptively within A1–C1:
  let targetThirdLevel: CEFRLevel = secondStepLevel;
  let preferredBand: 'foundation' | 'core' | 'stretch' = 'core';

  if (secondStep.accuracy >= settings.strongThreshold) {
    targetThirdLevel = shiftCefrLevel(secondStepLevel, 1);
    preferredBand = targetThirdLevel === secondStepLevel ? 'stretch' : 'core';
  } else if (secondStep.accuracy < settings.weakThreshold) {
    targetThirdLevel = shiftCefrLevel(secondStepLevel, -1);
    preferredBand = targetThirdLevel === secondStepLevel ? 'foundation' : 'core';
  } else {
    // Borderline on Passage 2: test one more passage at the same level to confirm
    targetThirdLevel = secondStepLevel;
    preferredBand = 'stretch';
  }

  const thirdPassage = pickUnseenDiagnosticPassage(
    targetThirdLevel,
    attemptedIds,
    preferredBand,
    pool
  );

  if (!thirdPassage) {
    return {
      shouldComplete: true,
      nextLevel: null,
      nextPassage: null,
      reason: 'No additional diagnostic passage required; ready to calculate recommendation.',
    };
  }

  return {
    shouldComplete: false,
    nextLevel: thirdPassage.level,
    nextPassage: thirdPassage,
    reason: `Selecting final diagnostic passage at ${thirdPassage.level} to refine the starting recommendation.`,
  };
}

export interface PlacementRecommendationSummary {
  recommendedLevel: CEFRLevel;
  recommendedDifficultyScore: number;
  confidence: 'high' | 'moderate' | 'conservative';
  explanationSummary: string;
}

/**
 * Calculates a conservative, evidence-based starting CEFR recommendation across ALL
 * completed diagnostic passages (up to 3), strictly bounded within A1–C1.
 *
 * Rules:
 * - Evaluates accuracy at each tested level, consistency across passages, and whether
 *   the learner demonstrated comprehension at a higher level.
 * - Never assigns C2; C1 is the maximum initial placement level.
 * - Never assigns a level simply because it was the last passage attempted.
 * - When results are borderline or contradictory, chooses the more conservative suitable
 *   starting level rather than overstating ability.
 */
export function calculateConservativeRecommendation(
  steps: PlacementStepResult[],
  customSettings?: Partial<PlacementSettings>
): PlacementRecommendationSummary {
  const settings = resolvePlacementSettings(customSettings);

  if (steps.length === 0) {
    const defaultRange = DIFFICULTY_RANGES[settings.initialLevel];
    return {
      recommendedLevel: settings.initialLevel,
      recommendedDifficultyScore: defaultRange.min + 4,
      confidence: 'conservative',
      explanationSummary:
        'Your reading journey starts at B1 (Intermediate), our balanced baseline level. This is an estimated starting level for FluentLoop rather than an official CEFR certification or guaranteed IELTS band score.',
    };
  }

  // Group performance by allowed placement CEFR level (A1–C1)
  const statsByLevel = new Map<
    CEFRLevel,
    { count: number; totalAccuracy: number; avgAccuracy: number; maxAccuracy: number; minAccuracy: number }
  >();

  for (const step of steps) {
    const safeLevel: CEFRLevel = isAllowedPlacementLevel(step.level)
      ? step.level
      : MAX_PLACEMENT_LEVEL;
    const existing = statsByLevel.get(safeLevel);
    if (!existing) {
      statsByLevel.set(safeLevel, {
        count: 1,
        totalAccuracy: step.accuracy,
        avgAccuracy: step.accuracy,
        maxAccuracy: step.accuracy,
        minAccuracy: step.accuracy,
      });
    } else {
      const count = existing.count + 1;
      const totalAccuracy = existing.totalAccuracy + step.accuracy;
      statsByLevel.set(safeLevel, {
        count,
        totalAccuracy,
        avgAccuracy: Math.round(totalAccuracy / count),
        maxAccuracy: Math.max(existing.maxAccuracy, step.accuracy),
        minAccuracy: Math.min(existing.minAccuracy, step.accuracy),
      });
    }
  }

  // Determine the highest level in PLACEMENT_LEVELS (A1–C1) with demonstrated competence
  let highestDemonstratedIdx = -1;
  let hasContradiction = false;

  for (let i = 0; i < PLACEMENT_LEVELS.length; i++) {
    const lvl = PLACEMENT_LEVELS[i];
    const stat = statsByLevel.get(lvl);
    if (!stat) continue;

    // A level is demonstrated if average accuracy at that level is >= confirmedCompetenceThreshold (67%)
    // and the learner did not score below weakThreshold (60%) on a repeat passage at that same level.
    const demonstratedHere =
      stat.avgAccuracy >= settings.confirmedCompetenceThreshold &&
      (stat.count === 1 || stat.minAccuracy >= settings.weakThreshold);

    if (demonstratedHere) {
      // Check if the learner failed (< 60%) at a LOWER tested level (contradictory evidence)
      let failedLowerLevel = false;
      for (let lowerIdx = 0; lowerIdx < i; lowerIdx++) {
        const lowerStat = statsByLevel.get(PLACEMENT_LEVELS[lowerIdx]);
        if (lowerStat && lowerStat.avgAccuracy < settings.weakThreshold) {
          failedLowerLevel = true;
          break;
        }
      }

      if (failedLowerLevel) {
        hasContradiction = true;
      } else {
        highestDemonstratedIdx = i;
      }
    }
  }

  let recommendedLevel: CEFRLevel;
  let confidence: 'high' | 'moderate' | 'conservative' = 'moderate';

  if (highestDemonstratedIdx >= 0) {
    recommendedLevel = PLACEMENT_LEVELS[highestDemonstratedIdx];

    // Check if the learner had a contradictory failure at the same level or erratic swings
    const chosenStat = statsByLevel.get(recommendedLevel);
    const overallAvg = Math.round(
      steps.reduce((sum, s) => sum + s.accuracy, 0) / steps.length
    );

    // If the learner passed a higher level on 1 passage (e.g., 67% borderline) after a weak or borderline lower level,
    // or if overall average across all 3 passages is < 65%, step down one level conservatively.
    if (
      highestDemonstratedIdx > 0 &&
      chosenStat &&
      chosenStat.count === 1 &&
      chosenStat.avgAccuracy < settings.strongThreshold &&
      overallAvg < settings.confirmedCompetenceThreshold
    ) {
      recommendedLevel = PLACEMENT_LEVELS[highestDemonstratedIdx - 1];
      confidence = 'conservative';
    } else if (
      chosenStat &&
      chosenStat.avgAccuracy >= settings.strongThreshold &&
      !hasContradiction
    ) {
      confidence = 'high';
    } else if (hasContradiction) {
      confidence = 'conservative';
    }
  } else {
    // Learner did not reach 67% at any tested level (e.g. weak at B1, weak at A2, weak/borderline at A1)
    const lowestTestedIdx = Math.min(...steps.map((s) => stepLevelIndex(s.level)));
    const lowestLevel = PLACEMENT_LEVELS[Math.max(0, lowestTestedIdx)];
    const lowestStat = statsByLevel.get(lowestLevel);

    if (
      lowestStat &&
      lowestStat.avgAccuracy >= settings.weakThreshold &&
      lowestStat.minAccuracy >= settings.weakThreshold
    ) {
      recommendedLevel = lowestLevel;
      confidence = 'conservative';
    } else {
      // Step one level below the lowest tested level, floored at A1
      recommendedLevel = PLACEMENT_LEVELS[Math.max(0, lowestTestedIdx - 1)];
      confidence = 'conservative';
    }
  }

  // Strictly enforce the C1 placement ceiling
  if (!isAllowedPlacementLevel(recommendedLevel)) {
    recommendedLevel = MAX_PLACEMENT_LEVEL;
  }

  // Compute initial internal difficulty score inside the recommended level's band
  const range = DIFFICULTY_RANGES[recommendedLevel];
  const levelStat = statsByLevel.get(recommendedLevel);
  let offsetWithinBand = 4; // Default lower-mid starting point
  if (levelStat) {
    if (levelStat.avgAccuracy >= 85) {
      offsetWithinBand = Math.round((range.max - range.min) * 0.55);
    } else if (levelStat.avgAccuracy >= 72) {
      offsetWithinBand = Math.round((range.max - range.min) * 0.35);
    } else {
      offsetWithinBand = 4;
    }
  }
  const recommendedDifficultyScore = Math.max(
    range.min,
    Math.min(range.max, range.min + offsetWithinBand)
  );

  // Build plain-English explanation
  const stepDescriptions = steps
    .map((s, idx) => `Passage ${idx + 1} (${s.level}: ${s.score}/${s.totalQuestions}, ${s.accuracy}%)`)
    .join(', ');

  const conservatismNote =
    confidence === 'conservative'
      ? ' Because your scores varied across difficulty bands, we selected a comfortable, conservative starting level so you can build momentum right away.'
      : '';

  const explanationSummary = `Based on your ${steps.length}-passage diagnostic check—${stepDescriptions}—your recommended starting level is ${recommendedLevel} (${LEVEL_LABELS[recommendedLevel]}).${conservatismNote} This is an estimated starting level to personalize your FluentLoop reading journey, not an official CEFR certification or a guaranteed IELTS band score.`;

  return {
    recommendedLevel,
    recommendedDifficultyScore,
    confidence,
    explanationSummary,
  };
}

/**
 * Ensures the placement grading engine always receives a complete and properly formatted
 * answer set for every question in a diagnostic passage. Unanswered questions are
 * populated with `""` so they are deterministically marked incorrect.
 */
export function buildCompleteDiagnosticAnswerSet(
  passage: ReadingLesson,
  partialAnswers?: Record<string, string>
): Record<string, string> {
  const complete: Record<string, string> = {};
  const source = partialAnswers && typeof partialAnswers === 'object' ? partialAnswers : {};
  for (const question of passage.questions) {
    const raw = source[question.id];
    complete[question.id] = typeof raw === 'string' ? raw.trim() : '';
  }
  return complete;
}

/**
 * Deterministically grades a diagnostic passage submission against the authoritative diagnostic bank.
 * Unanswered questions are treated as incorrect (`isCorrect: false`, `verdict: 'incorrect'`, `awardedPoints: 0`).
 */
export function gradeDiagnosticPassage(
  passage: ReadingLesson,
  answers: Record<string, string>,
  submittedAtIso?: string
): PlacementStepResult {
  let correctCount = 0;
  const totalQuestions = passage.questions.length;
  const normalizedAnswers = buildCompleteDiagnosticAnswerSet(passage, answers);
  const results: NonNullable<PlacementStepResult['results']> = [];

  for (const question of passage.questions) {
    const rawUserAnswer = normalizedAnswers[question.id] || '';
    const evaluation = evaluateQuestionLocally(question, rawUserAnswer);
    if (evaluation.isCorrect && evaluation.verdict === 'correct') {
      correctCount += 1;
    }
    results.push({
      ...evaluation,
      awardedPoints: evaluation.isCorrect ? 1 : 0,
    });
  }

  const accuracy =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  return {
    passageId: passage.id,
    passageTitle: passage.title,
    level: passage.level,
    diagnosticBand: passage.diagnosticBand,
    score: correctCount,
    totalQuestions,
    accuracy,
    answers: normalizedAnswers,
    results,
    submittedAt: submittedAtIso || new Date().toISOString(),
  };
}

/**
 * Creates a fresh placement session starting at B1 with a strict 20-minute (1,200s) authoritative deadline.
 */
export function createPlacementSession(
  userId: string = 'guest',
  isAnonymous: boolean = true,
  passageBank: ReadingLesson[] = DIAGNOSTIC_PASSAGES,
  customSettings?: Partial<PlacementSettings>,
  startedAtMs: number = Date.now()
): PlacementSession {
  const settings = resolvePlacementSettings(customSettings);
  const pool = getPlacementDiagnosticPool(passageBank);
  const decision = decideNextDiagnosticPassage([], pool, settings);
  const effectiveStartMs =
    typeof startedAtMs === 'number' && Number.isFinite(startedAtMs) ? startedAtMs : Date.now();
  const nowIso = new Date(effectiveStartMs).toISOString();

  return {
    id: `pl-${effectiveStartMs}-${Math.random().toString(36).slice(2, 8)}`,
    userId,
    isAnonymous,
    status: 'in_progress',
    currentLevel: decision.nextLevel || settings.initialLevel,
    activePassageId: decision.nextPassage?.id || null,
    steps: [],
    startedAtMs: effectiveStartMs,
    deadlineAtMs: effectiveStartMs + PLACEMENT_DURATION_MS,
    durationSeconds: PLACEMENT_DURATION_SECONDS,
    draftAnswersByPassage: {},
    timedOut: false,
    createdAt: nowIso,
    updatedAt: nowIso,
  };
}

/**
 * Marks an unfinished placement session as abandoned when the learner refreshes the page
 * or navigates away before completing the assessment.
 * - Never resets or alters a `completed` placement session.
 * - Idempotent when called repeatedly on an already `abandoned` session.
 * - Discards unfinished draft answers and activePassageId so the session cannot be resumed.
 */
export function abandonPlacementSession(
  session: PlacementSession,
  reason: PlacementAbandonReason = 'navigation_exit',
  nowMs: number = Date.now()
): {
  session: PlacementSession;
  wasAbandoned: boolean;
  alreadyCompleted: boolean;
  alreadyAbandoned: boolean;
} {
  stopPlacementSessionTimer(session.id);

  if (session.status === 'completed') {
    return {
      session,
      wasAbandoned: false,
      alreadyCompleted: true,
      alreadyAbandoned: false,
    };
  }

  if (session.status === 'abandoned') {
    return {
      session,
      wasAbandoned: true,
      alreadyCompleted: false,
      alreadyAbandoned: true,
    };
  }

  const nowIso = new Date(nowMs).toISOString();
  const abandonedSession: PlacementSession = {
    ...session,
    status: 'abandoned',
    activePassageId: null,
    draftAnswersByPassage: {},
    abandonedAt: nowIso,
    abandonReason: reason,
    updatedAt: nowIso,
  };

  return {
    session: abandonedSession,
    wasAbandoned: true,
    alreadyCompleted: false,
    alreadyAbandoned: false,
  };
}

/**
 * Updates draft answers for an active placement session without ever modifying or
 * extending `startedAtMs` or `deadlineAtMs`.
 * If the session is already completed, abandoned, expired at `nowMs`, or if `passageId`
 * does not match `session.activePassageId`, the update is rejected.
 */
export function saveDraftAnswersInPlacementSession(
  session: PlacementSession,
  passageId: string,
  answers: Record<string, string>,
  nowMs: number = Date.now()
): {
  session: PlacementSession;
  accepted: boolean;
  lateRejected: boolean;
  abandonedRejected?: boolean;
  wrongPassageRejected?: boolean;
} {
  if (session.status === 'abandoned') {
    return {
      session,
      accepted: false,
      lateRejected: false,
      abandonedRejected: true,
      wrongPassageRejected: false,
    };
  }

  if (session.status === 'completed' || isPlacementSessionExpired(session, nowMs)) {
    return {
      session,
      accepted: false,
      lateRejected: true,
      abandonedRejected: false,
      wrongPassageRejected: false,
    };
  }

  if (session.activePassageId && passageId !== session.activePassageId) {
    return {
      session,
      accepted: false,
      lateRejected: false,
      abandonedRejected: false,
      wrongPassageRejected: true,
    };
  }

  const sanitized: Record<string, string> = {};
  if (answers && typeof answers === 'object') {
    for (const [k, v] of Object.entries(answers)) {
      if (typeof v === 'string') {
        sanitized[k] = v;
      }
    }
  }

  const nextDrafts: Record<string, Record<string, string>> = {
    ...(session.draftAnswersByPassage || {}),
    [passageId]: sanitized,
  };

  return {
    session: {
      ...session,
      draftAnswersByPassage: nextDrafts,
      // Explicitly preserve original start and deadline timestamps
      startedAtMs: session.startedAtMs,
      deadlineAtMs: session.deadlineAtMs,
      durationSeconds: session.durationSeconds || PLACEMENT_DURATION_SECONDS,
    },
    accepted: true,
    lateRejected: false,
    abandonedRejected: false,
    wrongPassageRejected: false,
  };
}

/**
 * Automatically finalizes a placement session when the 20-minute timer reaches zero.
 * - Preserves all previously completed steps (`session.steps`).
 * - Grades the currently active passage (if any) using only answers selected before the deadline,
 *   marking all unanswered questions as incorrect.
 * - Computes the final CEFR level using the conservative `calculateConservativeRecommendation` algorithm (strictly A1–C1).
 * - Idempotent: calling multiple times on an already completed session returns the same result.
 * - Rejects abandoned sessions so an abandoned session can never be finalized.
 */
export function finalizePlacementSessionOnTimeout(
  session: PlacementSession,
  passageBank: ReadingLesson[] = DIAGNOSTIC_PASSAGES,
  preDeadlineActiveAnswers?: Record<string, string>,
  customSettings?: Partial<PlacementSettings>,
  nowMs: number = Date.now()
): {
  session: PlacementSession;
  finalStepResult: PlacementStepResult | null;
  wasAlreadyCompleted: boolean;
} {
  if (session.status === 'abandoned') {
    throw new Error('Placement session has been abandoned and cannot be finalized.');
  }
  const settings = resolvePlacementSettings(customSettings);
  const pool = getPlacementDiagnosticPool(passageBank);

  if (session.status === 'completed') {
    return {
      session,
      finalStepResult: session.steps[session.steps.length - 1] || null,
      wasAlreadyCompleted: true,
    };
  }

  const nowIso = new Date(nowMs).toISOString();
  let updatedSteps = [...session.steps];
  let finalStepResult: PlacementStepResult | null =
    updatedSteps[updatedSteps.length - 1] || null;

  if (session.activePassageId && updatedSteps.length < settings.maxPassages) {
    const alreadyGraded = updatedSteps.some((s) => s.passageId === session.activePassageId);
    if (!alreadyGraded) {
      const activePassage = pool.find((p) => p.id === session.activePassageId);
      if (activePassage) {
        const storedDrafts = session.draftAnswersByPassage?.[activePassage.id] || {};
        const effectivePreDeadlineAnswers =
          preDeadlineActiveAnswers && Object.keys(preDeadlineActiveAnswers).length > 0
            ? { ...storedDrafts, ...preDeadlineActiveAnswers }
            : storedDrafts;

        const gradedActive = gradeDiagnosticPassage(
          activePassage,
          effectivePreDeadlineAnswers,
          nowIso
        );
        updatedSteps = [...updatedSteps, gradedActive].slice(0, settings.maxPassages);
        finalStepResult = gradedActive;
      }
    }
  }

  const recommendation = calculateConservativeRecommendation(updatedSteps, settings);
  const timeoutExplanation = recommendation.explanationSummary.startsWith(PLACEMENT_TIMEOUT_MESSAGE)
    ? recommendation.explanationSummary
    : `${PLACEMENT_TIMEOUT_MESSAGE} ${recommendation.explanationSummary}`;

  const finalizedSession: PlacementSession = {
    ...session,
    status: 'completed',
    currentLevel: recommendation.recommendedLevel,
    activePassageId: null,
    steps: updatedSteps,
    timedOut: true,
    finalizedAt: nowIso,
    recommendedLevel: recommendation.recommendedLevel,
    recommendedDifficultyScore: recommendation.recommendedDifficultyScore,
    confidence: recommendation.confidence,
    explanationSummary: timeoutExplanation,
    startedAtMs: session.startedAtMs,
    deadlineAtMs: session.deadlineAtMs,
    durationSeconds: session.durationSeconds || PLACEMENT_DURATION_SECONDS,
    updatedAt: nowIso,
  };

  return {
    session: finalizedSession,
    finalStepResult,
    wasAlreadyCompleted: false,
  };
}

/**
 * Applies a submitted diagnostic passage to an active PlacementSession idempotently.
 * Enforces:
 * - Strict A1–C1 placement passage eligibility (C2 passages are rejected).
 * - Strict activePassageId match (`passage.id === session.activePassageId`) on non-duplicate submissions.
 * - Strict 3-passage cap and original 20-minute deadline preservation.
 */
export function applyDiagnosticSubmissionToSession(
  session: PlacementSession,
  passage: ReadingLesson,
  answers: Record<string, string>,
  passageBank: ReadingLesson[] = DIAGNOSTIC_PASSAGES,
  customSettings?: Partial<PlacementSettings>,
  nowMs: number = Date.now()
): {
  session: PlacementSession;
  stepResult: PlacementStepResult;
  nextPassage: ReadingLesson | null;
  wasDuplicate: boolean;
} {
  if (session.status === 'abandoned') {
    throw new Error('Placement session has been abandoned and cannot accept submissions.');
  }

  if (!isAllowedPlacementLevel(passage.level)) {
    throw new Error(
      `Diagnostic passage ${passage.id} (${passage.level}) is outside the allowed A1–C1 placement range.`
    );
  }

  const settings = resolvePlacementSettings(customSettings);
  const pool = getPlacementDiagnosticPool(passageBank);

  // Idempotency guard: if this passageId was already graded in this session, return existing state
  const existingStep = session.steps.find((s) => s.passageId === passage.id);
  if (existingStep) {
    const nextPassage = session.activePassageId
      ? pool.find((p) => p.id === session.activePassageId) || null
      : null;
    return {
      session,
      stepResult: existingStep,
      nextPassage,
      wasDuplicate: true,
    };
  }

  // If session is already completed or already has 3 steps, do not append a 4th step
  if (session.status === 'completed' || session.steps.length >= settings.maxPassages) {
    const rec = calculateConservativeRecommendation(session.steps, settings);
    const finalized: PlacementSession = {
      ...session,
      status: 'completed',
      activePassageId: null,
      recommendedLevel:
        session.recommendedLevel && isAllowedPlacementLevel(session.recommendedLevel)
          ? session.recommendedLevel
          : rec.recommendedLevel,
      recommendedDifficultyScore:
        session.recommendedDifficultyScore ?? rec.recommendedDifficultyScore,
      confidence: session.confidence || rec.confidence,
      explanationSummary: session.explanationSummary || rec.explanationSummary,
      startedAtMs: session.startedAtMs,
      deadlineAtMs: session.deadlineAtMs,
      durationSeconds: session.durationSeconds || PLACEMENT_DURATION_SECONDS,
      updatedAt: new Date(nowMs).toISOString(),
    };
    return {
      session: finalized,
      stepResult: session.steps[session.steps.length - 1],
      nextPassage: null,
      wasDuplicate: true,
    };
  }

  // Active passage validation: submitted passage must match the session's currently assigned activePassageId
  if (!session.activePassageId || passage.id !== session.activePassageId) {
    throw new Error(
      `Submitted diagnostic passage (${passage.id}) does not match the active placement passage (${session.activePassageId || 'none'}).`
    );
  }

  const nowIso = new Date(nowMs).toISOString();
  const stepResult = gradeDiagnosticPassage(passage, answers, nowIso);
  const updatedSteps = [...session.steps, stepResult].slice(0, settings.maxPassages);
  const decision = decideNextDiagnosticPassage(updatedSteps, pool, settings);

  const remainingDrafts = { ...(session.draftAnswersByPassage || {}) };
  delete remainingDrafts[passage.id];

  if (decision.shouldComplete || !decision.nextPassage) {
    const recommendation = calculateConservativeRecommendation(updatedSteps, settings);
    const completedSession: PlacementSession = {
      ...session,
      status: 'completed',
      currentLevel: recommendation.recommendedLevel,
      activePassageId: null,
      steps: updatedSteps,
      draftAnswersByPassage: remainingDrafts,
      finalizedAt: nowIso,
      recommendedLevel: recommendation.recommendedLevel,
      recommendedDifficultyScore: recommendation.recommendedDifficultyScore,
      confidence: recommendation.confidence,
      explanationSummary: recommendation.explanationSummary,
      startedAtMs: session.startedAtMs,
      deadlineAtMs: session.deadlineAtMs,
      durationSeconds: session.durationSeconds || PLACEMENT_DURATION_SECONDS,
      updatedAt: nowIso,
    };
    return {
      session: completedSession,
      stepResult,
      nextPassage: null,
      wasDuplicate: false,
    };
  }

  const inProgressSession: PlacementSession = {
    ...session,
    status: 'in_progress',
    currentLevel: decision.nextPassage.level,
    activePassageId: decision.nextPassage.id,
    steps: updatedSteps,
    draftAnswersByPassage: remainingDrafts,
    // Strictly preserve original start time and 20-minute deadline when advancing passages
    startedAtMs: session.startedAtMs,
    deadlineAtMs: session.deadlineAtMs,
    durationSeconds: session.durationSeconds || PLACEMENT_DURATION_SECONDS,
    updatedAt: nowIso,
  };

  return {
    session: inProgressSession,
    stepResult,
    nextPassage: decision.nextPassage,
    wasDuplicate: false,
  };
}


