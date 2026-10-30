import { CEFRLevel, LessonAttempt, ReadingLesson } from '../types/reading';

export const ADAPTIVE_LEVELS: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

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

export interface AdaptiveProfile {
  startingLevel: CEFRLevel;
  currentLevel: CEFRLevel;
  currentDifficultyScore: number;
  consecutivePasses: number;
  consecutiveFailures: number;
}

export function createAdaptiveProfile(startingLevel: CEFRLevel): AdaptiveProfile {
  const range = DIFFICULTY_RANGES[startingLevel];
  return {
    startingLevel,
    currentLevel: startingLevel,
    currentDifficultyScore: Math.min(range.max, range.min + ADAPTIVE_SETTINGS.difficultyStep),
    consecutivePasses: 0,
    consecutiveFailures: 0,
  };
}

/** Consistent offline rating: sentence length, lexical length, and question demands. */
export function estimateLessonDifficulty(lesson: ReadingLesson): number {
  const range = DIFFICULTY_RANGES[lesson.level];
  const words = lesson.passage.match(/[A-Za-z][A-Za-z'-]*/g) || [];
  const sentences = lesson.passage.match(/[^.!?]+[.!?]+/g) || [lesson.passage];
  const averageSentenceLength = words.length / Math.max(1, sentences.length);
  const longWordShare = words.filter((word) => word.replace(/[^A-Za-z]/g, '').length >= 9).length / Math.max(1, words.length);
  const demandingQuestionShare = lesson.questions.filter((question) =>
    question.difficulty === 'challenging' || ['matching_headings', 'matching_information', 'matching_features', 'yes_no_not_given'].includes(question.type)
  ).length / Math.max(1, lesson.questions.length);
  const sentenceComplexity = Math.min(1, averageSentenceLength / 32);
  const lexicalComplexity = Math.min(1, longWordShare / 0.24);
  const featureScore = (sentenceComplexity * 0.4) + (lexicalComplexity * 0.4) + (demandingQuestionShare * 0.2);
  const score = range.min + Math.round(featureScore * (range.max - range.min));
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
