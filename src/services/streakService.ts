import { CEFRLevel, LessonAttempt, ReadingLesson } from '../types/reading';
import { AdaptiveProfile, selectNextLesson } from './adaptiveLearning';

export function buildDeterministicFirstAttemptId(userId: string, lessonId: string): string {
  const cleanUser = (userId || 'guest').trim() || 'guest';
  const cleanLesson = lessonId.trim();
  return `att-first-${cleanUser}-${cleanLesson}`;
}

export function countNonEmptyAnswers(answers: Record<string, string> | undefined | null): number {
  if (!answers || typeof answers !== 'object') return 0;
  return Object.values(answers).filter((v) => typeof v === 'string' && v.trim().length > 0).length;
}

export function mergeInProgressAnswers(
  firstAnswers: Record<string, string> | undefined,
  secondAnswers: Record<string, string> | undefined,
  firstUpdatedAt?: unknown,
  secondUpdatedAt?: unknown
): Record<string, string> {
  const cleanFirst: Record<string, string> = {};
  if (firstAnswers && typeof firstAnswers === 'object') {
    for (const [k, v] of Object.entries(firstAnswers)) {
      if (typeof v === 'string' && v.trim().length > 0) {
        cleanFirst[k] = v;
      }
    }
  }
  const cleanSecond: Record<string, string> = {};
  if (secondAnswers && typeof secondAnswers === 'object') {
    for (const [k, v] of Object.entries(secondAnswers)) {
      if (typeof v === 'string' && v.trim().length > 0) {
        cleanSecond[k] = v;
      }
    }
  }

  const t1 = parseActivityTimestamp(firstUpdatedAt)?.getTime() ?? 0;
  const t2 = parseActivityTimestamp(secondUpdatedAt)?.getTime() ?? 0;

  if (t1 > t2) {
    return { ...cleanSecond, ...cleanFirst };
  }
  return { ...cleanFirst, ...cleanSecond };
}

export interface StreakCalculationOptions {
  /** Reference time for "today". Defaults to `new Date()`. */
  now?: Date | string | number;
  /**
   * Optional IANA timezone identifier (e.g. 'America/New_York', 'Europe/London', 'Asia/Tokyo').
   * When omitted, uses the learner's local browser/runtime timezone.
   */
  timeZone?: string;
}

export interface StreakSummary {
  currentStreak: number;
  longestStreak: number;
  studiedToday: boolean;
  lastActiveDate: string | null;
  activeDates: string[];
  completedCount: number;
  firstTimeCompletedCount: number;
}

/**
 * Safely parses any timestamp representation encountered in client state, localStorage,
 * or Firestore snapshots:
 * - Date instances
 * - ISO-8601 strings or YYYY-MM-DD strings
 * - Epoch milliseconds (number)
 * - Firestore Timestamp instances (`toDate()`)
 * - JSON-serialized Firestore Timestamp objects (`{ seconds, nanoseconds }` or `{ _seconds, _nanoseconds }`)
 */
