import { ComprehensionQuestion, QuestionType, ReadingLesson } from '../types/reading';
import { normalizeAnswer } from './gradingService';

export const OPTION_ORDERS_STORAGE_KEY = 'fluentloop_option_orders_v1';
export const IN_PROGRESS_ANSWERS_STORAGE_KEY = 'fluentloop_in_progress_answers_v1';

/**
 * Represents a single option with its original canonical identity preserved
 * alongside its randomized display position.
 */
export interface RandomizedOptionItem {
  /** Stable option identifier tied to the original option index: `${questionId}__opt_${originalIndex}` */
  id: string;
  /** Canonical answer value used for selection state, serialization, and grading (exact original string) */
  value: string;
  /** Display text rendered in the UI (kept identical to `value` so option wording is never altered) */
  label: string;
  /** 0-based index in the original `question.options` array */
  originalIndex: number;
  /** 0-based index in the randomized display order */
  displayIndex: number;
}

/**
 * Per-attempt map from `questionId` to an array of `originalIndex` integers
 * representing the displayed order of options for that question.
 */
export type QuestionOptionOrderMap = Record<string, number[]>;

const MAX_STORED_ATTEMPT_ORDERS = 200;

// In-memory store backing localStorage so option orders stay stable across re-renders
// and in non-browser test environments.
const memoryOptionOrderStore = new Map<string, QuestionOptionOrderMap>();
const memoryInProgressAnswersStore = new Map<string, Record<string, string>>();

/**
 * Creates a deterministic, uniform 32-bit PRNG (`xmur3` seed hash + `sfc32` state machine)
 * from any string or numeric seed. Useful for deterministic testing and reproducible
 * fallback orders when reviewing historical attempts.
 */
export function createSeededRng(seed: string | number): () => number {
  const seedStr = String(seed);
  let h = 1779033703 ^ seedStr.length;
  const nextSeedWord = (): number => {
    for (let i = 0; i < seedStr.length; i++) {
      h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };

  let a = nextSeedWord();
  let b = nextSeedWord();
  let c = nextSeedWord();
  let d = nextSeedWord();

  return (): number => {
    a >>>= 0;
    b >>>= 0;
    c >>>= 0;
    d >>>= 0;
    let t = (a + b) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    d = (d + 1) | 0;
    t = (t + d) | 0;
    c = (c + t) | 0;
    return (t >>> 0) / 4294967296;
  };
}

/**
 * Unbiased Fisher–Yates (Knuth) shuffle.
 * Returns a new shuffled array without mutating the input array.
 */
export function fisherYatesShuffle<T>(
  items: readonly T[],
  rng: () => number = Math.random
): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const raw = rng();
    const bounded = Number.isFinite(raw) ? Math.max(0, Math.min(0.999999999999, raw)) : 0;
    const j = Math.floor(bounded * (i + 1));
    const tmp = result[i];
    result[i] = result[j];
    result[j] = tmp;
  }
  return result;
}

/**
 * Determines whether a question's options should be randomized.
 * - Randomizes multiple-choice and substantive option-selection questions:
 *   `multiple_choice`, `vocabulary_in_context`, `multiple_choice_two`,
 *   `matching_headings`, `matching_sentence_endings`, `matching_features`.
 * - Preserves fixed sequential scales:
 *   `true_false_not_given` (`True`, `False`, `Not Given`),
 *   `yes_no_not_given` (`Yes`, `No`, `Not Given`), and
 *   `matching_information` when options are sequential paragraph labels (`Paragraph 1`, `Paragraph 2`, ...).
 */
export function shouldRandomizeQuestionOptions(question: ComprehensionQuestion): boolean {
  if (!Array.isArray(question.options) || question.options.length < 2) {
    return false;
  }
  if (
    question.type === 'true_false_not_given' ||
    question.type === 'yes_no_not_given'
  ) {
    return false;
  }
  if (question.type === 'matching_information') {
    const allSequentialParagraphLabels = question.options.every((opt) =>
      /^Paragraph\s+(\d+|[A-Z])$/i.test(opt.trim())
    );
    if (allSequentialParagraphLabels) {
      return false;
    }
  }
  return true;
}

/**
 * Validates that `permutation` is a complete, duplicate-free permutation of `0 .. length - 1`.
 */
