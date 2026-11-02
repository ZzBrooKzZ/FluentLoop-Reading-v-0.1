import { Timestamp } from 'firebase-admin/firestore';
import { INITIAL_LESSONS } from '../data/initialLessons';
import { DIAGNOSTIC_PASSAGES } from '../data/diagnosticPassages';
import { addLessonVocabulary } from '../data/vocabularyExpansion';
import { CEFR_TARGET_WORD_RANGES, upgradeLessonToIeltsAcademic } from '../data/ieltsAcademicUpgrade';
import { ComprehensionQuestion, ReadingLesson } from '../types/reading';
import { getLessonDifficulty } from '../services/adaptiveLearning';
import { isAllowedPlacementLevel } from '../services/placementEngine';
import { getServerFirestore } from './firebaseAdmin';

export const AUTHORITATIVE_LESSONS_COLLECTION = 'authoritative_lessons';
export const MAX_AUTHORITATIVE_LESSON_DOC_BYTES = 180 * 1024; // 180 KiB cap
export const MAX_PASSAGE_CHARS = 25_000;
export const MAX_QUESTIONS_PER_LESSON = 20;
export const MAX_VOCAB_ITEMS_PER_LESSON = 60;

export interface FirestoreAuthoritativeLessonDoc {
  id: string;
  isDeleted?: boolean;
  deletedAt?: string;
  deletedByUid?: string;
  difficultyOverride?: number;
  lessonJson?: string;
  status?: 'draft' | 'published' | 'archived';
  updatedAt?: string;
  updatedByUid?: string;
  updatedAtTimestamp?: unknown;
}

// Local in-memory cache (synchronized from Firestore on persistent reads/writes)
const serverCustomLessons = new Map<string, ReadingLesson>();
const serverDeletedLessonIds = new Set<string>();
const serverDifficultyOverrides: Record<string, number> = {};

// Optional test store for deterministic multi-instance unit tests
let testLessonFirestoreMap: Map<string, FirestoreAuthoritativeLessonDoc> | null = null;

export function setTestLessonFirestoreStoreForTests(
  store:
    | Map<string, FirestoreAuthoritativeLessonDoc>
    | { lessons: Map<string, Record<string, unknown>> }
    | null
): void {
  if (!store) {
    testLessonFirestoreMap = null;
    return;
  }
  if (store instanceof Map) {
    testLessonFirestoreMap = store;
  } else {
    testLessonFirestoreMap = store.lessons as unknown as Map<
      string,
      FirestoreAuthoritativeLessonDoc
    >;
  }
}

export function clearLocalLessonMemoryCacheForInstanceSwitchTests(): void {
  serverCustomLessons.clear();
  serverDeletedLessonIds.clear();
  for (const k of Object.keys(serverDifficultyOverrides)) {
    delete serverDifficultyOverrides[k];
  }
}

function getBuiltInLessonsMap(): Map<string, ReadingLesson> {
  const initialById = new Map<string, ReadingLesson>();
  for (const lesson of INITIAL_LESSONS) {
    const upgraded = upgradeLessonIfNeeded(lesson, lesson);
    initialById.set(lesson.id, upgraded);
  }
  return initialById;
}