export function parseActivityTimestamp(input: unknown): Date | null {
  if (input === null || input === undefined) return null;

  if (input instanceof Date) {
    return Number.isNaN(input.getTime()) ? null : new Date(input.getTime());
  }

  if (typeof input === 'number') {
    if (!Number.isFinite(input)) return null;
    const d = new Date(input);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (!trimmed) return null;
    // Handle bare YYYY-MM-DD as local calendar noon to avoid UTC midnight previous-day shift
    const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
    if (dateOnlyMatch) {
      const year = Number(dateOnlyMatch[1]);
      const month = Number(dateOnlyMatch[2]);
      const day = Number(dateOnlyMatch[3]);
      const localDate = new Date(year, month - 1, day, 12, 0, 0, 0);
      if (
        localDate.getFullYear() === year &&
        localDate.getMonth() === month - 1 &&
        localDate.getDate() === day
      ) {
        return localDate;
      }
      return null;
    }
    const parsed = new Date(trimmed);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  if (typeof input === 'object') {
    const obj = input as Record<string, unknown>;
    if (typeof obj.toDate === 'function') {
      try {
        const d = (obj.toDate as () => unknown)();
        if (d instanceof Date && !Number.isNaN(d.getTime())) {
          return d;
        }
      } catch {
        return null;
      }
    }
    const rawSeconds =
      typeof obj.seconds === 'number'
        ? obj.seconds
        : typeof obj._seconds === 'number'
        ? obj._seconds
        : null;
    const rawNanos =
      typeof obj.nanoseconds === 'number'
        ? obj.nanoseconds
        : typeof obj._nanoseconds === 'number'
        ? obj._nanoseconds
        : 0;
    if (rawSeconds !== null && Number.isFinite(rawSeconds)) {
      const ms = rawSeconds * 1000 + Math.floor((Number.isFinite(rawNanos) ? rawNanos : 0) / 1e6);
      const d = new Date(ms);
      return Number.isNaN(d.getTime()) ? null : d;
    }
  }

  return null;
}

/**
 * Normalizes any timestamp value into a valid ISO-8601 string.
 * Falls back to `fallback` (or current time if fallback is also invalid).
 */
export function normalizeTimestampToIso(input: unknown, fallback?: unknown): string {
  const primary = parseActivityTimestamp(input);
  if (primary) return primary.toISOString();
  const secondary = parseActivityTimestamp(fallback);
  if (secondary) return secondary.toISOString();
  return new Date().toISOString();
}

/**
 * Converts a timestamp into a `YYYY-MM-DD` calendar date string in the learner's local timezone
 * (or the explicit IANA `timeZone` if provided).
 */
export function toLocalCalendarDateKey(input: unknown, timeZone?: string): string | null {
  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      const [y, m, d] = trimmed.split('-').map(Number);
      const check = new Date(Date.UTC(y, m - 1, d));
      if (
        check.getUTCFullYear() === y &&
        check.getUTCMonth() === m - 1 &&
        check.getUTCDate() === d
      ) {
        return trimmed;
      }
      return null;
    }
  }

  const date = parseActivityTimestamp(input);
  if (!date) return null;

  if (timeZone) {
    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
      const parts = formatter.formatToParts(date);
      const year = parts.find((p) => p.type === 'year')?.value;
      const month = parts.find((p) => p.type === 'month')?.value;
      const day = parts.find((p) => p.type === 'day')?.value;
      if (year && month && day) {
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
    } catch {
      // Fall back to runtime local date components if an invalid timeZone string was passed
    }
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Pure calendar date arithmetic on `YYYY-MM-DD` keys.
 * Uses UTC noon/midnight integer calendar math so DST transitions (23h / 25h days)
 * never skip or repeat a calendar date.
 */
export function addCalendarDays(dateKey: string, deltaDays: number): string {
  const [year, month, day] = dateKey.split('-').map(Number);
  const utc = new Date(Date.UTC(year, month - 1, day + deltaDays));
  const y = utc.getUTCFullYear();
  const m = String(utc.getUTCMonth() + 1).padStart(2, '0');
  const d = String(utc.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Computes the exact integer number of calendar days from `earlierDateKey` to `laterDateKey`
 * (`later - earlier`).
 */
export function diffCalendarDays(earlierDateKey: string, laterDateKey: string): number {
  const [y1, m1, d1] = earlierDateKey.split('-').map(Number);
  const [y2, m2, d2] = laterDateKey.split('-').map(Number);
  const utc1 = Date.UTC(y1, m1 - 1, d1);
  const utc2 = Date.UTC(y2, m2 - 1, d2);
  return Math.round((utc2 - utc1) / 86_400_000);
}

/**
 * Normalizes a raw attempt object from Firestore (`onSnapshot`/`getDocs`) or `localStorage`
 * into a well-formed `LessonAttempt` with valid ISO-8601 timestamps and parsed JSON maps.
 */
export function normalizeLessonAttempt(
  raw: unknown,
  fallbackUserId = 'guest',
  existingLocal?: LessonAttempt,
  fallbackDocId?: string
): LessonAttempt | null {
  if (!raw || typeof raw !== 'object') return null;
  const data = raw as Record<string, unknown>;

  const id =
    typeof data.id === 'string' && data.id.trim()
      ? data.id.trim()
      : typeof fallbackDocId === 'string' && fallbackDocId.trim()
      ? fallbackDocId.trim()
      : typeof data.docId === 'string' && data.docId.trim()
      ? data.docId.trim()
      : '';
  const lessonId =
    typeof data.lessonId === 'string' && data.lessonId.trim() ? data.lessonId.trim() : '';
  if (!id || !lessonId) return null;

  let parsedIncomingAnswers: Record<string, string> = {};
  if (data.answers && typeof data.answers === 'object' && !Array.isArray(data.answers)) {
    parsedIncomingAnswers = data.answers as Record<string, string>;
  } else if (typeof data.answersJson === 'string' && data.answersJson.trim()) {
    try {
      const parsed = JSON.parse(data.answersJson);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        parsedIncomingAnswers = parsed as Record<string, string>;
      }
    } catch {
      parsedIncomingAnswers = {};
    }
  }

  const incomingStatus =
    data.status === 'completed' ||
    data.status === 'in_progress' ||
    data.status === 'pending_review'
      ? data.status
      : existingLocal?.status || 'completed';

  const answers: Record<string, string> =
    incomingStatus === 'in_progress' && existingLocal?.status === 'in_progress'
      ? mergeInProgressAnswers(
          existingLocal.answers,
          parsedIncomingAnswers,
          existingLocal.updatedAt,
          data.updatedAt ?? data.createdAt
        )
      : Object.keys(parsedIncomingAnswers).length > 0
      ? parsedIncomingAnswers
      : existingLocal?.answers || {};

  let questionTypeStats: Record<string, { correct: number; total: number }> = {};
  if (
    data.questionTypeStats &&
    typeof data.questionTypeStats === 'object' &&
    !Array.isArray(data.questionTypeStats)
  ) {
    questionTypeStats = data.questionTypeStats as Record<
      string,
      { correct: number; total: number }
    >;
  } else if (
    typeof data.questionTypeStatsJson === 'string' &&
    data.questionTypeStatsJson.trim()
  ) {
    try {
      const parsed = JSON.parse(data.questionTypeStatsJson);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        questionTypeStats = parsed as Record<string, { correct: number; total: number }>;
      }
    } catch {
      questionTypeStats = existingLocal?.questionTypeStats || {};
    }
  } else if (existingLocal?.questionTypeStats) {
    questionTypeStats = existingLocal.questionTypeStats;
  }

  // `att-prac-` ID prefix always takes precedence over `'first'` so practice attempts
  // can never be mistaken for regular first-time attempts upon Firestore hydration.
  const inferredAttemptType: 'first' | 'practice' | 'review' =
    data.attemptType === 'review'
      ? 'review'
      : id.startsWith('att-prac-')
      ? 'practice'
      : data.attemptType === 'practice' || data.attemptType === 'first'
      ? data.attemptType
      : existingLocal?.attemptType === 'practice' || existingLocal?.id?.startsWith('att-prac-')
      ? 'practice'
      : existingLocal?.attemptType || 'first';

  const createdAt = normalizeTimestampToIso(
    data.createdAt,
    existingLocal?.createdAt ?? data.updatedAt
  );
  const updatedAt = normalizeTimestampToIso(
    data.updatedAt,
    existingLocal?.updatedAt ?? createdAt
  );

  const validLevels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1'];
  const level: CEFRLevel = validLevels.includes(data.level as CEFRLevel)
    ? (data.level as CEFRLevel)
    : existingLocal?.level || 'B1';

  const status: LessonAttempt['status'] =
    data.status === 'completed' ||
    data.status === 'in_progress' ||
    data.status === 'pending_review'
      ? data.status
      : existingLocal?.status || 'completed';

  return {
    id,
    userId:
      typeof data.userId === 'string' && data.userId.trim()
        ? data.userId.trim()
        : existingLocal?.userId || fallbackUserId,
    lessonId,
    lessonTitle:
      typeof data.lessonTitle === 'string' && data.lessonTitle.trim()
        ? data.lessonTitle
        : existingLocal?.lessonTitle || lessonId,
    level,
    topic: (typeof data.topic === 'string' && data.topic.trim()
      ? data.topic
      : existingLocal?.topic || 'Science and technology') as LessonAttempt['topic'],
    status,
    attemptType: inferredAttemptType,
    score: Number.isFinite(Number(data.score)) ? Number(data.score) : 0,
    totalQuestions: Number.isFinite(Number(data.totalQuestions))
      ? Number(data.totalQuestions)
      : 0,
    accuracy: Number.isFinite(Number(data.accuracy))
      ? Math.max(0, Math.min(100, Number(data.accuracy)))
      : 0,
    answers,
    questionTypeStats,
    createdAt,
    updatedAt,
  };
}

/**
 * Merges local and remote LessonAttempts by ID, normalizing timestamps, removing stale
 * `in_progress` attempts when a lesson is already `completed`, and sorting newest-first.
 */
export function mergeAndNormalizeAttempts(
  localAttempts: unknown[],
  remoteAttempts: unknown[],
  activeUserId?: string
): LessonAttempt[] {
  const byId = new Map<string, LessonAttempt>();

  for (const rawLocal of localAttempts) {
    const norm = normalizeLessonAttempt(rawLocal, activeUserId || 'guest');
    if (!norm) continue;
    if (
      activeUserId &&
      norm.userId &&
      norm.userId !== 'guest' &&
      norm.userId !== activeUserId
    ) {
      continue;
    }
    byId.set(norm.id, norm);
  }

  for (const rawRemote of remoteAttempts) {
    const candidateId =
      rawRemote && typeof rawRemote === 'object'
        ? typeof (rawRemote as any).id === 'string' && (rawRemote as any).id.trim()
          ? (rawRemote as any).id.trim()
          : typeof (rawRemote as any).docId === 'string' && (rawRemote as any).docId.trim()
          ? (rawRemote as any).docId.trim()
          : ''
        : '';
    const existingLocal = candidateId ? byId.get(candidateId) : undefined;
    const norm = normalizeLessonAttempt(
      rawRemote,
      activeUserId || 'guest',
      existingLocal,
      candidateId
    );
    if (!norm) continue;
    if (
      activeUserId &&
      norm.userId &&
      norm.userId !== 'guest' &&
      norm.userId !== activeUserId
    ) {
      continue;
    }
    if (existingLocal && existingLocal.status === 'completed' && norm.status === 'in_progress') {
      continue;
    }
    byId.set(norm.id, norm);
  }

  const allMerged = Array.from(byId.values());

  // Identify lessons that have at least one completed attempt so any stale local `in_progress`
  // placeholder for the same lesson is cleaned up automatically.
  const completedLessonIds = new Set(
    allMerged.filter((a) => a.status === 'completed').map((a) => a.lessonId)
  );

  // Coalesce multiple `in_progress` first-time attempts for the same lesson (e.g., if a local
  // random ID `att-...` and a remote canonical ID `att-first-...` both exist for the same lesson)
  const inProgressByLesson = new Map<string, LessonAttempt>();
  const filtered: LessonAttempt[] = [];

  for (const a of allMerged) {
    if (a.status === 'in_progress' && completedLessonIds.has(a.lessonId)) {
      continue;
    }
    if (
      a.status === 'in_progress' &&
      (a.attemptType || 'first') === 'first' &&
      !a.id.startsWith('att-prac-')
    ) {
      const prior = inProgressByLesson.get(a.lessonId);
      if (!prior) {
        inProgressByLesson.set(a.lessonId, a);
      } else {
        const mergedAnswers = mergeInProgressAnswers(
          prior.answers,
          a.answers,
          prior.updatedAt,
          a.updatedAt
        );
        const priorTime = parseActivityTimestamp(prior.updatedAt)?.getTime() ?? 0;
        const nextTime = parseActivityTimestamp(a.updatedAt)?.getTime() ?? 0;
        const canonicalId = a.id.startsWith('att-first-')
          ? a.id
          : prior.id.startsWith('att-first-')
          ? prior.id
          : nextTime >= priorTime
          ? a.id
          : prior.id;
        const base = nextTime >= priorTime ? a : prior;
        inProgressByLesson.set(a.lessonId, {
          ...base,
          id: canonicalId,
          answers: mergedAnswers,
          createdAt:
            (parseActivityTimestamp(prior.createdAt)?.getTime() ?? Infinity) <=
            (parseActivityTimestamp(a.createdAt)?.getTime() ?? Infinity)
              ? prior.createdAt
              : a.createdAt,
          updatedAt: nextTime >= priorTime ? a.updatedAt : prior.updatedAt,
        });
      }
      continue;
    }
    filtered.push(a);
  }

  for (const coalescedInProg of inProgressByLesson.values()) {
    filtered.push(coalescedInProg);
  }

  return filtered.sort((a, b) => {
    const timeB = parseActivityTimestamp(b.updatedAt)?.getTime() ?? 0;
    const timeA = parseActivityTimestamp(a.updatedAt)?.getTime() ?? 0;
    return timeB - timeA;
  });
}

/**
 * Finds the active unfinished regular reading assignment (`status === 'in_progress'`, `attemptType === 'first'`)
 * for the specified user, strictly isolating by `activeUserId` and ignoring completed or diagnostic lessons.
 */
export function findActiveUnfinishedAttempt(
  attempts: readonly LessonAttempt[],
  activeUserId?: string,
  preferredLevel?: CEFRLevel
): LessonAttempt | null {
  if (!Array.isArray(attempts) || attempts.length === 0) return null;

  const userScoped = attempts.filter((a) => {
    if (!a || typeof a !== 'object') return false;
    if (activeUserId && activeUserId !== 'guest') {
      return a.userId === activeUserId;
    }
    if (activeUserId === 'guest') {
      return !a.userId || a.userId === 'guest';
    }
    return true;
  });

  const completedLessonIds = new Set(
    userScoped.filter((a) => a.status === 'completed').map((a) => a.lessonId)
  );

  const candidates = userScoped
    .filter(
      (a) =>
        a.status === 'in_progress' &&
        (a.attemptType || 'first') === 'first' &&
        !a.id.startsWith('att-prac-') &&
        typeof a.lessonId === 'string' &&
        a.lessonId.trim().length > 0 &&
        !a.lessonId.trim().toLowerCase().startsWith('diag-') &&
        !completedLessonIds.has(a.lessonId)
    )
    .sort((a, b) => {
      const answerDiff = countNonEmptyAnswers(b.answers) - countNonEmptyAnswers(a.answers);
      if (answerDiff !== 0) return answerDiff;
      if (preferredLevel) {
        const levelDiff =
          (b.level === preferredLevel ? 1 : 0) - (a.level === preferredLevel ? 1 : 0);
        if (levelDiff !== 0) return levelDiff;
      }
      const timeB = parseActivityTimestamp(b.updatedAt)?.getTime() ?? 0;
      const timeA = parseActivityTimestamp(a.updatedAt)?.getTime() ?? 0;
      if (timeB !== timeA) return timeB - timeA;
      return a.lessonId.localeCompare(b.lessonId);
    });

  return candidates[0] || null;
}


/**
 * Defines the exact qualifying activity rule for the Daily Learning Streak:
 * 1. The attempt must be completed (`status === 'completed'`). Merely opening or previewing a
 *    passage (`status === 'in_progress'`) does not count.
 * 2. Reopening a completed passage in Review mode (`attemptType === 'review'`) does not count.
 * 3. Diagnostic placement test passages (`lessonId` starting with `'diag-'`) do not count toward
 *    the regular reading streak.
 * 4. The attempt must have at least 1 comprehension question (`totalQuestions > 0`) and a valid
 *    completion timestamp (`updatedAt` or `createdAt`).
 */
export function isQualifyingStreakAttempt(attempt: LessonAttempt | null | undefined): boolean {
  if (!attempt || typeof attempt !== 'object') return false;
  if (attempt.status !== 'completed') return false;
  if (attempt.attemptType === 'review') return false;
  if (typeof attempt.lessonId !== 'string' || !attempt.lessonId.trim()) return false;
  if (attempt.lessonId.trim().toLowerCase().startsWith('diag-')) return false;
  if (!Number.isFinite(attempt.totalQuestions) || attempt.totalQuestions <= 0) return false;
  const ts = parseActivityTimestamp(attempt.updatedAt ?? attempt.createdAt);
  return ts !== null;
}

/**
 * Calculates the learner's current daily streak, longest streak, whether they have studied today,
 * and their active study dates using local calendar dates.
 */
export function calculateReadingStreak(
  attempts: readonly LessonAttempt[],
  options: StreakCalculationOptions = {}
): StreakSummary {
  const { now = new Date(), timeZone } = options;

  const qualifying = (attempts || []).filter(isQualifyingStreakAttempt);
  const firstTimeCompleted = qualifying.filter(
    (a) => (a.attemptType || 'first') === 'first' && !a.id.startsWith('att-prac-')
  );
  // Count distinct completed lessons for completedCount so repeated practice of the same lesson
  // does not inflate the unique completed passages metric, while also tracking total qualifying
  const uniqueCompletedLessonIds = new Set(qualifying.map((a) => a.lessonId));

  const dateKeySet = new Set<string>();
  for (const attempt of qualifying) {
    const dateKey = toLocalCalendarDateKey(attempt.updatedAt || attempt.createdAt, timeZone);
    if (dateKey) {
      dateKeySet.add(dateKey);
    }
  }

  const activeDates = Array.from(dateKeySet).sort();

  if (activeDates.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      studiedToday: false,
      lastActiveDate: null,
      activeDates: [],
      completedCount: 0,
      firstTimeCompletedCount: 0,
    };
  }

  // Calculate longest streak across all historical active calendar days
  let longestStreak = 1;
  let currentRun = 1;
  for (let i = 1; i < activeDates.length; i++) {
    const dayDiff = diffCalendarDays(activeDates[i - 1], activeDates[i]);
    if (dayDiff === 1) {
      currentRun += 1;
      if (currentRun > longestStreak) {
        longestStreak = currentRun;
      }
    } else if (dayDiff > 1) {
      currentRun = 1;
    }
  }

  const todayKey =
    toLocalCalendarDateKey(now, timeZone) || activeDates[activeDates.length - 1];
  const yesterdayKey = addCalendarDays(todayKey, -1);

  const studiedToday = dateKeySet.has(todayKey);

  // Active streak continues if the learner studied today OR yesterday;
  // missing a full calendar day (neither today nor yesterday active) resets currentStreak to 0.
  const streakAnchor = studiedToday
    ? todayKey
    : dateKeySet.has(yesterdayKey)
    ? yesterdayKey
    : null;

  let currentStreak = 0;
  if (streakAnchor) {
    let cursor = streakAnchor;
    while (dateKeySet.has(cursor)) {
      currentStreak += 1;
      cursor = addCalendarDays(cursor, -1);
    }
  }

  if (currentStreak > longestStreak) {
    longestStreak = currentStreak;
  }

  return {
    currentStreak,
    longestStreak,
    studiedToday,
    lastActiveDate: activeDates[activeDates.length - 1],
    activeDates,
    completedCount: uniqueCompletedLessonIds.size,
    firstTimeCompletedCount: firstTimeCompleted.length,
  };
}

