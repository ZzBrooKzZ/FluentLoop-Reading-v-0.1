import { CEFRLevel, ReadingLesson } from '../types/reading';
import { BATCH_A1_LESSONS } from './batches/batchA1';
import { BATCH_A2_LESSONS } from './batches/batchA2';
import { BATCH_B1_LESSONS } from './batches/batchB1';
import { BATCH_B2_LESSONS } from './batches/batchB2';
import { BATCH_C1_LESSONS } from './batches/batchC1';
import { upgradeLessonToIeltsAcademic } from './ieltsAcademicUpgrade';
import { addLessonVocabulary } from './vocabularyExpansion';

const UPGRADED_A1 = BATCH_A1_LESSONS.map((lesson) => addLessonVocabulary(upgradeLessonToIeltsAcademic(lesson)));
const UPGRADED_A2 = BATCH_A2_LESSONS.map((lesson) => addLessonVocabulary(upgradeLessonToIeltsAcademic(lesson)));
const UPGRADED_B1 = BATCH_B1_LESSONS.map((lesson) => addLessonVocabulary(upgradeLessonToIeltsAcademic(lesson)));
const UPGRADED_B2 = BATCH_B2_LESSONS.map((lesson) => addLessonVocabulary(upgradeLessonToIeltsAcademic(lesson)));
const UPGRADED_C1 = BATCH_C1_LESSONS.map((lesson) => addLessonVocabulary(upgradeLessonToIeltsAcademic(lesson)));

export const LESSON_BATCHES: Record<CEFRLevel, ReadingLesson[]> = {
  A1: UPGRADED_A1,
  A2: UPGRADED_A2,
  B1: UPGRADED_B1,
  B2: UPGRADED_B2,
  C1: UPGRADED_C1,
};

export const INITIAL_LESSONS: ReadingLesson[] = [
  ...UPGRADED_A1,
  ...UPGRADED_A2,
  ...UPGRADED_B1,
  ...UPGRADED_B2,
  ...UPGRADED_C1,
];