export function isValidIndexPermutation(
  permutation: unknown,
  expectedLength: number
): permutation is number[] {
  if (!Array.isArray(permutation) || permutation.length !== expectedLength) {
    return false;
  }
  const seen = new Set<number>();
  for (const idx of permutation) {
    if (
      typeof idx !== 'number' ||
      !Number.isInteger(idx) ||
      idx < 0 ||
      idx >= expectedLength ||
      seen.has(idx)
    ) {
      return false;
    }
    seen.add(idx);
  }
  return seen.size === expectedLength;
}

function hydrateOptionOrdersFromLocalStorage(): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = window.localStorage.getItem(OPTION_ORDERS_STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      for (const [attemptKey, orderMap] of Object.entries(parsed)) {
        if (orderMap && typeof orderMap === 'object' && !memoryOptionOrderStore.has(attemptKey)) {
          memoryOptionOrderStore.set(attemptKey, orderMap as QuestionOptionOrderMap);
        }
      }
    }
  } catch {
    // Ignore storage read errors
  }
}

function persistOptionOrdersToLocalStorage(): void {
  if (typeof window === 'undefined') return;
  try {
    const entries = Array.from(memoryOptionOrderStore.entries()).slice(-MAX_STORED_ATTEMPT_ORDERS);
    const serialized: Record<string, QuestionOptionOrderMap> = {};
    for (const [k, v] of entries) {
      serialized[k] = v;
    }
    window.localStorage.setItem(OPTION_ORDERS_STORAGE_KEY, JSON.stringify(serialized));
  } catch {
    // Ignore storage quota errors
  }
}

/**
 * Generates an unbiased index permutation `[0 .. length - 1]` for a single question.
 */
export function createOptionPermutation(
  optionCount: number,
  shouldShuffle: boolean,
  rng: () => number = Math.random
): number[] {
  const identity = Array.from({ length: optionCount }, (_, i) => i);
  if (!shouldShuffle || optionCount < 2) {
    return identity;
  }
  return fisherYatesShuffle(identity, rng);
}

/**
 * Retrieves or generates the option-index permutations for all questions in a given attempt.
 * Once generated for `attemptKey`, the order is stored in memory and `localStorage` so:
 * - React re-renders never reshuffle options while the learner is answering.
 * - Refreshing or resuming an `in_progress` attempt restores the exact saved option order.
 * - Starting a new "Practice Again" attempt with a fresh `attemptKey` produces a new shuffle.
 */
export function getOrCreateAttemptOptionOrders(
  attemptKey: string,
  questions: readonly ComprehensionQuestion[],
  rng: () => number = Math.random
): QuestionOptionOrderMap {
  const normalizedKey = (attemptKey || 'default-attempt').trim() || 'default-attempt';
  hydrateOptionOrdersFromLocalStorage();

  const existingMap = memoryOptionOrderStore.get(normalizedKey);
  const nextMap: QuestionOptionOrderMap = existingMap ? { ...existingMap } : {};
  let mutated = !existingMap;

  for (const q of questions) {
    const optionCount = Array.isArray(q.options) ? q.options.length : 0;
    if (optionCount === 0) continue;

    const currentPerm = nextMap[q.id];
    if (!isValidIndexPermutation(currentPerm, optionCount)) {
      const shouldShuffle = shouldRandomizeQuestionOptions(q);
      nextMap[q.id] = createOptionPermutation(optionCount, shouldShuffle, rng);
      mutated = true;
    }
  }

  if (mutated) {
    memoryOptionOrderStore.set(normalizedKey, nextMap);
    persistOptionOrdersToLocalStorage();
  }

  return nextMap;
}

/**
 * Builds the ordered list of `RandomizedOptionItem` objects for a question within an attempt.
 * Never mutates `question` or `question.options`.
 */
