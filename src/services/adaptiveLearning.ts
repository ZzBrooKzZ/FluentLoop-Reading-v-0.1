import { CEFRLevel, LessonAttempt, ReadingLesson } from '../types/reading';

export const ADAPTIVE_LEVELS: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
export const PLACEMENT_LEVELS: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1'];
export const MAX_PLACEMENT_LEVEL: CEFRLevel = 'C1';

export function isAllowedPlacementLevel(
  level: unknown
): level is 'A1' | 'A2' | 'B1' | 'B2' | 'C1' {
  return typeof level === 'string' && PLACEMENT_LEVELS.includes(level as CEFRLevel);
}

/** Internal product scale only. These bands are not Lexile or CEFR conversions. */
export const DIFFICULTY_RANGES: Record<CEFRLevel, { min: number; max: number }> = {
  A1: { min: 0, max: 19 },
  A2: { min: 20, max: 39 },
  B1: { min: 40, max: 59 },
  B2: { min: 60, max: 79 },
  C1: { min: 80, max: 100 },
  C2: { min: 101, max: 120 },
};

export const ADAPTIVE_SETTINGS = {
  highScore: 85,
  lowScore: 60,
  difficultyStep: 4,
  boundaryStreakRequired: 2,
  nearBoundaryWindow: 8,
  candidateTolerance: 4,
} as const;

export const ADAPTIVE_PROFILE_SCHEMA_VERSION = 1;

export interface AdaptiveProfile {
  startingLevel: CEFRLevel;
  currentLevel: CEFRLevel;
  currentDifficultyScore: number;
  consecutivePasses: number;
  consecutiveFailures: number;
}

export function isValidAdaptiveLevel(level: unknown): level is CEFRLevel {
  return typeof level === 'string' && ADAPTIVE_LEVELS.includes(level as CEFRLevel);
}

export function createAdaptiveProfile(startingLevel: CEFRLevel): AdaptiveProfile {
  const safeLevel: CEFRLevel = isValidAdaptiveLevel(startingLevel) ? startingLevel : 'B1';
  const range = DIFFICULTY_RANGES[safeLevel];
  return {
    startingLevel: safeLevel,
    currentLevel: safeLevel,
    currentDifficultyScore: Math.min(range.max, range.min + ADAPTIVE_SETTINGS.difficultyStep),
    consecutivePasses: 0,
    consecutiveFailures: 0,
  };
}

export interface RawStoredAdaptiveProfile {
  startingLevel?: unknown;
  currentLevel?: unknown;
  preferredLevel?: unknown;
  placementLevel?: unknown;
  currentDifficultyScore?: unknown;
  consecutivePasses?: unknown;
  consecutiveFailures?: unknown;
  adaptiveProfileVersion?: unknown;
}

/**
 * Safely hydrates an authoritative AdaptiveProfile from stored user profile fields.
 * Preserves existing preferredLevel / placementLevel (including C1 and C2),
 * clamps or initializes currentDifficultyScore inside DIFFICULTY_RANGES[currentLevel],
 * and initializes missing streak counters to 0 without resetting users to A1.
 */
export function normalizeAdaptiveProfile(
  raw: RawStoredAdaptiveProfile | null | undefined,
  fallbackLevel: CEFRLevel = 'B1'
): AdaptiveProfile {
  const safeFallback: CEFRLevel = isValidAdaptiveLevel(fallbackLevel) ? fallbackLevel : 'B1';
  const currentLevel: CEFRLevel = isValidAdaptiveLevel(raw?.currentLevel)
    ? raw.currentLevel
    : isValidAdaptiveLevel(raw?.preferredLevel)
      ? raw.preferredLevel
      : isValidAdaptiveLevel(raw?.placementLevel)
        ? raw.placementLevel
        : isValidAdaptiveLevel(raw?.startingLevel)
          ? raw.startingLevel
          : safeFallback;

  const startingLevel: CEFRLevel = isValidAdaptiveLevel(raw?.startingLevel)
    ? raw.startingLevel
    : isValidAdaptiveLevel(raw?.placementLevel)
      ? raw.placementLevel
      : currentLevel === 'C2'
        ? 'C1'
        : currentLevel;

  const range = DIFFICULTY_RANGES[currentLevel];
  const defaultScore = Math.min(range.max, range.min + ADAPTIVE_SETTINGS.difficultyStep);
  const rawScore = raw?.currentDifficultyScore;
  const currentDifficultyScore =
    typeof rawScore === 'number' && Number.isFinite(rawScore)
      ? Math.max(range.min, Math.min(range.max, Math.round(rawScore)))
      : defaultScore;

  const rawPasses = raw?.consecutivePasses;
  const consecutivePasses =
    typeof rawPasses === 'number' && Number.isFinite(rawPasses) && rawPasses >= 0
      ? Math.min(ADAPTIVE_SETTINGS.boundaryStreakRequired, Math.floor(rawPasses))
      : 0;

  const rawFailures = raw?.consecutiveFailures;
  const consecutiveFailures =
    typeof rawFailures === 'number' && Number.isFinite(rawFailures) && rawFailures >= 0
      ? Math.min(ADAPTIVE_SETTINGS.boundaryStreakRequired, Math.floor(rawFailures))
      : 0;

  return {
    startingLevel,
    currentLevel,
    currentDifficultyScore,
    consecutivePasses,
    consecutiveFailures,
  };
}