export interface RecordAttemptInput {
  currentAttempts: LessonAttempt[];
  getCurrentAttempts?: () => LessonAttempt[];
  candidateAttempt: LessonAttempt;
  /**
   * Optional async persistence function (e.g., Firestore `setDoc`).
   * If provided, must resolve before the attempt is committed to persisted state.
   */
  persistToCloud?: (attempt: LessonAttempt) => Promise<void>;
  streakOptions?: StreakCalculationOptions;
}

export interface RecordAttemptOutcome {
  persisted: boolean;
  duplicateIgnored: boolean;
  attempts: LessonAttempt[];
  streak: StreakSummary;
  persistedAttempt: LessonAttempt | null;
  error?: string;
}

// In-flight submission lock keyed by `${userId}:${lessonId}:${attemptType}`
const inFlightSubmissionLocks = new Map<string, Promise<RecordAttemptOutcome>>();

// Per-user serialization queue and latest committed state so concurrent distinct attempts never clobber each other
const inFlightUserQueues = new Map<string, Promise<unknown>>();
const latestUserCommittedAttempts = new Map<string, LessonAttempt[]>();

let practiceIdSequence = 0;

/**
 * Coordinates recording a lesson attempt with concurrency protection, duplicate-event
 * prevention, and verified cloud persistence.
 *
 * - Review mode (`attemptType === 'review'`) and diagnostic passages (`lessonId` starting with `'diag-'`)
 *   never create reading-history or streak entries.
 * - Concurrent submissions for the same user + lesson + attemptType are coalesced so they cannot create
 *   duplicate records or double-increment streaks.
 * - Concurrent submissions for distinct lessons by the same user are serialized so neither attempt is
 *   ever lost or overwritten.
 * - If `persistToCloud` fails, the local persisted state and streak are NOT updated.
 */
