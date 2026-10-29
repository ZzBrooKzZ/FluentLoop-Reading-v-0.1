import { INITIAL_LESSONS } from '../data/initialLessons';
import { DIAGNOSTIC_PASSAGES } from '../data/diagnosticPassages';
import { addLessonVocabulary } from '../data/vocabularyExpansion';
import { CEFR_TARGET_WORD_RANGES, upgradeLessonToIeltsAcademic } from '../data/ieltsAcademicUpgrade';
import { ComprehensionQuestion, ReadingLesson } from '../types/reading';
import { getLessonDifficulty } from '../services/adaptiveLearning';

// Server-side authoritative custom lesson & difficulty override store
const serverCustomLessons = new Map<string, ReadingLesson>();
const serverDeletedLessonIds = new Set<string>();
const serverDifficultyOverrides: Record<string, number> = {};

export function getAllAuthoritativeLessons(): ReadingLesson[] {
  const map = new Map<string, ReadingLesson>();
  const initialById = new Map<string, ReadingLesson>();

  for (const lesson of INITIAL_LESSONS) {
    const upgraded = upgradeLessonIfNeeded(lesson, lesson);
    initialById.set(lesson.id, upgraded);
    if (!serverDeletedLessonIds.has(lesson.id)) {
      map.set(lesson.id, upgraded);
    }
  }

  for (const [id, customLesson] of serverCustomLessons.entries()) {
    if (!serverDeletedLessonIds.has(id)) {
      const builtIn = initialById.get(id);
      map.set(id, upgradeLessonIfNeeded(customLesson, builtIn));
    }
  }

  return Array.from(map.values()).map(addLessonVocabulary);
}

function upgradeLessonIfNeeded(lesson: ReadingLesson, builtIn?: ReadingLesson): ReadingLesson {
  if (lesson.isDiagnostic) {
    return lesson;
  }
  const wc = lesson.passage ? lesson.passage.split(/\s+/).filter(Boolean).length : 0;
  const targetRange = CEFR_TARGET_WORD_RANGES[lesson.level];
  if (
    builtIn &&
    ((targetRange && wc < targetRange.min) ||
      (lesson.vocabulary?.length || 0) < builtIn.vocabulary.length)
  ) {
    return builtIn;
  }
  if (targetRange && wc < targetRange.min) {
    return upgradeLessonToIeltsAcademic(lesson);
  }
  return lesson;
}

export function getAuthoritativeLessonById(lessonId: string): ReadingLesson | null {
  const all = getAllAuthoritativeLessons();
  return all.find((l) => l.id === lessonId) || null;
}

export function getAllDiagnosticPassages(): ReadingLesson[] {
  return DIAGNOSTIC_PASSAGES.map(addLessonVocabulary);
}

export function getDiagnosticPassageById(passageId: string): ReadingLesson | null {
  const all = getAllDiagnosticPassages();
  return all.find((p) => p.id === passageId) || null;
}

export function getSanitizedDiagnosticPassageById(passageId: string): ReadingLesson | null {
  const found = getDiagnosticPassageById(passageId);
  return found ? sanitizeLessonForLearner(found) : null;
}

export function saveAuthoritativeAdminLesson(
  lesson: ReadingLesson,
  difficultyOverride?: number
): ReadingLesson {
  const enriched = addLessonVocabulary(lesson);
  serverCustomLessons.set(enriched.id, enriched);
  serverDeletedLessonIds.delete(enriched.id);
  if (typeof difficultyOverride === 'number' && Number.isFinite(difficultyOverride)) {
    serverDifficultyOverrides[enriched.id] = difficultyOverride;
  }
  return enriched;
}

export function deleteAuthoritativeAdminLesson(lessonId: string): void {
  serverCustomLessons.delete(lessonId);
  serverDeletedLessonIds.add(lessonId);
}

export function getServerDifficultyOverrides(): Record<string, number> {
  return { ...serverDifficultyOverrides };
}

export function getAuthoritativeLessonDifficulty(lesson: ReadingLesson): number {
  return getLessonDifficulty(lesson, serverDifficultyOverrides);
}

/**
 * Strips private answer keys, accepted variants, grading rubrics, explanations,
 * and passage evidence quotes before delivering lessons to learner clients prior to submission.
 */
export function sanitizeQuestionForLearner(question: ComprehensionQuestion): ComprehensionQuestion {
  return {
    id: question.id,
    type: question.type,
    prompt: question.prompt,
    instruction: question.instruction,
    maxWords: question.maxWords,
    options: question.options,
    wordBank: question.wordBank,
    allowPartialCredit: question.allowPartialCredit,
    difficulty: question.difficulty,
    // Protected fields withheld until after submission:
    correctAnswer: '',
    acceptedAnswers: [],
    rubric: undefined,
    explanation: '',
    passageEvidence: '',
  };
}

export function sanitizeLessonForLearner(lesson: ReadingLesson): ReadingLesson {
  return {
    ...lesson,
    questions: lesson.questions.map(sanitizeQuestionForLearner),
  };
}

/**
 * Curated public sample lessons (one representative passage per CEFR level A1–C1)
 * for indexable SEO sample pages without exposing the full unseen adaptive passage bank.
 */
export const PUBLIC_SAMPLE_LESSON_IDS: string[] = [
  'a1-sci-solar-lamps',
  'a2-sci-desalination-plants',
  'b1-sci-sodium-batteries',
  'b2-sci-bioluminescence-tech',
  'c1-01-neuromorphic-computing',
  'c2-01-quantum-decoherence-topological',
];

export function getPublicSampleLessons(): ReadingLesson[] {
  const all = getAllAuthoritativeLessons().filter((l) => l.status === 'published' && !l.isDiagnostic);
  const picked: ReadingLesson[] = [];
  const levels: Array<'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'> = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  for (const level of levels) {
    const byPreferredId = all.find(
      (l) => l.level === level && PUBLIC_SAMPLE_LESSON_IDS.includes(l.id)
    );
    const fallback = all.find((l) => l.level === level);
    const chosen = byPreferredId || fallback;
    if (chosen) {
      picked.push(sanitizeLessonForLearner(chosen));
    }
  }
  return picked;
}
