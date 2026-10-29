import {
  CEFRLevel,
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

export const MAX_PLACEMENT_PASSAGES = 3;

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
  return {
    ...DEFAULT_PLACEMENT_SETTINGS,
    ...overrides,
    maxPassages: clampMaxPassages(overrides?.maxPassages),
  };
}

function stepLevelIndex(level: CEFRLevel): number {
  return ADAPTIVE_LEVELS.indexOf(level);
}

function shiftCefrLevel(level: CEFRLevel, delta: -1 | 0 | 1): CEFRLevel {
  const idx = stepLevelIndex(level);
  const nextIdx = Math.max(0, Math.min(ADAPTIVE_LEVELS.length - 1, idx + delta));
  return ADAPTIVE_LEVELS[nextIdx];
}

/**
 * Picks an unseen diagnostic passage for the target CEFR level and preferred band.
 */
export function pickUnseenDiagnosticPassage(
  targetLevel: CEFRLevel,
  attemptedPassageIds: Set<string>,
  preferredBand: 'foundation' | 'core' | 'stretch' = 'foundation',
  passageBank: ReadingLesson[] = DIAGNOSTIC_PASSAGES
): ReadingLesson | null {
  const candidatesAtLevel = passageBank.filter(
    (p) => p.level === targetLevel && !attemptedPassageIds.has(p.id)
  );
  if (candidatesAtLevel.length > 0) {
    const exactBand = candidatesAtLevel.find((p) => p.diagnosticBand === preferredBand);
    return exactBand || candidatesAtLevel[0];
  }

  // Fallback to nearest adjacent level if all 3 at targetLevel were somehow exhausted
  const targetIdx = stepLevelIndex(targetLevel);
  const remaining = passageBank
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
 * STRICT INVARIANT: Once steps.length >= 3, shouldComplete is ALWAYS true.
 * A fourth passage is never assigned.
 */
export function decideNextDiagnosticPassage(
  steps: PlacementStepResult[],
  passageBank: ReadingLesson[] = DIAGNOSTIC_PASSAGES,
  customSettings?: Partial<PlacementSettings>
): NextDiagnosticDecision {
  const settings = resolvePlacementSettings(customSettings);
  const attemptedIds = new Set(steps.map((s) => s.passageId));

  // Initial state: Passage 1 always starts at B1
  if (steps.length === 0) {
    const firstPassage = pickUnseenDiagnosticPassage(
      settings.initialLevel,
      attemptedIds,
      'foundation',
      passageBank
    );
    return {
      shouldComplete: false,
      nextLevel: settings.initialLevel,
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

  // After Passage 1 (typically at B1):
  if (steps.length === 1) {
    if (lastStep.accuracy >= settings.strongThreshold) {
      const nextLevel = shiftCefrLevel(lastStep.level, 1);
      const nextPassage = pickUnseenDiagnosticPassage(
        nextLevel,
        attemptedIds,
        'core',
        passageBank
      );
      return {
        shouldComplete: !nextPassage,
        nextLevel: nextPassage ? nextLevel : null,
        nextPassage,
        reason: `Strong result (${lastStep.accuracy}%) at ${lastStep.level}; stepping up one level to ${nextLevel}.`,
      };
    }

    if (lastStep.accuracy < settings.weakThreshold) {
      const nextLevel = shiftCefrLevel(lastStep.level, -1);
      const nextPassage = pickUnseenDiagnosticPassage(
        nextLevel,
        attemptedIds,
        'core',
        passageBank
      );
      return {
        shouldComplete: !nextPassage,
        nextLevel: nextPassage ? nextLevel : null,
        nextPassage,
        reason: `Below-threshold result (${lastStep.accuracy}%) at ${lastStep.level}; stepping down one level to ${nextLevel}.`,
      };
    }

    // Borderline result (60%–79%): gather more evidence at the same level
    const nextPassage = pickUnseenDiagnosticPassage(
      lastStep.level,
      attemptedIds,
      'core',
      passageBank
    );
    return {
      shouldComplete: !nextPassage,
      nextLevel: nextPassage ? lastStep.level : null,
      nextPassage,
      reason: `Borderline result (${lastStep.accuracy}%) at ${lastStep.level}; selecting a second passage at ${lastStep.level} to confirm comprehension.`,
    };
  }

  // After Passage 2 (steps.length === 2):
  const firstStep = steps[0];
  const secondStep = steps[1];

  // Early-stop checks when 2 passages already establish a clear, consistent level:
  // Case A: Both passages were at the same level (e.g., B1 borderline followed by another B1)
  // and both demonstrated at least borderline/confirmed competence (>= 60%), with combined average >= 67%.
  if (
    firstStep.level === secondStep.level &&
    firstStep.accuracy >= settings.weakThreshold &&
    secondStep.accuracy >= settings.weakThreshold
  ) {
    const avg = Math.round((firstStep.accuracy + secondStep.accuracy) / 2);
    if (avg >= settings.confirmedCompetenceThreshold && avg < settings.strongThreshold + 5) {
      return {
        shouldComplete: true,
        nextLevel: null,
        nextPassage: null,
        reason: `Two consistent passages at ${secondStep.level} (${firstStep.accuracy}% and ${secondStep.accuracy}%) establish ${secondStep.level} without needing a third passage.`,
      };
    }
  }

  // Otherwise, select the 3rd (and final) passage adaptively:
  let targetThirdLevel: CEFRLevel = secondStep.level;
  let preferredBand: 'foundation' | 'core' | 'stretch' = 'core';

  if (secondStep.accuracy >= settings.strongThreshold) {
    targetThirdLevel = shiftCefrLevel(secondStep.level, 1);
    preferredBand = targetThirdLevel === secondStep.level ? 'stretch' : 'core';
  } else if (secondStep.accuracy < settings.weakThreshold) {
    targetThirdLevel = shiftCefrLevel(secondStep.level, -1);
    preferredBand = targetThirdLevel === secondStep.level ? 'foundation' : 'core';
  } else {
    // Borderline on Passage 2: test one more passage at the same level to confirm
    targetThirdLevel = secondStep.level;
    preferredBand = 'stretch';
  }

  const thirdPassage = pickUnseenDiagnosticPassage(
    targetThirdLevel,
    attemptedIds,
    preferredBand,
    passageBank
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
 * completed diagnostic passages (up to 3).
 *
 * Rules:
 * - Evaluates accuracy at each tested level, consistency across passages, and whether
 *   the learner demonstrated comprehension at a higher level.
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

  // Group performance by CEFR level
  const statsByLevel = new Map<
    CEFRLevel,
    { count: number; totalAccuracy: number; avgAccuracy: number; maxAccuracy: number; minAccuracy: number }
  >();

  for (const step of steps) {
    const existing = statsByLevel.get(step.level);
    if (!existing) {
      statsByLevel.set(step.level, {
        count: 1,
        totalAccuracy: step.accuracy,
        avgAccuracy: step.accuracy,
        maxAccuracy: step.accuracy,
        minAccuracy: step.accuracy,
      });
    } else {
      const count = existing.count + 1;
      const totalAccuracy = existing.totalAccuracy + step.accuracy;
      statsByLevel.set(step.level, {
        count,
        totalAccuracy,
        avgAccuracy: Math.round(totalAccuracy / count),
        maxAccuracy: Math.max(existing.maxAccuracy, step.accuracy),
        minAccuracy: Math.min(existing.minAccuracy, step.accuracy),
      });
    }
  }

  // Determine the highest level with demonstrated competence, checking for contradictions at lower levels
  let highestDemonstratedIdx = -1;
  let hasContradiction = false;

  for (let i = 0; i < ADAPTIVE_LEVELS.length; i++) {
    const lvl = ADAPTIVE_LEVELS[i];
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
        const lowerStat = statsByLevel.get(ADAPTIVE_LEVELS[lowerIdx]);
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
    recommendedLevel = ADAPTIVE_LEVELS[highestDemonstratedIdx];

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
      recommendedLevel = ADAPTIVE_LEVELS[highestDemonstratedIdx - 1];
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
    const lowestLevel = ADAPTIVE_LEVELS[Math.max(0, lowestTestedIdx)];
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
      recommendedLevel = ADAPTIVE_LEVELS[Math.max(0, lowestTestedIdx - 1)];
      confidence = 'conservative';
    }
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
 * Deterministically grades a diagnostic passage submission against the authoritative diagnostic bank.
 */
export function gradeDiagnosticPassage(
  passage: ReadingLesson,
  answers: Record<string, string>
): PlacementStepResult {
  let correctCount = 0;
  const totalQuestions = passage.questions.length;
  const normalizedAnswers: Record<string, string> = {};
  const results: NonNullable<PlacementStepResult['results']> = [];

  for (const question of passage.questions) {
    const rawUserAnswer = typeof answers[question.id] === 'string' ? answers[question.id].trim() : '';
    normalizedAnswers[question.id] = rawUserAnswer;
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
    submittedAt: new Date().toISOString(),
  };
}

/**
 * Creates a fresh placement session starting at B1.
 */
export function createPlacementSession(
  userId: string = 'guest',
  isAnonymous: boolean = true,
  passageBank: ReadingLesson[] = DIAGNOSTIC_PASSAGES,
  customSettings?: Partial<PlacementSettings>
): PlacementSession {
  const settings = resolvePlacementSettings(customSettings);
  const decision = decideNextDiagnosticPassage([], passageBank, settings);
  const nowIso = new Date().toISOString();

  return {
    id: `pl-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    userId,
    isAnonymous,
    status: 'in_progress',
    currentLevel: decision.nextLevel || settings.initialLevel,
    activePassageId: decision.nextPassage?.id || null,
    steps: [],
    createdAt: nowIso,
    updatedAt: nowIso,
  };
}

/**
 * Applies a submitted diagnostic passage to an active PlacementSession idempotently.
 * Enforces the strict 3-passage cap and prevents duplicate submission of the same passageId.
 */
export function applyDiagnosticSubmissionToSession(
  session: PlacementSession,
  passage: ReadingLesson,
  answers: Record<string, string>,
  passageBank: ReadingLesson[] = DIAGNOSTIC_PASSAGES,
  customSettings?: Partial<PlacementSettings>
): {
  session: PlacementSession;
  stepResult: PlacementStepResult;
  nextPassage: ReadingLesson | null;
  wasDuplicate: boolean;
} {
  const settings = resolvePlacementSettings(customSettings);

  // Idempotency guard: if this passageId was already graded in this session, return existing state
  const existingStep = session.steps.find((s) => s.passageId === passage.id);
  if (existingStep) {
    const nextPassage = session.activePassageId
      ? passageBank.find((p) => p.id === session.activePassageId) || null
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
      recommendedLevel: session.recommendedLevel || rec.recommendedLevel,
      recommendedDifficultyScore:
        session.recommendedDifficultyScore ?? rec.recommendedDifficultyScore,
      confidence: session.confidence || rec.confidence,
      explanationSummary: session.explanationSummary || rec.explanationSummary,
      updatedAt: new Date().toISOString(),
    };
    return {
      session: finalized,
      stepResult: session.steps[session.steps.length - 1],
      nextPassage: null,
      wasDuplicate: true,
    };
  }

  const stepResult = gradeDiagnosticPassage(passage, answers);
  const updatedSteps = [...session.steps, stepResult].slice(0, settings.maxPassages);
  const decision = decideNextDiagnosticPassage(updatedSteps, passageBank, settings);
  const nowIso = new Date().toISOString();

  if (decision.shouldComplete || !decision.nextPassage) {
    const recommendation = calculateConservativeRecommendation(updatedSteps, settings);
    const completedSession: PlacementSession = {
      ...session,
      status: 'completed',
      currentLevel: recommendation.recommendedLevel,
      activePassageId: null,
      steps: updatedSteps,
      recommendedLevel: recommendation.recommendedLevel,
      recommendedDifficultyScore: recommendation.recommendedDifficultyScore,
      confidence: recommendation.confidence,
      explanationSummary: recommendation.explanationSummary,
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
    updatedAt: nowIso,
  };

  return {
    session: inProgressSession,
    stepResult,
    nextPassage: decision.nextPassage,
    wasDuplicate: false,
  };
}