export async function recordCompletedAttemptWithPersistence(
  input: RecordAttemptInput
): Promise<RecordAttemptOutcome> {
  const {
    currentAttempts,
    getCurrentAttempts,
    candidateAttempt,
    persistToCloud,
    streakOptions,
  } = input;

  const resolveLatestInputAttempts = (): LessonAttempt[] => {
    const base = getCurrentAttempts ? getCurrentAttempts() : currentAttempts;
    return Array.isArray(base) ? base : [];
  };

  // 1. Review mode or non-completed attempts do not record completion activity
  if (
    candidateAttempt.attemptType === 'review' ||
    candidateAttempt.status !== 'completed' ||
    candidateAttempt.lessonId.trim().toLowerCase().startsWith('diag-')
  ) {
    const baseAttempts = resolveLatestInputAttempts();
    return {
      persisted: false,
      duplicateIgnored: true,
      attempts: baseAttempts,
      streak: calculateReadingStreak(baseAttempts, streakOptions),
      persistedAttempt: null,
    };
  }

  const userKey = candidateAttempt.userId || 'guest';
  const effectiveTypeKey = candidateAttempt.id?.startsWith('att-prac-')
    ? 'practice'
    : candidateAttempt.attemptType || 'first';
  const lockKey = `${userKey}:${candidateAttempt.lessonId}:${effectiveTypeKey}`;

  const existingLock = inFlightSubmissionLocks.get(lockKey);
  if (existingLock) {
    try {
      const priorOutcome = await existingLock;
      return {
        ...priorOutcome,
        duplicateIgnored: true,
      };
    } catch {
      // If the prior in-flight task unexpectedly threw, allow this call to proceed cleanly
    }
  }

  const priorUserQueue = inFlightUserQueues.get(userKey) ?? Promise.resolve();
  const hadActiveUserQueue = inFlightUserQueues.has(userKey);

  const taskPromise = (async (): Promise<RecordAttemptOutcome> => {
    // Wait for any earlier distinct submission by the same user to finish committing
    await priorUserQueue.catch(() => {});

    const callerSnapshot = resolveLatestInputAttempts();
    // Only merge with `latestUserCommittedAttempts` when another operation for the same user
    // was concurrently in-flight, so independent sequential calls with explicit `currentAttempts`
    // arrays remain completely isolated while concurrent `Promise.all` calls never lose data.
    const recentCommitted = hadActiveUserQueue
      ? latestUserCommittedAttempts.get(userKey) ?? []
      : [];
    const workingAttempts =
      recentCommitted.length > 0
        ? mergeAndNormalizeAttempts(callerSnapshot, recentCommitted, userKey)
        : mergeAndNormalizeAttempts(callerSnapshot, [], userKey);

    const normalizedCandidate = normalizeLessonAttempt(candidateAttempt, userKey);
    if (!normalizedCandidate) {
      return {
        persisted: false,
        duplicateIgnored: true,
        attempts: workingAttempts,
        streak: calculateReadingStreak(workingAttempts, streakOptions),
        persistedAttempt: null,
      };
    }

    // 2. Idempotency check by exact attempt ID: if this exact attempt ID is already completed,
    // do not re-write to Firestore (which would violate the `in_progress`-only update rule)
    const existingCompletedSameId = workingAttempts.find(
      (a) => a.id === normalizedCandidate.id && a.status === 'completed'
    );
    if (existingCompletedSameId) {
      return {
        persisted: true,
        duplicateIgnored: true,
        attempts: workingAttempts,
        streak: calculateReadingStreak(workingAttempts, streakOptions),
        persistedAttempt: existingCompletedSameId,
      };
    }

    // 3. Check if there is already a completed first-time attempt for this exact lesson
    const existingCompletedFirst = workingAttempts.find(
      (a) =>
        a.lessonId === normalizedCandidate.lessonId &&
        a.status === 'completed' &&
        (a.attemptType || 'first') === 'first' &&
        !a.id.startsWith('att-prac-')
    );

    const existingInProgressFirst = workingAttempts.find(
      (a) =>
        a.lessonId === normalizedCandidate.lessonId &&
        a.status === 'in_progress' &&
        (a.attemptType || 'first') === 'first'
    );

    let finalAttempt: LessonAttempt = { ...normalizedCandidate };

    if ((finalAttempt.attemptType || 'first') === 'first') {
      if (existingCompletedFirst) {
        // Convert any subsequent 'first' submission for an already-completed lesson into a 'practice' attempt
        practiceIdSequence += 1;
        const basePracId = finalAttempt.id.startsWith('att-prac-')
          ? finalAttempt.id
          : `att-prac-${Date.now()}-${practiceIdSequence}`;
        const uniquePracId = workingAttempts.some((a) => a.id === basePracId)
          ? `${basePracId}-${practiceIdSequence}`
          : basePracId;
        finalAttempt = {
          ...finalAttempt,
          id: uniquePracId,
          attemptType: 'practice',
        };
      } else if (existingInProgressFirst) {
        finalAttempt = {
          ...finalAttempt,
          id: existingInProgressFirst.id,
          createdAt: normalizeTimestampToIso(
            existingInProgressFirst.createdAt,
            finalAttempt.createdAt
          ),
        };
      }
    } else if (finalAttempt.attemptType === 'practice') {
      let pracId = finalAttempt.id.startsWith('att-prac-')
        ? finalAttempt.id
        : `att-prac-${finalAttempt.id.replace(/^att-/, '')}`;
      if (workingAttempts.some((a) => a.id === pracId)) {
        practiceIdSequence += 1;
        pracId = `${pracId}-${practiceIdSequence}`;
      }
      finalAttempt = {
        ...finalAttempt,
        id: pracId,
        attemptType: 'practice',
      };
    }

    // 4. Persist to cloud first if an authenticated persistence callback is provided
    if (persistToCloud) {
      try {
        await persistToCloud(finalAttempt);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        return {
          persisted: false,
          duplicateIgnored: false,
          attempts: workingAttempts,
          streak: calculateReadingStreak(workingAttempts, streakOptions),
          persistedAttempt: null,
          error: message || 'Failed to persist reading attempt to Firestore.',
        };
      }
    }

    // Re-read latest attempts after awaiting cloud persistence so any concurrent state update is preserved
    const postPersistInput = resolveLatestInputAttempts();
    const postPersistBase =
      postPersistInput.length > 0
        ? mergeAndNormalizeAttempts(postPersistInput, workingAttempts, userKey)
        : workingAttempts;

    // 5. Replace any existing entry with the same ID (or in-progress first attempt for the same lesson)
    const filtered = postPersistBase.filter((a) => {
      if (a.id === finalAttempt.id) return false;
      if (
        (finalAttempt.attemptType || 'first') === 'first' &&
        a.lessonId === finalAttempt.lessonId &&
        a.status === 'in_progress' &&
        (a.attemptType || 'first') === 'first'
      ) {
        return false;
      }
      return true;
    });

    const updatedAttempts = mergeAndNormalizeAttempts(
      [finalAttempt, ...filtered],
      [],
      finalAttempt.userId
    );

    latestUserCommittedAttempts.set(userKey, updatedAttempts);

    return {
      persisted: true,
      duplicateIgnored: false,
      attempts: updatedAttempts,
      streak: calculateReadingStreak(updatedAttempts, streakOptions),
      persistedAttempt: finalAttempt,
    };
  })();

  inFlightSubmissionLocks.set(lockKey, taskPromise);
  inFlightUserQueues.set(userKey, taskPromise);
  try {
    return await taskPromise;
  } finally {
    if (inFlightSubmissionLocks.get(lockKey) === taskPromise) {
      inFlightSubmissionLocks.delete(lockKey);
    }
    if (inFlightUserQueues.get(userKey) === taskPromise) {
      inFlightUserQueues.delete(userKey);
      latestUserCommittedAttempts.delete(userKey);
    }
  }
}