export function getRandomizedOptionsForQuestion(
  question: ComprehensionQuestion,
  attemptKey: string,
  rng: () => number = Math.random
): RandomizedOptionItem[] {
  if (!Array.isArray(question.options) || question.options.length === 0) {
    if (question.type === 'true_false_not_given') {
      return ['True', 'False', 'Not Given'].map((opt, idx) => ({
        id: `${question.id}__opt_${idx}`,
        value: opt,
        label: opt,
        originalIndex: idx,
        displayIndex: idx,
      }));
    }
    if (question.type === 'yes_no_not_given') {
      return ['Yes', 'No', 'Not Given'].map((opt, idx) => ({
        id: `${question.id}__opt_${idx}`,
        value: opt,
        label: opt,
        originalIndex: idx,
        displayIndex: idx,
      }));
    }
    return [];
  }

  const orderMap = getOrCreateAttemptOptionOrders(attemptKey, [question], rng);
  const perm = isValidIndexPermutation(orderMap[question.id], question.options.length)
    ? orderMap[question.id]
    : Array.from({ length: question.options.length }, (_, i) => i);

  return perm.map((originalIndex, displayIndex) => {
    const originalText = question.options![originalIndex];
    return {
      id: `${question.id}__opt_${originalIndex}`,
      value: originalText,
      label: originalText,
      originalIndex,
      displayIndex,
    };
  });
}

/**
 * Returns a new array of `ComprehensionQuestion` view objects with their `options`
 * ordered according to the saved permutation for `attemptKey`.
 * Does NOT mutate the input `questions` array or any individual `ComprehensionQuestion`.
 */
export function getRandomizedQuestionsForAttempt(
  questions: readonly ComprehensionQuestion[],
  attemptKey: string,
  rng: () => number = Math.random
): ComprehensionQuestion[] {
  const orderMap = getOrCreateAttemptOptionOrders(attemptKey, questions, rng);
  return questions.map((q) => {
    if (!Array.isArray(q.options) || q.options.length === 0) {
      return { ...q };
    }
    const perm = isValidIndexPermutation(orderMap[q.id], q.options.length)
      ? orderMap[q.id]
      : Array.from({ length: q.options.length }, (_, i) => i);
    const shuffledOptions = perm.map((origIdx) => q.options![origIdx]);
    return {
      ...q,
      options: shuffledOptions,
    };
  });
}

/**
 * Resolves a selected option string or option ID (`${questionId}__opt_${originalIndex}`)
 * back to the canonical option string from `question.options`, ensuring grading always
 * evaluates against canonical answer identity rather than displayed position.
 */
export function resolveCanonicalOptionAnswer(
  question: ComprehensionQuestion,
  rawSelection: string
): string {
  const trimmed = (rawSelection || '').trim();
  if (!trimmed) return '';

  const prefix = `${question.id}__opt_`;
  if (trimmed.startsWith(prefix) && Array.isArray(question.options)) {
    const idx = Number.parseInt(trimmed.slice(prefix.length), 10);
    if (Number.isInteger(idx) && idx >= 0 && idx < question.options.length) {
      return question.options[idx];
    }
  }

  return trimmed;
}

/**
 * Checks whether a displayed option matches the question's verified correct answer(s),
 * independent of where the option appears in the shuffled display list.
 */
export function isOptionCorrectForQuestion(
  question: ComprehensionQuestion,
  optionValue: string,
  resolvedCorrectAnswer?: string
): boolean {
  const normOption = normalizeAnswer(resolveCanonicalOptionAnswer(question, optionValue));
  if (!normOption) return false;

  if (question.type === 'multiple_choice_two') {
    const rawExpectedList =
      Array.isArray(question.correctAnswers) && question.correctAnswers.length >= 2
        ? question.correctAnswers
        : (resolvedCorrectAnswer || question.correctAnswer || '')
            .split(/\s*\|\s*|\s+AND\s+/i)
            .filter(Boolean);
    return rawExpectedList.some((exp) => normalizeAnswer(exp) === normOption);
  }

  const target = normalizeAnswer(resolvedCorrectAnswer || question.correctAnswer || '');
  if (target && normOption === target) {
    return true;
  }

  if (Array.isArray(question.acceptedAnswers) && question.acceptedAnswers.length > 0) {
    return question.acceptedAnswers.some((acc) => normalizeAnswer(acc) === normOption);
  }

  return false;
}

/**
 * Saves in-progress draft answers for an active attempt key so refreshing mid-attempt
 * preserves both the randomized option order and any answers already selected.
 */
