import {
  AcademicTopic,
  AdaptiveRecommendation,
  CEFRLevel,
  LessonAttempt,
  QuestionType,
  ReadingLesson,
} from '../types/reading';
import { QUESTION_TYPE_LABELS } from './gradingService';
import { isQualifyingStreakAttempt, parseActivityTimestamp } from './streakService';

const LEVEL_ORDER: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

/**
 * Transparent, rule-based adaptive reading difficulty recommender.
 * Never automatically mutates the user's selected level after a single result;
 * requires at least 3 completed lessons at the current level to suggest a level shift,
 * and explains recommendations clearly.
 */
export function computeAdaptiveRecommendation(
  currentSelectedLevel: CEFRLevel,
  attempts: LessonAttempt[],
  allPublishedLessons: ReadingLesson[]
): AdaptiveRecommendation {
  const completedAttempts = attempts
    .filter(isQualifyingStreakAttempt)
    .sort((a, b) => {
      const timeB = parseActivityTimestamp(b.updatedAt)?.getTime() ?? 0;
      const timeA = parseActivityTimestamp(a.updatedAt)?.getTime() ?? 0;
      return timeB - timeA;
    });

  // Deduplicate by lessonId at the current level (preferring first-time completion) so repeated
  // practice attempts of the same passage do not inflate `completedAtCurrentLevel`.
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
  const confidenceReady = completedAtCurrentLevel >= 3;

  // Compute recent accuracy at current level (last 5 distinct completed lessons at this level)
  const recentSlice = currentLevelAttempts.slice(0, 5);
  const recentAverageAccuracy =
    recentSlice.length > 0
      ? Math.round(
          recentSlice.reduce((sum, a) => sum + a.accuracy, 0) / recentSlice.length
        )
      : 0;

  // Aggregate accuracy by question type across all completed attempts
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

  const currentIdx = LEVEL_ORDER.indexOf(currentSelectedLevel);
  let recommendedLevel: CEFRLevel = currentSelectedLevel;
  let action: 'easier' | 'similar' | 'harder' = 'similar';
  let reason = '';

  if (completedAtCurrentLevel === 0) {
    reason = `You have selected ${currentSelectedLevel}. Complete at least 3 passages at this level to unlock personalized level-progression recommendations.`;
  } else if (!confidenceReady) {
    reason = `You have completed ${completedAtCurrentLevel} of 3 required passages at ${currentSelectedLevel} (recent average: ${recentAverageAccuracy}%). We require at least 3 completed passages before suggesting a level change so a single result never skews your path.`;
  } else if (recentAverageAccuracy >= 85 && currentIdx < LEVEL_ORDER.length - 1) {
    recommendedLevel = LEVEL_ORDER[currentIdx + 1];
    action = 'harder';
    reason = `Strong mastery across ${completedAtCurrentLevel} passages at ${currentSelectedLevel} (${recentAverageAccuracy}% recent accuracy). You are ready to try ${recommendedLevel} passages with denser academic syntax and deeper inference questions.`;
  } else if (recentAverageAccuracy >= 85 && currentIdx === LEVEL_ORDER.length - 1) {
    recommendedLevel = 'C2';
    action = 'similar';
    reason = `Exceptional mastery across ${completedAtCurrentLevel} passages at C2 Proficiency (${recentAverageAccuracy}% recent accuracy), our highest CEFR reading level. Continue exploring unseen C2 scholarly passages to deepen your analytical stamina.`;
  } else if (recentAverageAccuracy < 55 && currentIdx > 0) {
    recommendedLevel = LEVEL_ORDER[currentIdx - 1];
    action = 'easier';
    reason = `Your recent accuracy across ${completedAtCurrentLevel} passages at ${currentSelectedLevel} is ${recentAverageAccuracy}%. Consolidating core vocabulary and sentence structures at ${recommendedLevel} will build stronger reading fluency.`;
  } else {
    recommendedLevel = currentSelectedLevel;
    action = 'similar';
    reason = `Consistent progress at ${currentSelectedLevel} (${recentAverageAccuracy}% recent accuracy across ${completedAtCurrentLevel} passages). Continue practising ${currentSelectedLevel} passages—especially in topics or question formats where accuracy is below 75%.`;
  }

  const completedLessonIds = new Set(completedAttempts.map((a) => a.lessonId));
  const candidateLessons = allPublishedLessons.filter(
    (l) => l.status === 'published' && l.level === recommendedLevel && !completedLessonIds.has(l.id)
  );

  // Prioritize weak topics if available
  const weakTopicSet = new Set(weakestTopics.map((w) => w.topic));
  const prioritized = [
    ...candidateLessons.filter((l) => weakTopicSet.has(l.topic)),
    ...candidateLessons.filter((l) => !weakTopicSet.has(l.topic)),
  ].slice(0, 3);

  return {
    currentSelectedLevel,
    recommendedLevel,
    action,
    reason,
    confidenceReady,
    completedAtCurrentLevel,
    recentAverageAccuracy,
    weakestQuestionTypes,
    weakestTopics,
    suggestedLessons:
      prioritized.length > 0
        ? prioritized
        : allPublishedLessons
            .filter((l) => l.status === 'published' && l.level === recommendedLevel)
            .slice(0, 3),
  };
}