export interface EnsureUnfinishedAttemptInput {
  userId: string;
  profile: AdaptiveProfile;
  lessons: ReadingLesson[];
  currentAttempts: LessonAttempt[];
  getCurrentAttempts?: () => LessonAttempt[];
  requestedLessonId?: string;
  difficultyOverrides?: Record<string, number>;
  persistInProgressToCloud?: (attempt: LessonAttempt, isNewDoc: boolean) => Promise<void>;
}

export interface EnsureUnfinishedAttemptOutcome {
  attempt: LessonAttempt | null;
  lesson: ReadingLesson | null;
  restoredExisting: boolean;
  createdNew: boolean;
  attempts: LessonAttempt[];
}

const inFlightAssignmentLocks = new Map<string, Promise<EnsureUnfinishedAttemptOutcome>>();
const latestUserAssignmentState = new Map<string, LessonAttempt[]>();

/**
 * Resolves the learner's active unfinished regular reading assignment (`in_progress`, `first`),
 * restoring any existing unfinished passage and its saved answers before allowing a new adaptive
 * assignment to be generated.
 *
 * Concurrency guarantees:
 * - Multiple authentication callbacks or multiple tabs calling `ensureOrRestoreUnfinishedAttempt`
 *   concurrently for the same `userId` coalesce onto a single in-flight promise and receive the
 *   exact same passage and attempt ID.
 * - A new assignment is NEVER generated while a valid unfinished assignment exists for the user.
 */