/**
 * Empirically calibrated per-band linguistic baselines across the FluentLoop reading corpus:
 * - asl: average sentence length (words per sentence)
 * - awl: average lexical word length (characters per word)
 * - w7: share of words with >= 7 alphabetic characters
 * - w9: share of words with >= 9 alphabetic characters
 * - clause: internal clause punctuation density (commas, semicolons, colons, dashes per sentence)
 * - wc: passage word count stamina range
 */
const LEVEL_LINGUISTIC_NORMS: Record<
  CEFRLevel,
  {
    asl: [number, number];
    awl: [number, number];
    w7: [number, number];
    w9: [number, number];
    clause: [number, number];
    wc: [number, number];
  }
> = {
  A1: { asl: [9.3, 10.6], awl: [4.55, 4.78], w7: [0.16, 0.235], w9: [0.035, 0.068], clause: [0.42, 0.68], wc: [188, 206] },
  A2: { asl: [12.1, 13.5], awl: [4.88, 5.15], w7: [0.23, 0.305], w9: [0.068, 0.115], clause: [0.68, 0.90], wc: [286, 308] },
  B1: { asl: [16.1, 17.6], awl: [5.38, 5.65], w7: [0.33, 0.388], w9: [0.125, 0.175], clause: [0.95, 1.15], wc: [478, 505] },
  B2: { asl: [19.8, 21.3], awl: [5.72, 6.02], w7: [0.39, 0.455], w9: [0.180, 0.235], clause: [1.02, 1.25], wc: [740, 770] },
  C1: { asl: [23.3, 25.4], awl: [6.08, 6.36], w7: [0.455, 0.515], w9: [0.240, 0.292], clause: [1.06, 1.26], wc: [935, 962] },
  C2: { asl: [26.8, 30.8], awl: [6.40, 6.55], w7: [0.515, 0.548], w9: [0.300, 0.338], clause: [1.14, 1.48], wc: [1110, 1142] },
};

function normalizeBandFeature(value: number, [low, high]: [number, number]): number {
  if (high <= low) return 0.5;
  return Math.max(0, Math.min(1, (value - low) / (high - low)));
}

/**
 * Consistent offline rating within each CEFR band's DIFFICULTY_RANGES[level]:
 * combines sentence length, lexical complexity (mean word length, >=7-char and >=9-char academic density),
 * syntactic clause density, passage length stamina, and question cognitive demand.
 */
