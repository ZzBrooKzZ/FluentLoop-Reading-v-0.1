import { CEFRLevel, ReadingLesson } from '../types/reading';
import { BATCH_A1_LESSONS } from './batches/batchA1';
import { BATCH_A1_EXPANSION_LESSONS } from './batches/batchA1Expansion';
import { BATCH_A2_LESSONS } from './batches/batchA2';
import { BATCH_A2_EXPANSION_LESSONS } from './batches/batchA2Expansion';
import { BATCH_B1_LESSONS } from './batches/batchB1';
import { BATCH_B1_EXPANSION_LESSONS } from './batches/batchB1Expansion';
import { BATCH_B2_LESSONS } from './batches/batchB2';
import { BATCH_B2_EXPANSION_LESSONS } from './batches/batchB2Expansion';
import { BATCH_C1_LESSONS } from './batches/batchC1';
import { BATCH_C1_EXPANSION_LESSONS } from './batches/batchC1Expansion';
import { BATCH_C2_LESSONS } from './batches/batchC2';
import { upgradeLessonToIeltsAcademic } from './ieltsAcademicUpgrade';
import { addLessonVocabulary } from './vocabularyExpansion';

const UPGRADED_A1 = [...BATCH_A1_LESSONS, ...BATCH_A1_EXPANSION_LESSONS].map((lesson) =>
  addLessonVocabulary(upgradeLessonToIeltsAcademic(lesson))
);
const UPGRADED_A2 = [...BATCH_A2_LESSONS, ...BATCH_A2_EXPANSION_LESSONS].map((lesson) =>
  addLessonVocabulary(upgradeLessonToIeltsAcademic(lesson))
);
const UPGRADED_B1 = [...BATCH_B1_LESSONS, ...BATCH_B1_EXPANSION_LESSONS].map((lesson) =>
  addLessonVocabulary(upgradeLessonToIeltsAcademic(lesson))
);
const UPGRADED_B2 = [...BATCH_B2_LESSONS, ...BATCH_B2_EXPANSION_LESSONS].map((lesson) =>
  addLessonVocabulary(upgradeLessonToIeltsAcademic(lesson))
);
const UPGRADED_C1 = [...BATCH_C1_LESSONS, ...BATCH_C1_EXPANSION_LESSONS].map((lesson) =>
  addLessonVocabulary(upgradeLessonToIeltsAcademic(lesson))
);
const UPGRADED_C2 = BATCH_C2_LESSONS.map((lesson) =>
  addLessonVocabulary(upgradeLessonToIeltsAcademic(lesson))
);

export const LESSON_BATCHES: Record<CEFRLevel, ReadingLesson[]> = {
  A1: UPGRADED_A1,
  A2: UPGRADED_A2,
  B1: UPGRADED_B1,
  B2: UPGRADED_B2,
  C1: UPGRADED_C1,
  C2: UPGRADED_C2,
};

export const INITIAL_LESSONS: ReadingLesson[] = [
  ...UPGRADED_A1,
  ...UPGRADED_A2,
  ...UPGRADED_B1,
  ...UPGRADED_B2,
  ...UPGRADED_C1,
  ...UPGRADED_C2,
];