export async function ensureOrRestoreUnfinishedAttempt(
  input: EnsureUnfinishedAttemptInput
): Promise<EnsureUnfinishedAttemptOutcome> {
  const userKey = (input.userId || 'guest').trim() || 'guest';

  const existingInFlight = inFlightAssignmentLocks.get(userKey);
  if (existingInFlight) {
    const prior = await existingInFlight;
    return {
      ...prior,
      restoredExisting: true,
      createdNew: false,
    };
  }

  const hadActiveLock = inFlightAssignmentLocks.has(userKey);

  const taskPromise = (async (): Promise<EnsureUnfinishedAttemptOutcome> => {
    const rawCurrent = input.getCurrentAttempts
      ? input.getCurrentAttempts()
      : input.currentAttempts;
    const committed = hadActiveLock ? latestUserAssignmentState.get(userKey) ?? [] : [];
    const workingAttempts = mergeAndNormalizeAttempts(
      Array.isArray(rawCurrent) ? rawCurrent : [],
      committed,
      userKey
    );

    const publishedLessons = (input.lessons || []).filter(
      (l) => l.status === 'published' && !l.isDiagnostic && !l.id.startsWith('diag-')
    );

    // 1. Check if the user ALREADY has an unfinished regular reading assignment
    const existingUnfinished = findActiveUnfinishedAttempt(
      workingAttempts,
      userKey,
      input.profile.currentLevel
    );

    if (existingUnfinished) {
      const resumedLesson =
        publishedLessons.find((l) => l.id === existingUnfinished.lessonId) || null;
      if (resumedLesson) {
        latestUserAssignmentState.set(userKey, workingAttempts);
        return {
          attempt: existingUnfinished,
          lesson: resumedLesson,
          restoredExisting: true,
          createdNew: false,
          attempts: workingAttempts,
        };
      }
    }

    // 2. No valid unfinished assignment exists -> select next adaptive passage deterministically
    const completedIds = new Set(
      workingAttempts.filter((a) => a.status === 'completed').map((a) => a.lessonId)
    );
    const requestedCandidate = input.requestedLessonId
      ? publishedLessons.find(
          (l) => l.id === input.requestedLessonId && !completedIds.has(l.id)
        )
      : undefined;

    const nextLesson =
      requestedCandidate ||
      selectNextLesson(
        input.profile,
        publishedLessons,
        workingAttempts,
        input.difficultyOverrides
      );

    if (!nextLesson) {
      return {
        attempt: null,
        lesson: null,
        restoredExisting: false,
        createdNew: false,
        attempts: workingAttempts,
      };
    }

    const nowIso = new Date().toISOString();
    const newAttempt: LessonAttempt = {
      id: buildDeterministicFirstAttemptId(userKey, nextLesson.id),
      userId: userKey,
      lessonId: nextLesson.id,
      lessonTitle: nextLesson.title,
      level: nextLesson.level,
      topic: nextLesson.topic,
      status: 'in_progress',
      attemptType: 'first',
      score: 0,
      totalQuestions: Math.max(1, nextLesson.questions.length),
      accuracy: 0,
      answers: {},
      questionTypeStats: {},
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    if (input.persistInProgressToCloud) {
      await input.persistInProgressToCloud(newAttempt, true);
    }

    const updatedAttempts = mergeAndNormalizeAttempts(
      [newAttempt, ...workingAttempts],
      [],
      userKey
    );
    latestUserAssignmentState.set(userKey, updatedAttempts);

    return {
      attempt: newAttempt,
      lesson: nextLesson,
      restoredExisting: false,
      createdNew: true,
      attempts: updatedAttempts,
    };
  })();

  inFlightAssignmentLocks.set(userKey, taskPromise);
  try {
    return await taskPromise;
  } finally {
    if (inFlightAssignmentLocks.get(userKey) === taskPromise) {
      inFlightAssignmentLocks.delete(userKey);
      latestUserAssignmentState.delete(userKey);
    }
  }
}

export interface UpdateInProgressAnswersInput {
  userId: string;
  attemptId?: string;
  lessonId: string;
  answers: Record<string, string>;
  currentAttempts: LessonAttempt[];
  getCurrentAttempts?: () => LessonAttempt[];
  persistAnswersToCloud?: (attempt: LessonAttempt) => Promise<void>;
}

/**
 * Updates and persists the learner's selected answers for an active `in_progress` regular reading
 * assignment without ever re-opening or mutating an already-completed passage.
 */
export async function updateInProgressAttemptAnswers(
  input: UpdateInProgressAnswersInput
): Promise<{ attempt: LessonAttempt | null; attempts: LessonAttempt[] }> {
  const userKey = (input.userId || 'guest').trim() || 'guest';
  const baseAttempts = mergeAndNormalizeAttempts(
    input.getCurrentAttempts ? input.getCurrentAttempts() : input.currentAttempts,
    [],
    userKey
  );

  // Never modify or re-open a lesson that already has a completed first-time attempt
  const alreadyCompleted = baseAttempts.some(
    (a) => a.lessonId === input.lessonId && a.status === 'completed'
  );
  if (alreadyCompleted) {
    return { attempt: null, attempts: baseAttempts };
  }

  const targetIdx = baseAttempts.findIndex(
    (a) =>
      a.status === 'in_progress' &&
      (a.attemptType || 'first') === 'first' &&
      ((input.attemptId && a.id === input.attemptId) || a.lessonId === input.lessonId)
  );

  if (targetIdx === -1) {
    return { attempt: null, attempts: baseAttempts };
  }

  const nowIso = new Date().toISOString();
  const existing = baseAttempts[targetIdx];
  const updatedAttempt: LessonAttempt = {
    ...existing,
    answers: { ...input.answers },
    updatedAt: nowIso,
  };

  if (input.persistAnswersToCloud) {
    await input.persistAnswersToCloud(updatedAttempt);
  }

  const nextList = [...baseAttempts];
  nextList[targetIdx] = updatedAttempt;
  const normalized = mergeAndNormalizeAttempts(nextList, [], userKey);

  return {
    attempt: normalized.find((a) => a.id === updatedAttempt.id) || updatedAttempt,
    attempts: normalized,
  };
}