export function saveInProgressAttemptAnswers(
  attemptKey: string,
  answers: Record<string, string>
): void {
  const key = (attemptKey || '').trim();
  if (!key) return;
  memoryInProgressAnswersStore.set(key, { ...answers });
  if (typeof window === 'undefined') return;
  try {
    const raw = window.localStorage.getItem(IN_PROGRESS_ANSWERS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    const next = parsed && typeof parsed === 'object' ? parsed : {};
    next[key] = { ...answers };
    const keys = Object.keys(next);
    if (keys.length > 100) {
      delete next[keys[0]];
    }
    window.localStorage.setItem(IN_PROGRESS_ANSWERS_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Ignore storage errors
  }
}

/**
 * Loads saved in-progress draft answers for an active attempt key.
 */
export function loadInProgressAttemptAnswers(
  attemptKey: string
): Record<string, string> | undefined {
  const key = (attemptKey || '').trim();
  if (!key) return undefined;
  if (memoryInProgressAnswersStore.has(key)) {
    return { ...memoryInProgressAnswersStore.get(key)! };
  }
  if (typeof window === 'undefined') return undefined;
  try {
    const raw = window.localStorage.getItem(IN_PROGRESS_ANSWERS_STORAGE_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && parsed[key] && typeof parsed[key] === 'object') {
      memoryInProgressAnswersStore.set(key, parsed[key]);
      return { ...parsed[key] };
    }
  } catch {
    // Ignore storage errors
  }
  return undefined;
}

export function clearInProgressAttemptAnswers(attemptKey: string): void {
  const key = (attemptKey || '').trim();
  if (!key) return;
  memoryInProgressAnswersStore.delete(key);
  if (typeof window === 'undefined') return;
  try {
    const raw = window.localStorage.getItem(IN_PROGRESS_ANSWERS_STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && key in parsed) {
      delete parsed[key];
      window.localStorage.setItem(IN_PROGRESS_ANSWERS_STORAGE_KEY, JSON.stringify(parsed));
    }
  } catch {
    // Ignore storage errors
  }
}

/**
 * Clears cached option orders for a specific attempt (or all attempts if no key is provided).
 */
export function clearAttemptOptionOrders(attemptKey?: string): void {
  if (attemptKey) {
    memoryOptionOrderStore.delete(attemptKey.trim());
    persistOptionOrdersToLocalStorage();
    return;
  }
  memoryOptionOrderStore.clear();
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.removeItem(OPTION_ORDERS_STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  }
}

/**
 * Purges all cached in-progress placement answers and placement option orders
 * (or those matching a specific placement `sessionId`) from memory and `localStorage`
 * while leaving regular reading lesson attempts (`att-*`, `inprog-*`) untouched.
 */
export function clearAllPlacementInProgressAnswers(sessionId?: string): void {
  const targetSession = sessionId?.trim();
  const matchesPlacementKey = (key: string) => {
    if (!key.startsWith('placement-')) return false;
    if (!targetSession) return true;
    return key.includes(targetSession);
  };

  for (const key of Array.from(memoryInProgressAnswersStore.keys())) {
    if (matchesPlacementKey(key)) {
      memoryInProgressAnswersStore.delete(key);
    }
  }

  for (const key of Array.from(memoryOptionOrderStore.keys())) {
    if (matchesPlacementKey(key)) {
      memoryOptionOrderStore.delete(key);
    }
  }

  if (typeof window === 'undefined') return;
  try {
    const rawAnswers = window.localStorage.getItem(IN_PROGRESS_ANSWERS_STORAGE_KEY);
    if (rawAnswers) {
      const parsed = JSON.parse(rawAnswers);
      if (parsed && typeof parsed === 'object') {
        let changed = false;
        for (const k of Object.keys(parsed)) {
          if (matchesPlacementKey(k)) {
            delete parsed[k];
            changed = true;
          }
        }
        if (changed) {
          window.localStorage.setItem(IN_PROGRESS_ANSWERS_STORAGE_KEY, JSON.stringify(parsed));
        }
      }
    }
  } catch {
    // Ignore storage errors
  }

  persistOptionOrdersToLocalStorage();
}

/**
 * Exports a snapshot of all saved option orders (and restores from a snapshot) so
 * tests can simulate a browser refresh even in environments without `window.localStorage`.
 */
export function exportOptionOrderSnapshot(): string {
  const obj: Record<string, QuestionOptionOrderMap> = {};
  for (const [k, v] of memoryOptionOrderStore.entries()) {
    obj[k] = v;
  }
  return JSON.stringify(obj);
}

export function restoreOptionOrderSnapshotAfterRefresh(serializedSnapshot: string): void {
  memoryOptionOrderStore.clear();
  const parsed = JSON.parse(serializedSnapshot);
  if (parsed && typeof parsed === 'object') {
    for (const [k, v] of Object.entries(parsed)) {
      memoryOptionOrderStore.set(k, v as QuestionOptionOrderMap);
    }
  }
}

export interface PositionCountDistribution {
  total: number;
  byPosition: Record<number, number>; // 1-based positions (1, 2, 3, 4, ...)
  percentagesByPosition: Record<number, number>;
}

export interface QuestionBankBiasAuditReport {
  lessonCount: number;
  totalQuestions: number;
  countsByQuestionType: Record<string, number>;
  /** Raw stored position distribution for `multiple_choice` questions */
  rawMultipleChoicePositions: PositionCountDistribution;
  /** Raw stored position distribution for `vocabulary_in_context` (4-option MC) questions */
  rawVocabularyInContextPositions: PositionCountDistribution;
  /** Raw stored position distribution across all single-answer shufflable MC/matching types */
  rawAllShufflableSingleChoicePositions: PositionCountDistribution;
  /** Post-shuffle position distribution for `multiple_choice` questions */
  shuffledMultipleChoicePositions: PositionCountDistribution;
  /** Post-shuffle position distribution across all single-answer shufflable MC/matching types */
  shuffledAllSingleChoicePositions: PositionCountDistribution;
  /** True / False / Not Given label distribution */
  trueFalseNotGivenDistribution: {
    total: number;
    counts: { True: number; False: number; 'Not Given': number; Other: number };
    percentages: { True: number; False: number; 'Not Given': number; Other: number };
  };
  /** Yes / No / Not Given label distribution */
  yesNoNotGivenDistribution: {
    total: number;
    counts: { Yes: number; No: number; 'Not Given': number; Other: number };
    percentages: { Yes: number; No: number; 'Not Given': number; Other: number };
  };
}

function finalizePositionDistribution(
  counts: Record<number, number>,
  total: number,
  maxPos = 4
): PositionCountDistribution {
  const byPosition: Record<number, number> = {};
  const percentagesByPosition: Record<number, number> = {};
  for (let pos = 1; pos <= maxPos; pos++) {
    const c = counts[pos] || 0;
    byPosition[pos] = c;
    percentagesByPosition[pos] = total > 0 ? Number(((c / total) * 100).toFixed(2)) : 0;
  }
  for (const [k, c] of Object.entries(counts)) {
    const pos = Number(k);
    if (pos > maxPos) {
      byPosition[pos] = c;
      percentagesByPosition[pos] = total > 0 ? Number(((c / total) * 100).toFixed(2)) : 0;
    }
  }
  return { total, byPosition, percentagesByPosition };
}

/**
 * Audits the correct-answer position distribution (before and after option randomization)
 * and the True/False/Not Given label distribution across a list of lessons.
 */
export function auditQuestionBankDistributions(
  lessons: readonly ReadingLesson[],
  options?: {
    shuffleTrials?: number;
    seed?: string;
  }
): QuestionBankBiasAuditReport {
  const trials = Math.max(1, options?.shuffleTrials ?? 20);
  const rng = createSeededRng(options?.seed ?? 'fluentloop-audit-seed-2026');

  const countsByQuestionType: Record<string, number> = {};
  const rawMcCounts: Record<number, number> = {};
  let rawMcTotal = 0;

  const rawVicCounts: Record<number, number> = {};
  let rawVicTotal = 0;

  const rawAllSingleCounts: Record<number, number> = {};
  let rawAllSingleTotal = 0;

  const shuffledMcCounts: Record<number, number> = {};
  let shuffledMcTotal = 0;

  const shuffledAllSingleCounts: Record<number, number> = {};
  let shuffledAllSingleTotal = 0;

  const tfngCounts = { True: 0, False: 0, 'Not Given': 0, Other: 0 };
  let tfngTotal = 0;

  const ynngCounts = { Yes: 0, No: 0, 'Not Given': 0, Other: 0 };
  let ynngTotal = 0;

  let totalQuestions = 0;

  for (const lesson of lessons) {
    for (const q of lesson.questions) {
      totalQuestions += 1;
      countsByQuestionType[q.type] = (countsByQuestionType[q.type] || 0) + 1;

      if (q.type === 'true_false_not_given') {
        tfngTotal += 1;
        const label = q.correctAnswer.trim();
        if (label === 'True' || label === 'False' || label === 'Not Given') {
          tfngCounts[label] += 1;
        } else {
          tfngCounts.Other += 1;
        }
      } else if (q.type === 'yes_no_not_given') {
        ynngTotal += 1;
        const label = q.correctAnswer.trim();
        if (label === 'Yes' || label === 'No' || label === 'Not Given') {
          ynngCounts[label] += 1;
        } else {
          ynngCounts.Other += 1;
        }
      }

      if (
        shouldRandomizeQuestionOptions(q) &&
        q.type !== 'multiple_choice_two' &&
        Array.isArray(q.options)
      ) {
        const rawIdx = q.options.findIndex(
          (opt) => normalizeAnswer(opt) === normalizeAnswer(q.correctAnswer)
        );
        if (rawIdx >= 0) {
          const rawPos = rawIdx + 1;
          rawAllSingleTotal += 1;
          rawAllSingleCounts[rawPos] = (rawAllSingleCounts[rawPos] || 0) + 1;

          if (q.type === 'multiple_choice') {
            rawMcTotal += 1;
            rawMcCounts[rawPos] = (rawMcCounts[rawPos] || 0) + 1;
          } else if (q.type === 'vocabulary_in_context') {
            rawVicTotal += 1;
            rawVicCounts[rawPos] = (rawVicCounts[rawPos] || 0) + 1;
          }

          for (let t = 0; t < trials; t++) {
            const shuffled = fisherYatesShuffle(q.options, rng);
            const newIdx = shuffled.findIndex(
              (opt) => normalizeAnswer(opt) === normalizeAnswer(q.correctAnswer)
            );
            const newPos = newIdx + 1;
            shuffledAllSingleTotal += 1;
            shuffledAllSingleCounts[newPos] = (shuffledAllSingleCounts[newPos] || 0) + 1;
            if (q.type === 'multiple_choice') {
              shuffledMcTotal += 1;
              shuffledMcCounts[newPos] = (shuffledMcCounts[newPos] || 0) + 1;
            }
          }
        }
      }
    }
  }

  const pct = (count: number, tot: number) =>
    tot > 0 ? Number(((count / tot) * 100).toFixed(2)) : 0;

  return {
    lessonCount: lessons.length,
    totalQuestions,
    countsByQuestionType,
    rawMultipleChoicePositions: finalizePositionDistribution(rawMcCounts, rawMcTotal),
    rawVocabularyInContextPositions: finalizePositionDistribution(rawVicCounts, rawVicTotal),
    rawAllShufflableSingleChoicePositions: finalizePositionDistribution(
      rawAllSingleCounts,
      rawAllSingleTotal
    ),
    shuffledMultipleChoicePositions: finalizePositionDistribution(
      shuffledMcCounts,
      shuffledMcTotal
    ),
    shuffledAllSingleChoicePositions: finalizePositionDistribution(
      shuffledAllSingleCounts,
      shuffledAllSingleTotal
    ),
    trueFalseNotGivenDistribution: {
      total: tfngTotal,
      counts: tfngCounts,
      percentages: {
        True: pct(tfngCounts.True, tfngTotal),
        False: pct(tfngCounts.False, tfngTotal),
        'Not Given': pct(tfngCounts['Not Given'], tfngTotal),
        Other: pct(tfngCounts.Other, tfngTotal),
      },
    },
    yesNoNotGivenDistribution: {
      total: ynngTotal,
      counts: ynngCounts,
      percentages: {
        Yes: pct(ynngCounts.Yes, ynngTotal),
        No: pct(ynngCounts.No, ynngTotal),
        'Not Given': pct(ynngCounts['Not Given'], ynngTotal),
        Other: pct(ynngCounts.Other, ynngTotal),
      },
    },
  };
}