export function getAllAuthoritativeLessons(): ReadingLesson[] {
  const map = new Map<string, ReadingLesson>();
  const initialById = getBuiltInLessonsMap();

  for (const [id, upgraded] of initialById.entries()) {
    if (!serverDeletedLessonIds.has(id)) {
      map.set(id, upgraded);
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
    lesson.title === builtIn.title &&
    lesson.status === builtIn.status &&
    ((targetRange && wc < targetRange.min) ||
      (lesson.vocabulary?.length || 0) < builtIn.vocabulary.length)
  ) {
    return builtIn;
  }
  if (builtIn && targetRange && wc < targetRange.min) {
    return upgradeLessonToIeltsAcademic(lesson);
  }
  return lesson;
}

export function getAuthoritativeLessonById(lessonId: string): ReadingLesson | null {
  const all = getAllAuthoritativeLessons();
  return all.find((l) => l.id === lessonId) || null;
}

function applyAuthoritativeDocToMemory(docData: FirestoreAuthoritativeLessonDoc): void {
  if (!docData || typeof docData.id !== 'string' || !docData.id.trim()) return;
  const id = docData.id.trim();
  if (docData.isDeleted) {
    serverCustomLessons.delete(id);
    serverDeletedLessonIds.add(id);
    delete serverDifficultyOverrides[id];
    return;
  }

  serverDeletedLessonIds.delete(id);
  if (
    typeof docData.difficultyOverride === 'number' &&
    Number.isFinite(docData.difficultyOverride)
  ) {
    serverDifficultyOverrides[id] = docData.difficultyOverride;
  }

  if (typeof docData.lessonJson === 'string' && docData.lessonJson.trim()) {
    try {
      const parsed = JSON.parse(docData.lessonJson) as ReadingLesson;
      if (parsed && typeof parsed.id === 'string') {
        serverCustomLessons.set(id, addLessonVocabulary(parsed));
      }
    } catch {
      // Ignore malformed stored JSON
    }
  }
}

async function hydrateAllAuthoritativeDocsFromStore(): Promise<void> {
  if (testLessonFirestoreMap) {
    for (const docData of testLessonFirestoreMap.values()) {
      applyAuthoritativeDocToMemory(docData);
    }
    return;
  }

  const db = getServerFirestore();
  if (!db) return;

  try {
    const snap = await db.collection(AUTHORITATIVE_LESSONS_COLLECTION).get();
    snap.forEach((docSnap) => {
      const data = docSnap.data() as FirestoreAuthoritativeLessonDoc;
      if (data) {
        applyAuthoritativeDocToMemory({ ...data, id: data.id || docSnap.id });
      }
    });
  } catch {
    // Non-fatal fallback to in-memory catalog if Firestore is unreachable in local dev
  }
}

async function hydrateSingleAuthoritativeDocFromStore(lessonId: string): Promise<void> {
  const cleanId = lessonId.trim();
  if (!cleanId) return;

  if (testLessonFirestoreMap) {
    const docData = testLessonFirestoreMap.get(cleanId);
    if (docData) {
      applyAuthoritativeDocToMemory(docData);
    }
    return;
  }

  const db = getServerFirestore();
  if (!db) return;

  try {
    const snap = await db.collection(AUTHORITATIVE_LESSONS_COLLECTION).doc(cleanId).get();
    if (snap.exists) {
      const data = snap.data() as FirestoreAuthoritativeLessonDoc;
      if (data) {
        applyAuthoritativeDocToMemory({ ...data, id: data.id || snap.id });
      }
    }
  } catch {
    // Non-fatal fallback
  }
}

export async function getAllAuthoritativeLessonsPersistent(): Promise<ReadingLesson[]> {
  await hydrateAllAuthoritativeDocsFromStore();
  return getAllAuthoritativeLessons();
}

export async function getAuthoritativeLessonByIdPersistent(
  lessonId: string
): Promise<ReadingLesson | null> {
  const cleanId = lessonId?.trim();
  if (!cleanId) return null;
  await hydrateSingleAuthoritativeDocFromStore(cleanId);
  if (serverDeletedLessonIds.has(cleanId)) {
    return null;
  }
  return getAuthoritativeLessonById(cleanId);
}

export function validateAuthoritativeAdminLessonPayload(
  lesson: ReadingLesson
): { valid: true; error?: string } | { valid: false; error: string } {
  if (!lesson || typeof lesson !== 'object') {
    return { valid: false, error: 'Lesson payload must be an object.' };
  }
  if (typeof lesson.id !== 'string' || !/^[a-zA-Z0-9_-]{2,128}$/.test(lesson.id.trim())) {
    return {
      valid: false,
      error: 'Lesson ID must be 2–128 alphanumeric, hyphen, or underscore characters.',
    };
  }
  if (typeof lesson.title !== 'string' || !lesson.title.trim() || lesson.title.length > 300) {
    return { valid: false, error: 'Lesson title is required (max 300 chars).' };
  }
  if (
    typeof lesson.passage !== 'string' ||
    !lesson.passage.trim() ||
    lesson.passage.length > MAX_PASSAGE_CHARS
  ) {
    return {
      valid: false,
      error: `Lesson passage is required (max ${MAX_PASSAGE_CHARS} characters).`,
    };
  }
  if (
    !Array.isArray(lesson.questions) ||
    lesson.questions.length === 0 ||
    lesson.questions.length > MAX_QUESTIONS_PER_LESSON
  ) {
    return {
      valid: false,
      error: `Lesson must include between 1 and ${MAX_QUESTIONS_PER_LESSON} questions.`,
    };
  }
  if (Array.isArray(lesson.vocabulary) && lesson.vocabulary.length > MAX_VOCAB_ITEMS_PER_LESSON) {
    return {
      valid: false,
      error: `Lesson cannot exceed ${MAX_VOCAB_ITEMS_PER_LESSON} vocabulary annotations.`,
    };
  }
  const serialized = JSON.stringify(lesson);
  if (Buffer.byteLength(serialized, 'utf8') > MAX_AUTHORITATIVE_LESSON_DOC_BYTES) {
    return {
      valid: false,
      error: 'Serialized lesson exceeds maximum allowed document size (180 KiB).',
    };
  }
  return { valid: true };
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

export async function saveAuthoritativeAdminLessonPersistent(
  lesson: ReadingLesson,
  difficultyOverride?: number,
  adminUid = 'admin'
): Promise<ReadingLesson> {
  const validation = validateAuthoritativeAdminLessonPayload(lesson);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const enriched = saveAuthoritativeAdminLesson(lesson, difficultyOverride);
  const nowIso = new Date().toISOString();
  const docPayload: FirestoreAuthoritativeLessonDoc = {
    id: enriched.id,
    isDeleted: false,
    status: enriched.status,
    lessonJson: JSON.stringify(enriched),
    ...(typeof difficultyOverride === 'number' && Number.isFinite(difficultyOverride)
      ? { difficultyOverride }
      : typeof serverDifficultyOverrides[enriched.id] === 'number'
      ? { difficultyOverride: serverDifficultyOverrides[enriched.id] }
      : {}),
    updatedAt: nowIso,
    updatedByUid: adminUid,
  };

  if (testLessonFirestoreMap) {
    testLessonFirestoreMap.set(enriched.id, docPayload);
    return enriched;
  }

  const db = getServerFirestore();
  if (db) {
    try {
      await db
        .collection(AUTHORITATIVE_LESSONS_COLLECTION)
        .doc(enriched.id)
        .set({
          ...docPayload,
          updatedAtTimestamp: Timestamp.now(),
        });
    } catch (err) {
      console.warn('[lessonRepository] Firestore save warning:', err);
    }
  }

  return enriched;
}

export function deleteAuthoritativeAdminLesson(lessonId: string): void {
  serverCustomLessons.delete(lessonId);
  serverDeletedLessonIds.add(lessonId);
  delete serverDifficultyOverrides[lessonId];
}

export async function deleteAuthoritativeAdminLessonPersistent(
  lessonId: string,
  adminUid = 'admin'
): Promise<void> {
  const cleanId = lessonId.trim();
  if (!cleanId) return;

  deleteAuthoritativeAdminLesson(cleanId);
  const nowIso = new Date().toISOString();
  const tombstoneDoc: FirestoreAuthoritativeLessonDoc = {
    id: cleanId,
    isDeleted: true,
    deletedAt: nowIso,
    deletedByUid: adminUid,
    updatedAt: nowIso,
    updatedByUid: adminUid,
  };

  if (testLessonFirestoreMap) {
    testLessonFirestoreMap.set(cleanId, tombstoneDoc);
    return;
  }

  const db = getServerFirestore();
  if (db) {
    try {
      await db
        .collection(AUTHORITATIVE_LESSONS_COLLECTION)
        .doc(cleanId)
        .set({
          ...tombstoneDoc,
          updatedAtTimestamp: Timestamp.now(),
        });
    } catch (err) {
      console.warn('[lessonRepository] Firestore delete tombstone warning:', err);
    }
  }
}

export function getAllDiagnosticPassages(): ReadingLesson[] {
  return DIAGNOSTIC_PASSAGES.map(addLessonVocabulary);
}

/**
 * Returns only diagnostic passages eligible for initial placement (CEFR A1–C1).
 * C2 diagnostic passages are strictly excluded from initial placement.
 */
export function getPlacementDiagnosticPassages(): ReadingLesson[] {
  return getAllDiagnosticPassages().filter((p) => isAllowedPlacementLevel(p.level));
}

export function getDiagnosticPassageById(passageId: string): ReadingLesson | null {
  const all = getAllDiagnosticPassages();
  return all.find((p) => p.id === passageId) || null;
}

export function getPlacementDiagnosticPassageById(passageId: string): ReadingLesson | null {
  const allowed = getPlacementDiagnosticPassages();
  return allowed.find((p) => p.id === passageId) || null;
}

export function getSanitizedDiagnosticPassageById(passageId: string): ReadingLesson | null {
  const found = getPlacementDiagnosticPassageById(passageId);
  return found ? sanitizeLessonForLearner(found) : null;
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
 * Curated public sample lessons (one representative passage per CEFR level A1–C2)
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
