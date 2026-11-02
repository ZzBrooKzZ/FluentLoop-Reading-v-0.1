import {
  AcademicTopic,
  AdaptiveRecommendation,
  CEFRLevel,
  LessonAttempt,
  QuestionType,
  ReadingLesson,
} from '../types/reading';
import {
  ADAPTIVE_LEVELS,
  ADAPTIVE_SETTINGS,
  AdaptiveProfile,
  createAdaptiveProfile,
  DIFFICULTY_RANGES,
  getLessonDifficulty,
  normalizeAdaptiveProfile,
  selectNextLesson,
} from './adaptiveLearning';
import { QUESTION_TYPE_LABELS } from './gradingService';
import { isQualifyingStreakAttempt, parseActivityTimestamp } from './streakService';

/**
 * Authoritative, rule-based adaptive reading difficulty recommender.
 * Driven directly by the learner's server-authoritative AdaptiveProfile
 * (`DIFFICULTY_RANGES` and `ADAPTIVE_SETTINGS` from `adaptiveLearning.ts`),
 * ensuring dashboard recommendations never diverge from actual progression rules
 * or claim C2 readiness before the authoritative profile reaches C2.
 */
export function computeAdaptiveRecommendation(
  profileOrLevel: AdaptiveProfile | CEFRLevel,
  attempts: LessonAttempt[],
  allPublishedLessons: ReadingLesson[],
  difficultyOverrides: Record<string, number> = {}
): AdaptiveRecommendation {
  const profile: AdaptiveProfile =
    typeof profileOrLevel === 'string'
      ? createAdaptiveProfile(profileOrLevel)
      : normalizeAdaptiveProfile(profileOrLevel, profileOrLevel.currentLevel || 'B1');

  const currentSelectedLevel: CEFRLevel = profile.currentLevel;
  const recommendedLevel: CEFRLevel = profile.currentLevel;
  const range = DIFFICULTY_RANGES[currentSelectedLevel];

  const completedAttempts = attempts
    .filter(isQualifyingStreakAttempt)
    .sort((a, b) => {
      const timeB = parseActivityTimestamp(b.updatedAt)?.getTime() ?? 0;
      const timeA = parseActivityTimestamp(a.updatedAt)?.getTime() ?? 0;
      return timeB - timeA;
    });

  // Deduplicate by lessonId at the current level (preferring first-time completion)
  const currentLevelAll = completedAttempts.filter((a) => a.level === currentSelectedLevel);
  const currentLevelByLesson = new Map<string, LessonAttempt>();
  for (const att of currentLevelAll) {
    const existing = currentLevelByLesson.get(att.lessonId);
    if (!existing) {
      currentLevelByLesson.set(att.lessonId, att);
    } else if (
      (att.attemptType || 'first') === 'first' &&
      !att.id.startsWith('att-prac-') &&
      (existing.attemptType === 'practice' || existing.id.startsWith('att-prac-'))
    ) {
      currentLevelByLesson.set(att.lessonId, att);
    }
  }
  const currentLevelAttempts = Array.from(currentLevelByLesson.values());
  const completedAtCurrentLevel = currentLevelAttempts.length;

  // Compute recent accuracy at current level (last 5 distinct completed lessons at this level)
  const recentSlice = currentLevelAttempts.slice(0, 5);
  const recentAverageAccuracy =
    recentSlice.length > 0
      ? Math.round(
          recentSlice.reduce((sum, a) => sum + a.accuracy, 0) / recentSlice.length
        )
      : 0;

  // Aggregate accuracy by question type and topic across all completed attempts
  const typeTotals: Record<string, { correct: number; total: number }> = {};
  const topicTotals: Record<string, { sumAccuracy: number; count: number }> = {};

  for (const att of completedAttempts) {
    if (!topicTotals[att.topic]) {
      topicTotals[att.topic] = { sumAccuracy: 0, count: 0 };
    }
    topicTotals[att.topic].sumAccuracy += att.accuracy;
    topicTotals[att.topic].count += 1;

    if (att.questionTypeStats) {
      for (const [qType, stat] of Object.entries(att.questionTypeStats)) {
        if (!typeTotals[qType]) {
          typeTotals[qType] = { correct: 0, total: 0 };
        }
        typeTotals[qType].correct += stat.correct;
        typeTotals[qType].total += stat.total;
      }
    }
  }

  const weakestQuestionTypes = Object.entries(typeTotals)
    .filter(([, s]) => s.total >= 2)
    .map(([type, s]) => ({
      type: type as QuestionType,
      label: QUESTION_TYPE_LABELS[type as QuestionType] || type,
      accuracy: Math.round((s.correct / s.total) * 100),
    }))
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 3);

  const weakestTopics = Object.entries(topicTotals)
    .map(([topic, s]) => ({
      topic: topic as AcademicTopic,
      accuracy: Math.round(s.sumAccuracy / s.count),
    }))
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 3);

  const currentIdx = ADAPTIVE_LEVELS.indexOf(currentSelectedLevel);
  const nextLevel =
    currentIdx >= 0 && currentIdx < ADAPTIVE_LEVELS.length - 1
      ? ADAPTIVE_LEVELS[currentIdx + 1]
      : null;
  const prevLevel = currentIdx > 0 ? ADAPTIVE_LEVELS[currentIdx - 1] : null;

  const atUpperBoundary =
    profile.currentDifficultyScore >= range.max - ADAPTIVE_SETTINGS.difficultyStep;
  const atLowerBoundary =
    profile.currentDifficultyScore <= range.min + ADAPTIVE_SETTINGS.difficultyStep;

  const confidenceReady =
    completedAtCurrentLevel >= 2 ||
    profile.consecutivePasses > 0 ||
    profile.consecutiveFailures > 0 ||
    atUpperBoundary;

  let action: 'easier' | 'similar' | 'harder' = 'similar';
  let reason = '';

  if (currentSelectedLevel === 'C2') {
    if (atLowerBoundary && profile.consecutiveFailures > 0 && prevLevel) {
      action = 'easier';
      const remaining = Math.max(
        1,
        ADAPTIVE_SETTINGS.boundaryStreakRequired - profile.consecutiveFailures
      );
      reason = `You are at the lower difficulty boundary of C2 (${profile.currentDifficultyScore}/${range.max}) with ${profile.consecutiveFailures}/${ADAPTIVE_SETTINGS.boundaryStreakRequired} lower-boundary results below ${ADAPTIVE_SETTINGS.lowScore}%. One more result below ${ADAPTIVE_SETTINGS.lowScore}% (${remaining} remaining) on an entry-band C2 passage will adjust your level to ${prevLevel} to consolidate comprehension.`;
    } else {
      action = 'similar';
      reason = `C2 Proficiency is active (difficulty target ${profile.currentDifficultyScore} in band ${range.min}–${range.max}${completedAtCurrentLevel > 0 ? `, ${recentAverageAccuracy}% recent accuracy` : ''}). Continue practising unseen C2 scholarly passages matched to your current difficulty target.`;
    }
  } else if (atUpperBoundary && nextLevel) {
    action = 'harder';
    const remainingPasses = Math.max(
      1,
      ADAPTIVE_SETTINGS.boundaryStreakRequired - profile.consecutivePasses
    );
    reason = `You have reached the upper difficulty boundary of ${currentSelectedLevel} (${profile.currentDifficultyScore}/${range.max}) with ${profile.consecutivePasses}/${ADAPTIVE_SETTINGS.boundaryStreakRequired} consecutive top-boundary passes (≥${ADAPTIVE_SETTINGS.highScore}%). Complete ${remainingPasses} more demanding upper-boundary ${currentSelectedLevel} passage${remainingPasses === 1 ? '' : 's'} at ≥${ADAPTIVE_SETTINGS.highScore}% to advance to ${nextLevel}.`;
  } else if (atLowerBoundary && profile.consecutiveFailures > 0 && prevLevel) {
    action = 'easier';
    const remainingFailures = Math.max(
      1,
      ADAPTIVE_SETTINGS.boundaryStreakRequired - profile.consecutiveFailures
    );
    reason = `You are at the lower difficulty boundary of ${currentSelectedLevel} (${profile.currentDifficultyScore}/${range.max}) with ${profile.consecutiveFailures}/${ADAPTIVE_SETTINGS.boundaryStreakRequired} lower-boundary results below ${ADAPTIVE_SETTINGS.lowScore}%. If ${remainingFailures} more lower-boundary passage${remainingFailures === 1 ? ' is' : 's are'} below ${ADAPTIVE_SETTINGS.lowScore}%, your level will step down to ${prevLevel}.`;
  } else if (completedAtCurrentLevel === 0) {
    action = 'similar';
    reason = `Your active adaptive level is ${currentSelectedLevel} at difficulty target ${profile.currentDifficultyScore} (band ${range.min}–${range.max}). First-time completions ≥${ADAPTIVE_SETTINGS.highScore}% step difficulty up by +${ADAPTIVE_SETTINGS.difficultyStep} toward ${range.max}, where ${ADAPTIVE_SETTINGS.boundaryStreakRequired} consecutive top-boundary passes unlock ${nextLevel || currentSelectedLevel}.`;
  } else {
    action = 'similar';
    reason = `Progressing within ${currentSelectedLevel} at difficulty target ${profile.currentDifficultyScore}/${range.max} (${recentAverageAccuracy}% recent accuracy across ${completedAtCurrentLevel} passage${completedAtCurrentLevel === 1 ? '' : 's'}). Scoring ≥${ADAPTIVE_SETTINGS.highScore}% advances your difficulty target toward the ${range.max} upper boundary required before promoting to ${nextLevel || currentSelectedLevel}.`;
  }

  const weakTopicSet = new Set(weakestTopics.map((w) => w.topic));
  const primaryNext = selectNextLesson(
    profile,
    allPublishedLessons,
    attempts,
    difficultyOverrides,
    () => 0
  );

  const attemptedFirstTime = new Set(
    attempts
      .filter((attempt) => (attempt.attemptType || 'first') === 'first')
      .map((attempt) => attempt.lessonId)
  );

  const unseenAtLevel = allPublishedLessons
    .filter(
      (l) =>
        l.status === 'published' &&
        !l.isDiagnostic &&
        l.level === recommendedLevel &&
        !attemptedFirstTime.has(l.id)
    )
    .sort((a, b) => {
      const distA = Math.abs(
        getLessonDifficulty(a, difficultyOverrides) - profile.currentDifficultyScore
      );
      const distB = Math.abs(
        getLessonDifficulty(b, difficultyOverrides) - profile.currentDifficultyScore
      );
      if (distA !== distB) return distA - distB;
      const weakDiff = (weakTopicSet.has(b.topic) ? 1 : 0) - (weakTopicSet.has(a.topic) ? 1 : 0);
      if (weakDiff !== 0) return weakDiff;
      return a.id.localeCompare(b.id);
    });

  const suggestedLessons: ReadingLesson[] = [];
  if (primaryNext) {
    suggestedLessons.push(primaryNext);
  }
  for (const candidate of unseenAtLevel) {
    if (suggestedLessons.length >= 3) break;
    if (!suggestedLessons.some((s) => s.id === candidate.id)) {
      suggestedLessons.push(candidate);
    }
  }
  if (suggestedLessons.length === 0) {
    suggestedLessons.push(
      ...allPublishedLessons
        .filter((l) => l.status === 'published' && !l.isDiagnostic && l.level === recommendedLevel)
        .slice(0, 3)
    );
  }

  return {
    currentSelectedLevel,
    recommendedLevel,
    action,
    reason,
    confidenceReady,
    completedAtCurrentLevel,
    recentAverageAccuracy,
    currentDifficultyScore: profile.currentDifficultyScore,
    difficultyRange: range,
    consecutivePasses: profile.consecutivePasses,
    consecutiveFailures: profile.consecutiveFailures,
    boundaryStreakRequired: ADAPTIVE_SETTINGS.boundaryStreakRequired,
    weakestQuestionTypes,
    weakestTopics,
    suggestedLessons,
  };
}