export function estimateLessonDifficulty(lesson: ReadingLesson): number {
  const range = DIFFICULTY_RANGES[lesson.level];
  const norms = LEVEL_LINGUISTIC_NORMS[lesson.level];
  const words = (lesson.passage.match(/[A-Za-z][A-Za-z'-]*/g) || [])
    .map((w) => w.replace(/[^A-Za-z]/g, ''))
    .filter(Boolean);
  const wordCount = Math.max(1, words.length);
  const sentences = (lesson.passage.match(/[^.!?]+[.!?]+/g) || [lesson.passage])
    .map((s) => s.trim())
    .filter(Boolean);
  const sentenceCount = Math.max(1, sentences.length);

  const averageSentenceLength = wordCount / sentenceCount;
  const averageWordLength = words.reduce((acc, w) => acc + w.length, 0) / wordCount;
  const mediumLongWordShare = words.filter((w) => w.length >= 7).length / wordCount;
  const longWordShare = words.filter((w) => w.length >= 9).length / wordCount;
  const clauseMarks = (lesson.passage.match(/[,;:—–-]/g) || []).length;
  const clauseDensity = clauseMarks / sentenceCount;

  const demandingQuestionShare =
    lesson.questions.length > 0
      ? lesson.questions.filter(
          (question) =>
            question.difficulty === 'challenging' ||
            [
              'matching_headings',
              'matching_information',
              'matching_features',
              'matching_sentence_endings',
              'yes_no_not_given',
              'short_answer',
            ].includes(question.type)
        ).length / lesson.questions.length
      : 0.5;

  const fAsl = normalizeBandFeature(averageSentenceLength, norms.asl);
  const fAwl = normalizeBandFeature(averageWordLength, norms.awl);
  const fW7 = normalizeBandFeature(mediumLongWordShare, norms.w7);
  const fW9 = normalizeBandFeature(longWordShare, norms.w9);
  const fClause = normalizeBandFeature(clauseDensity, norms.clause);
  const fWc = normalizeBandFeature(wordCount, norms.wc);

  const rawComposite =
    fAsl * 0.25 +
    fAwl * 0.20 +
    fW7 * 0.18 +
    fW9 * 0.17 +
    fClause * 0.10 +
    fWc * 0.05 +
    demandingQuestionShare * 0.05;

  // Center at 0.5 and expand intra-band contrast so each CEFR band spans its full [min, max] range
  const stretched = Math.max(0, Math.min(1, 0.5 + (rawComposite - 0.5) * 1.65));
  const score = range.min + Math.round(stretched * (range.max - range.min));
  return Math.max(range.min, Math.min(range.max, score));
}

export function getLessonDifficulty(lesson: ReadingLesson, overrides: Record<string, number> = {}): number {
  const override = overrides[lesson.id];
  if (typeof override === 'number' && Number.isFinite(override)) {
    const range = DIFFICULTY_RANGES[lesson.level];
    return Math.max(range.min, Math.min(range.max, Math.round(override)));
  }
  return estimateLessonDifficulty(lesson);
}

export function createSeededPassageRng(seedKey: string): () => number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seedKey.length; i++) {
    h ^= seedKey.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  let state = h >>> 0 || 1;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function selectNextLesson(
  profile: AdaptiveProfile,
  lessons: ReadingLesson[],
  attempts: LessonAttempt[],
  difficultyOverrides: Record<string, number> = {},
  random?: () => number
): ReadingLesson | null {
  const completedLessonIds = new Set(
    attempts
      .filter((attempt) => attempt.status === 'completed')
      .map((attempt) => attempt.lessonId)
  );

  const countAnswers = (ans: Record<string, string> | undefined): number => {
    if (!ans || typeof ans !== 'object') return 0;
    return Object.values(ans).filter((v) => typeof v === 'string' && v.trim().length > 0).length;
  };

  const unfinishedCandidates = attempts
    .filter(
      (attempt) =>
        attempt.status === 'in_progress' &&
        (attempt.attemptType || 'first') === 'first' &&
        !attempt.id.startsWith('att-prac-') &&
        !attempt.lessonId.trim().toLowerCase().startsWith('diag-') &&
        !completedLessonIds.has(attempt.lessonId)
    )
    .sort((a, b) => {
      const levelMatchDiff =
        (b.level === profile.currentLevel ? 1 : 0) - (a.level === profile.currentLevel ? 1 : 0);
      if (levelMatchDiff !== 0) return levelMatchDiff;
      const answerDiff = countAnswers(b.answers) - countAnswers(a.answers);
      if (answerDiff !== 0) return answerDiff;
      return (b.updatedAt || '').localeCompare(a.updatedAt || '');
    });

  for (const unfinished of unfinishedCandidates) {
    const resumed = lessons.find(
      (lesson) => lesson.id === unfinished.lessonId && lesson.status === 'published' && !lesson.isDiagnostic
    );
    if (resumed) return resumed;
  }

  const attemptedFirstTime = new Set(
    attempts.filter((attempt) => (attempt.attemptType || 'first') === 'first').map((attempt) => attempt.lessonId)
  );
  const eligible = lessons.filter((lesson) =>
    lesson.status === 'published' &&
    !lesson.isDiagnostic &&
    lesson.level === profile.currentLevel &&
    !attemptedFirstTime.has(lesson.id)
  );
  if (!eligible.length) return null;

  const scored = eligible
    .map((lesson) => ({ lesson, distance: Math.abs(getLessonDifficulty(lesson, difficultyOverrides) - profile.currentDifficultyScore) }))
    .sort((a, b) => a.distance - b.distance || a.lesson.id.localeCompare(b.lesson.id));
  const nearestDistance = scored[0].distance;
  const closeCandidates = scored.filter((item) => item.distance <= nearestDistance + ADAPTIVE_SETTINGS.candidateTolerance);

  const effectiveRandom =
    random ||
    createSeededPassageRng(
      `${attempts[0]?.userId || 'learner'}:${profile.currentLevel}:${profile.currentDifficultyScore}:${Array.from(attemptedFirstTime).sort().join(',')}`
    );

  const pick = Math.min(closeCandidates.length - 1, Math.max(0, Math.floor(effectiveRandom() * closeCandidates.length)));
  return closeCandidates[pick].lesson;
}

export interface ProgressionInput {
  profile: AdaptiveProfile;
  attemptType: 'first' | 'practice' | 'review';
  completed: boolean;
  pendingReviewCount: number;
  accuracy: number;
  lessonDifficulty: number;
}

export interface ProgressionResult {
  profile: AdaptiveProfile;
  changed: boolean;
  levelChanged: boolean;
  reason: string;
}

export function applyAttemptProgression(input: ProgressionInput): ProgressionResult {
  const unchanged: ProgressionResult = { profile: input.profile, changed: false, levelChanged: false, reason: 'Attempt is not eligible for progression.' };
  if (input.attemptType !== 'first' || !input.completed || input.pendingReviewCount > 0 || !Number.isFinite(input.accuracy) || input.accuracy < 0 || input.accuracy > 100) return unchanged;

  const profile = { ...input.profile };
  const range = DIFFICULTY_RANGES[profile.currentLevel];
  const atUpperBoundary = profile.currentDifficultyScore >= range.max - ADAPTIVE_SETTINGS.difficultyStep;
  const atLowerBoundary = profile.currentDifficultyScore <= range.min + ADAPTIVE_SETTINGS.difficultyStep;
  const demandingAtTop = input.lessonDifficulty >= range.max - ADAPTIVE_SETTINGS.nearBoundaryWindow;
  const easyAtBottom = input.lessonDifficulty <= range.min + ADAPTIVE_SETTINGS.nearBoundaryWindow;
  const currentIndex = ADAPTIVE_LEVELS.indexOf(profile.currentLevel);

  if (input.accuracy >= ADAPTIVE_SETTINGS.highScore) {
    profile.consecutiveFailures = 0;
    if (atUpperBoundary) {
      profile.currentDifficultyScore = range.max;
      profile.consecutivePasses = demandingAtTop ? profile.consecutivePasses + 1 : 0;
      if (demandingAtTop && profile.consecutivePasses >= ADAPTIVE_SETTINGS.boundaryStreakRequired && currentIndex < ADAPTIVE_LEVELS.length - 1) {
        profile.currentLevel = ADAPTIVE_LEVELS[currentIndex + 1];
        const nextRange = DIFFICULTY_RANGES[profile.currentLevel];
        profile.currentDifficultyScore = Math.min(nextRange.max, nextRange.min + ADAPTIVE_SETTINGS.difficultyStep);
        profile.consecutivePasses = 0;
        profile.consecutiveFailures = 0;
        return { profile, changed: true, levelChanged: true, reason: 'Advanced one CEFR level after consecutive successful top-boundary results.' };
      }
      return { profile, changed: true, levelChanged: false, reason: demandingAtTop ? 'Successful upper-boundary result recorded.' : 'Score passed, but the lesson was below the upper-boundary range.' };
    }
    profile.currentDifficultyScore = Math.min(range.max, profile.currentDifficultyScore + ADAPTIVE_SETTINGS.difficultyStep);
    profile.consecutivePasses = 0;
    return { profile, changed: true, levelChanged: false, reason: 'Difficulty target increased by one step.' };
  }

  if (input.accuracy < ADAPTIVE_SETTINGS.lowScore) {
    profile.consecutivePasses = 0;
    if (atLowerBoundary) {
      profile.currentDifficultyScore = range.min;
      profile.consecutiveFailures = easyAtBottom ? profile.consecutiveFailures + 1 : 0;
      if (easyAtBottom && profile.consecutiveFailures >= ADAPTIVE_SETTINGS.boundaryStreakRequired && currentIndex > 0) {
        profile.currentLevel = ADAPTIVE_LEVELS[currentIndex - 1];
        const previousRange = DIFFICULTY_RANGES[profile.currentLevel];
        profile.currentDifficultyScore = Math.max(previousRange.min, previousRange.max - ADAPTIVE_SETTINGS.difficultyStep);
        profile.consecutivePasses = 0;
        profile.consecutiveFailures = 0;
        return { profile, changed: true, levelChanged: true, reason: 'Moved down one CEFR level after consecutive lower-boundary results.' };
      }
      return { profile, changed: true, levelChanged: false, reason: easyAtBottom ? 'Lower-boundary failure recorded.' : 'Lesson difficulty was above the lower-boundary range.' };
    }
    profile.currentDifficultyScore = Math.max(range.min, profile.currentDifficultyScore - ADAPTIVE_SETTINGS.difficultyStep);
    profile.consecutiveFailures = 0;
    return { profile, changed: true, levelChanged: false, reason: 'Difficulty target decreased by one step.' };
  }

  profile.consecutivePasses = 0;
  profile.consecutiveFailures = 0;
  return { profile, changed: true, levelChanged: false, reason: 'Intermediate result; target held and boundary streaks reset.' };
}
