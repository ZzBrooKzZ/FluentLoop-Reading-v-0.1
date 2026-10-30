import assert from 'node:assert/strict';
import test from 'node:test';
import { LessonAttempt, ReadingLesson } from '../types/reading';
import { createAdaptiveProfile, selectNextLesson } from './adaptiveLearning';
import {
  addCalendarDays,
  buildDeterministicFirstAttemptId,
  calculateReadingStreak,
  diffCalendarDays,
  ensureOrRestoreUnfinishedAttempt,
  findActiveUnfinishedAttempt,
  isQualifyingStreakAttempt,
  mergeAndNormalizeAttempts,
  normalizeLessonAttempt,
  parseActivityTimestamp,
  recordCompletedAttemptWithPersistence,
  toLocalCalendarDateKey,
  updateInProgressAttemptAnswers,
} from './streakService';

function createAttempt(overrides: Partial<LessonAttempt> = {}): LessonAttempt {
  return {
    id: overrides.id || `att-${Math.random().toString(36).slice(2, 9)}`,
    userId: overrides.userId || 'user-123',
    lessonId: overrides.lessonId || 'b1-sci-sodium-batteries',
    lessonTitle: overrides.lessonTitle || 'Sodium-Ion Salt Batteries',
    level: overrides.level || 'B1',
    topic: overrides.topic || 'Science and technology',
    status: overrides.status || 'completed',
    attemptType: overrides.attemptType || 'first',
    score: overrides.score ?? 5,
    totalQuestions: overrides.totalQuestions ?? 6,
    accuracy: overrides.accuracy ?? 83,
    answers: overrides.answers || { q1: 'A' },
    questionTypeStats: overrides.questionTypeStats || {
      multiple_choice: { correct: 5, total: 6 },
    },
    createdAt: overrides.createdAt || '2026-10-28T14:00:00.000Z',
    updatedAt: overrides.updatedAt || '2026-10-28T14:00:00.000Z',
  };
}

test('Scenario 10: New user with no activity has a valid empty / zero-streak state', () => {
  const summary = calculateReadingStreak([], {
    now: '2026-10-28T15:00:00.000Z',
    timeZone: 'America/New_York',
  });

  assert.equal(summary.currentStreak, 0);
  assert.equal(summary.longestStreak, 0);
  assert.equal(summary.studiedToday, false);
  assert.equal(summary.lastActiveDate, null);
  assert.deepEqual(summary.activeDates, []);
  assert.equal(summary.completedCount, 0);
  assert.equal(summary.firstTimeCompletedCount, 0);
});

test('Scenario 1: A user with no prior streak completes their first qualifying activity today -> current streak becomes 1', async () => {
  const now = '2026-10-28T15:00:00.000Z';
  const timeZone = 'America/New_York';

  const outcome = await recordCompletedAttemptWithPersistence({
    currentAttempts: [],
    candidateAttempt: createAttempt({
      id: 'att-day1-first',
      lessonId: 'a1-sci-solar-lamps',
      updatedAt: now,
      createdAt: now,
    }),
    streakOptions: { now, timeZone },
  });

  assert.equal(outcome.persisted, true);
  assert.equal(outcome.duplicateIgnored, false);
  assert.equal(outcome.streak.currentStreak, 1);
  assert.equal(outcome.streak.longestStreak, 1);
  assert.equal(outcome.streak.studiedToday, true);
  assert.equal(outcome.streak.lastActiveDate, '2026-10-28');
  assert.equal(outcome.streak.completedCount, 1);
});

test('Scenario 2: Completing a second and third passage on the same day keeps the streak at 1', async () => {
  const timeZone = 'America/New_York';
  const a1 = createAttempt({
    id: 'att-1',
    lessonId: 'lesson-1',
    updatedAt: '2026-10-28T13:10:00.000Z', // 09:10 EDT
  });
  const a2 = createAttempt({
    id: 'att-2',
    lessonId: 'lesson-2',
    updatedAt: '2026-10-28T17:30:00.000Z', // 13:30 EDT
  });
  const a3 = createAttempt({
    id: 'att-3',
    lessonId: 'lesson-3',
    updatedAt: '2026-10-28T22:45:00.000Z', // 18:45 EDT
  });

  const summary = calculateReadingStreak([a1, a2, a3], {
    now: '2026-10-28T23:00:00.000Z',
    timeZone,
  });

  assert.equal(summary.currentStreak, 1);
  assert.equal(summary.longestStreak, 1);
  assert.equal(summary.studiedToday, true);
  assert.deepEqual(summary.activeDates, ['2026-10-28']);
  assert.equal(summary.completedCount, 3);
});

test('Scenario 3: Completing a qualifying activity on the next calendar day increments the streak to 2 (and preserves streak earlier on Day 2 before studying)', () => {
  const timeZone = 'America/New_York';
  const day1Attempt = createAttempt({
    id: 'att-day1',
    lessonId: 'lesson-1',
    updatedAt: '2026-10-27T16:00:00.000Z', // Oct 27 12:00 EDT
  });

  // On the morning of Oct 28 BEFORE studying today, streak from yesterday is still active (1), studiedToday is false
  const beforeStudyingDay2 = calculateReadingStreak([day1Attempt], {
    now: '2026-10-28T13:00:00.000Z', // Oct 28 09:00 EDT
    timeZone,
  });
  assert.equal(beforeStudyingDay2.currentStreak, 1);
  assert.equal(beforeStudyingDay2.longestStreak, 1);
  assert.equal(beforeStudyingDay2.studiedToday, false);

  // After completing a passage on Oct 28, streak becomes 2 and studiedToday becomes true
  const day2Attempt = createAttempt({
    id: 'att-day2',
    lessonId: 'lesson-2',
    updatedAt: '2026-10-28T18:00:00.000Z', // Oct 28 14:00 EDT
  });
  const afterStudyingDay2 = calculateReadingStreak([day2Attempt, day1Attempt], {
    now: '2026-10-28T18:05:00.000Z',
    timeZone,
  });
  assert.equal(afterStudyingDay2.currentStreak, 2);
  assert.equal(afterStudyingDay2.longestStreak, 2);
  assert.equal(afterStudyingDay2.studiedToday, true);
  assert.deepEqual(afterStudyingDay2.activeDates, ['2026-10-27', '2026-10-28']);
});

test('Scenario 4: Studying after missing one full calendar day resets current streak to 1 while preserving longestStreak', () => {
  const timeZone = 'America/New_York';
  const oct24 = createAttempt({
    id: 'att-oct24',
    lessonId: 'lesson-1',
    updatedAt: '2026-10-24T15:00:00.000Z',
  });
  const oct25 = createAttempt({
    id: 'att-oct25',
    lessonId: 'lesson-2',
    updatedAt: '2026-10-25T15:00:00.000Z',
  });
  const oct26 = createAttempt({
    id: 'att-oct26',
    lessonId: 'lesson-3',
    updatedAt: '2026-10-26T15:00:00.000Z',
  });
  // Missed Oct 27 completely!

  // On Oct 28 BEFORE studying, currentStreak must be 0 because Oct 27 was missed, longestStreak remains 3
  const beforeReturn = calculateReadingStreak([oct26, oct25, oct24], {
    now: '2026-10-28T14:00:00.000Z',
    timeZone,
  });
  assert.equal(beforeReturn.currentStreak, 0);
  assert.equal(beforeReturn.longestStreak, 3);
  assert.equal(beforeReturn.studiedToday, false);

  // When learner studies on Oct 28, currentStreak restarts at 1 and longestStreak stays 3
  const oct28 = createAttempt({
    id: 'att-oct28',
    lessonId: 'lesson-4',
    updatedAt: '2026-10-28T16:00:00.000Z',
  });
  const afterReturn = calculateReadingStreak([oct28, oct26, oct25, oct24], {
    now: '2026-10-28T16:05:00.000Z',
    timeZone,
  });
  assert.equal(afterReturn.currentStreak, 1);
  assert.equal(afterReturn.longestStreak, 3);
  assert.equal(afterReturn.studiedToday, true);
  assert.equal(afterReturn.lastActiveDate, '2026-10-28');
});

test('Scenario 5: Dashboard refresh preserves streak across Firestore Timestamp objects and JSON-serialized localStorage timestamps', () => {
  const timeZone = 'UTC';
  // Simulate raw Firestore snapshot documents where createdAt/updatedAt are Firestore Timestamp instances
  // and answers/questionTypeStats are stored as JSON strings (answersJson / questionTypeStatsJson)
  const fakeFirestoreTimestampDay1 = {
    seconds: Math.floor(Date.parse('2026-10-27T12:00:00.000Z') / 1000),
    nanoseconds: 0,
    toDate() {
      return new Date('2026-10-27T12:00:00.000Z');
    },
  };
  const fakeFirestoreTimestampDay2 = {
    seconds: Math.floor(Date.parse('2026-10-28T12:00:00.000Z') / 1000),
    nanoseconds: 500_000_000,
    toDate() {
      return new Date('2026-10-28T12:00:00.500Z');
    },
  };

  const remoteFirestoreDocs = [
    {
      id: 'att-remote-1',
      userId: 'user-123',
      lessonId: 'a1-sci-solar-lamps',
      lessonTitle: 'Solar Lamps',
      level: 'A1',
      topic: 'Science and technology',
      status: 'completed',
      score: 6,
      totalQuestions: 6,
      accuracy: 100,
      answersJson: JSON.stringify({ q1: 'True', q2: 'False' }),
      questionTypeStatsJson: JSON.stringify({
        true_false_not_given: { correct: 6, total: 6 },
      }),
      createdAt: fakeFirestoreTimestampDay1,
      updatedAt: fakeFirestoreTimestampDay1,
    },
    {
      id: 'att-remote-2',
      userId: 'user-123',
      lessonId: 'b1-sci-sodium-batteries',
      lessonTitle: 'Sodium Batteries',
      level: 'B1',
      topic: 'Science and technology',
      status: 'completed',
      score: 5,
      totalQuestions: 6,
      accuracy: 83,
      answersJson: JSON.stringify({ q1: 'B' }),
      questionTypeStatsJson: JSON.stringify({
        multiple_choice: { correct: 5, total: 6 },
      }),
      createdAt: fakeFirestoreTimestampDay2,
      updatedAt: fakeFirestoreTimestampDay2,
    },
  ];

  // 1. Merge remote Firestore docs on listener snapshot
  const merged = mergeAndNormalizeAttempts([], remoteFirestoreDocs, 'user-123');
  assert.equal(merged.length, 2);
  assert.equal(typeof merged[0].updatedAt, 'string');
  assert.deepEqual(merged[1].answers, { q1: 'True', q2: 'False' });

  const streakFromSnapshot = calculateReadingStreak(merged, {
    now: '2026-10-28T18:00:00.000Z',
    timeZone,
  });
  assert.equal(streakFromSnapshot.currentStreak, 2);
  assert.equal(streakFromSnapshot.longestStreak, 2);
  assert.equal(streakFromSnapshot.studiedToday, true);

  // 2. Simulate page refresh after previously broken localStorage state (where Timestamp was JSON.stringify'd into { seconds, nanoseconds })
  const legacyCorruptedLocalStorage = JSON.parse(JSON.stringify(remoteFirestoreDocs));
  const repairedOnHydration = mergeAndNormalizeAttempts(
    legacyCorruptedLocalStorage,
    [],
    'user-123'
  );
  const streakAfterRefresh = calculateReadingStreak(repairedOnHydration, {
    now: '2026-10-28T18:00:00.000Z',
    timeZone,
  });
  assert.equal(streakAfterRefresh.currentStreak, 2);
  assert.equal(streakAfterRefresh.longestStreak, 2);
  assert.equal(streakAfterRefresh.studiedToday, true);
});

test('Scenario 6: Reopening a previously completed passage (review mode or opening in_progress) does not create duplicate streak activity', async () => {
  const timeZone = 'UTC';
  const existingCompleted = createAttempt({
    id: 'att-day1',
    lessonId: 'lesson-1',
    status: 'completed',
    attemptType: 'first',
    updatedAt: '2026-10-27T15:00:00.000Z',
  });

  // 1. Reopening in Review mode on the next day must NOT record a new attempt or advance streak
  const reviewOutcome = await recordCompletedAttemptWithPersistence({
    currentAttempts: [existingCompleted],
    candidateAttempt: createAttempt({
      id: 'att-review-day2',
      lessonId: 'lesson-1',
      status: 'completed',
      attemptType: 'review',
      updatedAt: '2026-10-28T15:00:00.000Z',
    }),
    streakOptions: { now: '2026-10-28T15:05:00.000Z', timeZone },
  });

  assert.equal(reviewOutcome.persisted, false);
  assert.equal(reviewOutcome.duplicateIgnored, true);
  assert.equal(reviewOutcome.attempts.length, 1);
  assert.equal(reviewOutcome.streak.currentStreak, 1);
  assert.equal(reviewOutcome.streak.studiedToday, false);

  // 2. Merely opening a new passage (creating an 'in_progress' record) must NOT count as completed study
  const inProgressAttempt = createAttempt({
    id: 'att-open-only',
    lessonId: 'lesson-2',
    status: 'in_progress',
    attemptType: 'first',
    score: 0,
    accuracy: 0,
    updatedAt: '2026-10-28T15:10:00.000Z',
  });
  assert.equal(isQualifyingStreakAttempt(inProgressAttempt), false);

  const streakWithInProgress = calculateReadingStreak([inProgressAttempt, existingCompleted], {
    now: '2026-10-28T15:15:00.000Z',
    timeZone,
  });
  assert.equal(streakWithInProgress.currentStreak, 1);
  assert.equal(streakWithInProgress.studiedToday, false);
  assert.equal(streakWithInProgress.completedCount, 1);
});

test('Scenario 7: A failed Firestore write does not falsely report a persisted streak', async () => {
  const now = '2026-10-28T15:00:00.000Z';
  const timeZone = 'UTC';

  const failedOutcome = await recordCompletedAttemptWithPersistence({
    currentAttempts: [],
    candidateAttempt: createAttempt({
      id: 'att-cloud-fail',
      lessonId: 'lesson-1',
      updatedAt: now,
    }),
    persistToCloud: async () => {
      throw new Error('PERMISSION_DENIED: Simulated Firestore write failure');
    },
    streakOptions: { now, timeZone },
  });

  assert.equal(failedOutcome.persisted, false);
  assert.ok(failedOutcome.error?.includes('PERMISSION_DENIED'));
  assert.equal(failedOutcome.attempts.length, 0);
  assert.equal(failedOutcome.streak.currentStreak, 0);
  assert.equal(failedOutcome.streak.studiedToday, false);
  assert.equal(failedOutcome.streak.completedCount, 0);
});

test('Scenario 8: Two concurrent activity submissions on the same day do not increment the streak twice or create duplicate first-time records', async () => {
  const now = '2026-10-28T15:00:00.000Z';
  const timeZone = 'UTC';
  let cloudWriteCount = 0;

  const candidate = createAttempt({
    id: 'att-concurrent-1',
    userId: 'user-concurrent',
    lessonId: 'lesson-concurrent',
    attemptType: 'first',
    updatedAt: now,
  });

  const slowCloudPersist = async () => {
    cloudWriteCount += 1;
    await new Promise((resolve) => setTimeout(resolve, 25));
  };

  const [res1, res2] = await Promise.all([
    recordCompletedAttemptWithPersistence({
      currentAttempts: [],
      candidateAttempt: candidate,
      persistToCloud: slowCloudPersist,
      streakOptions: { now, timeZone },
    }),
    recordCompletedAttemptWithPersistence({
      currentAttempts: [],
      candidateAttempt: { ...candidate, id: 'att-concurrent-2' },
      persistToCloud: slowCloudPersist,
      streakOptions: { now, timeZone },
    }),
  ]);

  assert.equal(cloudWriteCount, 1, 'Concurrent duplicate submission must only write to Firestore once');
  assert.equal(res1.streak.currentStreak, 1);
  assert.equal(res2.streak.currentStreak, 1);
  assert.equal(res2.duplicateIgnored, true);
  assert.equal(res1.attempts.length, 1);
});

test('Scenario 9: Activity near midnight and across DST transitions is assigned to the intended local calendar day', () => {
  const timeZone = 'America/New_York';

  // 1. Late-night activity at 23:50 EDT on Oct 27 (which is already 03:50 UTC on Oct 28!)
  // followed by activity at 00:10 EDT on Oct 28 (04:10 UTC on Oct 28).
  // In UTC both timestamps fall on 2026-10-28, which would wrongly produce a 1-day streak.
  // In the learner's local timezone (America/New_York), they are on 2026-10-27 and 2026-10-28 -> 2-day streak!
  const lateNightOct27Local = createAttempt({
    id: 'att-late-oct27',
    lessonId: 'lesson-1',
    updatedAt: '2026-10-28T03:50:00.000Z', // 2026-10-27 23:50:00 EDT
  });
  const justAfterMidnightOct28Local = createAttempt({
    id: 'att-early-oct28',
    lessonId: 'lesson-2',
    updatedAt: '2026-10-28T04:10:00.000Z', // 2026-10-28 00:10:00 EDT
  });

  assert.equal(
    toLocalCalendarDateKey(lateNightOct27Local.updatedAt, timeZone),
    '2026-10-27'
  );
  assert.equal(
    toLocalCalendarDateKey(justAfterMidnightOct28Local.updatedAt, timeZone),
    '2026-10-28'
  );

  const midnightStreak = calculateReadingStreak(
    [justAfterMidnightOct28Local, lateNightOct27Local],
    {
      now: '2026-10-28T04:15:00.000Z', // 2026-10-28 00:15:00 EDT
      timeZone,
    }
  );
  assert.equal(midnightStreak.currentStreak, 2);
  assert.equal(midnightStreak.longestStreak, 2);
  assert.equal(midnightStreak.studiedToday, true);

  // 2. Two activities on the SAME local evening (23:15 EDT and 23:55 EDT on Oct 28)
  const sameNight1 = createAttempt({
    id: 'att-night-1',
    lessonId: 'lesson-3',
    updatedAt: '2026-10-29T03:15:00.000Z', // 2026-10-28 23:15 EDT
  });
  const sameNight2 = createAttempt({
    id: 'att-night-2',
    lessonId: 'lesson-4',
    updatedAt: '2026-10-29T03:55:00.000Z', // 2026-10-28 23:55 EDT
  });
  const sameNightStreak = calculateReadingStreak([sameNight1, sameNight2], {
    now: '2026-10-29T03:58:00.000Z', // 2026-10-28 23:58 EDT
    timeZone,
  });
  assert.equal(sameNightStreak.currentStreak, 1);
  assert.equal(sameNightStreak.studiedToday, true);

  // 3. Daylight Saving Time (DST) Spring-Forward boundary in America/New_York (March 8, 2026 — 23-hour day)
  const dstDayBefore = createAttempt({
    id: 'att-dst-1',
    lessonId: 'lesson-dst-1',
    updatedAt: '2026-03-08T04:30:00.000Z', // 2026-03-07 23:30 EST
  });
  const dstSpringForwardDay = createAttempt({
    id: 'att-dst-2',
    lessonId: 'lesson-dst-2',
    updatedAt: '2026-03-08T08:30:00.000Z', // 2026-03-08 04:30 EDT (only 4 hours later in real time!)
  });
  const dstDayAfter = createAttempt({
    id: 'att-dst-3',
    lessonId: 'lesson-dst-3',
    updatedAt: '2026-03-09T15:00:00.000Z', // 2026-03-09 11:00 EDT
  });

  const dstStreak = calculateReadingStreak([dstDayAfter, dstSpringForwardDay, dstDayBefore], {
    now: '2026-03-09T16:00:00.000Z',
    timeZone,
  });
  assert.equal(dstStreak.currentStreak, 3);
  assert.equal(dstStreak.longestStreak, 3);
  assert.deepEqual(dstStreak.activeDates, ['2026-03-07', '2026-03-08', '2026-03-09']);
  assert.equal(diffCalendarDays('2026-03-07', '2026-03-08'), 1);
  assert.equal(addCalendarDays('2026-03-07', 1), '2026-03-08');
});

test('Scenario 11: Reading history and streak records remain consistent across first-time, practice, and in-progress attempts', async () => {
  const timeZone = 'UTC';
  let history: LessonAttempt[] = [];

  // Step 1: User starts (previews) Lesson 1 -> creates in_progress attempt
  const inProgressL1 = createAttempt({
    id: 'att-l1',
    lessonId: 'lesson-1',
    status: 'in_progress',
    attemptType: 'first',
    score: 0,
    accuracy: 0,
    updatedAt: '2026-10-26T10:00:00.000Z',
    createdAt: '2026-10-26T10:00:00.000Z',
  });
  history = [inProgressL1];
  let streak = calculateReadingStreak(history, {
    now: '2026-10-26T10:05:00.000Z',
    timeZone,
  });
  assert.equal(streak.completedCount, 0);
  assert.equal(streak.currentStreak, 0);

  // Step 2: User completes Lesson 1 on Oct 26 -> replaces in_progress attempt with completed attempt
  const step2 = await recordCompletedAttemptWithPersistence({
    currentAttempts: history,
    candidateAttempt: {
      ...inProgressL1,
      status: 'completed',
      score: 5,
      accuracy: 83,
      updatedAt: '2026-10-26T10:15:00.000Z',
    },
    streakOptions: { now: '2026-10-26T10:15:00.000Z', timeZone },
  });
  history = step2.attempts;
  assert.equal(history.length, 1, 'In-progress attempt must be replaced by completed attempt');
  assert.equal(history[0].status, 'completed');
  assert.equal(step2.streak.completedCount, 1);
  assert.equal(step2.streak.currentStreak, 1);

  // Step 3: User practices Lesson 1 again on Oct 27 -> practice attempt recorded with att-prac- prefix,
  // unique completed lessons remains 1, streak advances to 2 consecutive days
  const step3 = await recordCompletedAttemptWithPersistence({
    currentAttempts: history,
    candidateAttempt: createAttempt({
      id: 'att-l1-practice',
      lessonId: 'lesson-1',
      status: 'completed',
      attemptType: 'practice',
      score: 6,
      accuracy: 100,
      updatedAt: '2026-10-27T11:00:00.000Z',
    }),
    streakOptions: { now: '2026-10-27T11:05:00.000Z', timeZone },
  });
  history = step3.attempts;
  assert.equal(history.length, 2);
  assert.ok(history[0].id.startsWith('att-prac-'));
  assert.equal(history[0].attemptType, 'practice');
  assert.equal(step3.streak.completedCount, 1, 'Unique completed lessons count remains 1');
  assert.equal(step3.streak.firstTimeCompletedCount, 1);
  assert.equal(step3.streak.currentStreak, 2, 'Practice completion on Day 2 extends daily streak to 2');

  // Verify round-trip through Firestore normalization preserves 'practice' type via att-prac- ID
  const roundTrip = normalizeLessonAttempt({
    id: history[0].id,
    userId: history[0].userId,
    lessonId: history[0].lessonId,
    lessonTitle: history[0].lessonTitle,
    level: history[0].level,
    topic: history[0].topic,
    status: history[0].status,
    score: history[0].score,
    totalQuestions: history[0].totalQuestions,
    accuracy: history[0].accuracy,
    answersJson: JSON.stringify(history[0].answers),
    questionTypeStatsJson: JSON.stringify(history[0].questionTypeStats),
    createdAt: history[0].createdAt,
    updatedAt: history[0].updatedAt,
  });
  assert.ok(roundTrip);
  assert.equal(roundTrip.attemptType, 'practice');
});

test('Scenario 12: Placement-test diagnostic activity does not count toward the regular reading streak', async () => {
  const now = '2026-10-28T15:00:00.000Z';
  const timeZone = 'UTC';

  const diagAttempt = createAttempt({
    id: 'att-diag-1',
    lessonId: 'diag-b1-1',
    lessonTitle: 'Diagnostic B1 Passage',
    status: 'completed',
    updatedAt: now,
  });

  assert.equal(isQualifyingStreakAttempt(diagAttempt), false);

  const summary = calculateReadingStreak([diagAttempt], { now, timeZone });
  assert.equal(summary.currentStreak, 0);
  assert.equal(summary.longestStreak, 0);
  assert.equal(summary.studiedToday, false);
  assert.equal(summary.completedCount, 0);

  const outcome = await recordCompletedAttemptWithPersistence({
    currentAttempts: [],
    candidateAttempt: diagAttempt,
    streakOptions: { now, timeZone },
  });
  assert.equal(outcome.persisted, false);
  assert.equal(outcome.duplicateIgnored, true);
  assert.equal(outcome.streak.currentStreak, 0);
});

test('Scenario 13: Practice-attempt persistence via docId fallback and strict att-prac- precedence never misclassifies practice attempts or leaves stale in_progress records', () => {
  // 1. Even if d.data() omitted `id` and only `docId` / `fallbackDocId` was supplied from Firestore snapshot `d.id`,
  // and even if a stale local record had `attemptType: "first"`, an `att-prac-` ID must always normalize to `practice`.
  const normalizedFromDocId = normalizeLessonAttempt(
    {
      docId: 'att-prac-1730120000-xyz',
      userId: 'user-123',
      lessonId: 'b1-sci-sodium-batteries',
      lessonTitle: 'Sodium Batteries',
      level: 'B1',
      topic: 'Science and technology',
      status: 'completed',
      attemptType: 'first', // contradictory field must be overridden by att-prac- prefix
      score: 6,
      totalQuestions: 6,
      accuracy: 100,
      answersJson: '{"q1":"A"}',
      questionTypeStatsJson: '{"multiple_choice":{"correct":6,"total":6}}',
      createdAt: '2026-10-28T10:00:00.000Z',
      updatedAt: '2026-10-28T10:05:00.000Z',
    },
    'user-123'
  );

  assert.ok(normalizedFromDocId);
  assert.equal(normalizedFromDocId.id, 'att-prac-1730120000-xyz');
  assert.equal(normalizedFromDocId.attemptType, 'practice');

  // 2. When merging local stale `in_progress` attempt with remote `completed` attempt for the same lesson,
  // the stale `in_progress` placeholder is automatically removed.
  const staleLocalInProgress = createAttempt({
    id: 'att-local-inprog',
    userId: 'user-123',
    lessonId: 'b1-sci-sodium-batteries',
    status: 'in_progress',
    attemptType: 'first',
    updatedAt: '2026-10-28T09:00:00.000Z',
  });
  const remoteCompletedFirst = {
    docId: 'att-remote-completed',
    userId: 'user-123',
    lessonId: 'b1-sci-sodium-batteries',
    lessonTitle: 'Sodium Batteries',
    level: 'B1',
    topic: 'Science and technology',
    status: 'completed',
    score: 5,
    totalQuestions: 6,
    accuracy: 83,
    answersJson: '{"q1":"B"}',
    questionTypeStatsJson: '{}',
    createdAt: '2026-10-28T09:30:00.000Z',
    updatedAt: '2026-10-28T09:35:00.000Z',
  };

  const merged = mergeAndNormalizeAttempts(
    [staleLocalInProgress],
    [remoteCompletedFirst, normalizedFromDocId],
    'user-123'
  );
  assert.equal(merged.length, 2, 'Stale in_progress attempt for completed lesson must be removed');
  assert.equal(merged.some((a) => a.status === 'in_progress'), false);

  const streak = calculateReadingStreak(merged, {
    now: '2026-10-28T12:00:00.000Z',
    timeZone: 'UTC',
  });
  assert.equal(streak.completedCount, 1);
  assert.equal(streak.firstTimeCompletedCount, 1);
  assert.equal(streak.currentStreak, 1);
});

test('Scenario 14: Concurrent submissions of two distinct legitimate lessons on the same day preserve both attempts without data loss', async () => {
  const now = '2026-10-28T15:00:00.000Z';
  const timeZone = 'UTC';
  const persistedIds: string[] = [];

  const attemptLessonA = createAttempt({
    id: 'att-lesson-a',
    userId: 'user-concurrent-distinct',
    lessonId: 'a1-sci-solar-lamps',
    lessonTitle: 'Solar Lamps',
    attemptType: 'first',
    updatedAt: '2026-10-28T14:00:00.000Z',
  });

  const attemptLessonB = createAttempt({
    id: 'att-lesson-b',
    userId: 'user-concurrent-distinct',
    lessonId: 'b1-sci-sodium-batteries',
    lessonTitle: 'Sodium Batteries',
    attemptType: 'first',
    updatedAt: '2026-10-28T14:30:00.000Z',
  });

  // Both calls pass the same initial empty `currentAttempts: []` snapshot while running concurrently
  const [outcomeA, outcomeB] = await Promise.all([
    recordCompletedAttemptWithPersistence({
      currentAttempts: [],
      candidateAttempt: attemptLessonA,
      persistToCloud: async (att) => {
        await new Promise((r) => setTimeout(r, 20));
        persistedIds.push(att.id);
      },
      streakOptions: { now, timeZone },
    }),
    recordCompletedAttemptWithPersistence({
      currentAttempts: [],
      candidateAttempt: attemptLessonB,
      persistToCloud: async (att) => {
        await new Promise((r) => setTimeout(r, 10));
        persistedIds.push(att.id);
      },
      streakOptions: { now, timeZone },
    }),
  ]);

  assert.equal(persistedIds.length, 2, 'Both distinct lessons must be persisted to Firestore');
  assert.equal(outcomeA.persisted, true);
  assert.equal(outcomeB.persisted, true);
  assert.equal(outcomeB.attempts.length, 2, 'Second concurrent resolution must contain both lessons');
  assert.equal(outcomeB.streak.completedCount, 2, 'Both unique lessons must be counted');
  assert.equal(outcomeB.streak.currentStreak, 1, 'Same-day concurrent completions count as 1 streak day');
});

test('Scenario 15: A rejected cloud persistence promise releases the in-flight lock so a subsequent retry succeeds cleanly', async () => {
  const now = '2026-10-28T15:00:00.000Z';
  const timeZone = 'UTC';
  let attemptCount = 0;

  const candidate = createAttempt({
    id: 'att-retry-test',
    userId: 'user-retry',
    lessonId: 'lesson-retry',
    attemptType: 'first',
    updatedAt: now,
  });

  // 1st attempt fails in Firestore
  const firstTry = await recordCompletedAttemptWithPersistence({
    currentAttempts: [],
    candidateAttempt: candidate,
    persistToCloud: async () => {
      attemptCount += 1;
      throw new Error('UNAVAILABLE: Network timeout');
    },
    streakOptions: { now, timeZone },
  });

  assert.equal(firstTry.persisted, false);
  assert.equal(firstTry.attempts.length, 0);
  assert.equal(firstTry.streak.currentStreak, 0);

  // 2nd attempt (retry of the exact same attempt) must NOT be blocked by a stale lock and must succeed
  const secondTry = await recordCompletedAttemptWithPersistence({
    currentAttempts: firstTry.attempts,
    candidateAttempt: candidate,
    persistToCloud: async () => {
      attemptCount += 1;
    },
    streakOptions: { now, timeZone },
  });

  assert.equal(attemptCount, 2);
  assert.equal(secondTry.persisted, true);
  assert.equal(secondTry.duplicateIgnored, false);
  assert.equal(secondTry.attempts.length, 1);
  assert.equal(secondTry.streak.currentStreak, 1);
  assert.equal(secondTry.streak.studiedToday, true);
});

test('Scenario 16: Duplicate submission of an already-completed practice attempt is ignored without re-writing to Firestore, while new practice attempts get collision-free IDs', async () => {
  const now = '2026-10-28T15:00:00.000Z';
  const timeZone = 'UTC';
  let cloudWrites = 0;

  const completedFirst = createAttempt({
    id: 'att-first-1',
    userId: 'user-prac-idem',
    lessonId: 'lesson-1',
    attemptType: 'first',
    updatedAt: '2026-10-27T12:00:00.000Z',
  });

  const practice1 = await recordCompletedAttemptWithPersistence({
    currentAttempts: [completedFirst],
    candidateAttempt: createAttempt({
      id: 'att-prac-explicit-1',
      userId: 'user-prac-idem',
      lessonId: 'lesson-1',
      attemptType: 'practice',
      updatedAt: now,
    }),
    persistToCloud: async () => {
      cloudWrites += 1;
    },
    streakOptions: { now, timeZone },
  });

  assert.equal(practice1.persisted, true);
  assert.equal(cloudWrites, 1);
  assert.equal(practice1.persistedAttempt?.id, 'att-prac-explicit-1');

  // Re-submitting the exact same completed practice attempt ID must be idempotent and NOT call persistToCloud again
  const duplicatePractice1 = await recordCompletedAttemptWithPersistence({
    currentAttempts: practice1.attempts,
    candidateAttempt: createAttempt({
      id: 'att-prac-explicit-1',
      userId: 'user-prac-idem',
      lessonId: 'lesson-1',
      attemptType: 'practice',
      updatedAt: now,
    }),
    persistToCloud: async () => {
      cloudWrites += 1;
    },
    streakOptions: { now, timeZone },
  });

  assert.equal(duplicatePractice1.duplicateIgnored, true);
  assert.equal(cloudWrites, 1, 'Must not re-write an already-completed practice attempt to Firestore');
});

test('Scenario 17: Cross-user isolation and adaptive recommendation metrics stay consistent with streak completedCount', async () => {
  const { computeAdaptiveRecommendation } = await import('./adaptiveEngine');

  // 1. Cross-user isolation: when User B signs in with 0 remote attempts, User A's cached local attempts are purged
  const userAAttempt = createAttempt({
    id: 'att-user-a',
    userId: 'uid-user-a',
    lessonId: 'b1-sci-sodium-batteries',
    level: 'B1',
    status: 'completed',
  });

  const mergedForUserB = mergeAndNormalizeAttempts([userAAttempt], [], 'uid-user-b');
  assert.equal(mergedForUserB.length, 0, 'User A attempts must never leak into User B session');

  // 2. Consistent metrics across Dashboard, Preview, History, and Progress & Level:
  // 1 completed B1 passage + 2 practice attempts of that same B1 passage + 1 in_progress B1 passage + 1 review record
  const b1First = createAttempt({
    id: 'att-b1-first',
    userId: 'uid-user-a',
    lessonId: 'b1-sci-sodium-batteries',
    level: 'B1',
    status: 'completed',
    attemptType: 'first',
    accuracy: 80,
    updatedAt: '2026-10-27T10:00:00.000Z',
  });
  const b1Prac1 = createAttempt({
    id: 'att-prac-b1-1',
    userId: 'uid-user-a',
    lessonId: 'b1-sci-sodium-batteries',
    level: 'B1',
    status: 'completed',
    attemptType: 'practice',
    accuracy: 100,
    updatedAt: '2026-10-28T10:00:00.000Z',
  });
  const b1InProgress = createAttempt({
    id: 'att-b1-inprog',
    userId: 'uid-user-a',
    lessonId: 'b1-other-lesson',
    level: 'B1',
    status: 'in_progress',
    attemptType: 'first',
    accuracy: 0,
    updatedAt: '2026-10-28T11:00:00.000Z',
  });

  const allAttempts = [b1InProgress, b1Prac1, b1First];
  const streak = calculateReadingStreak(allAttempts, {
    now: '2026-10-28T12:00:00.000Z',
    timeZone: 'UTC',
  });
  const rec = computeAdaptiveRecommendation('B1', allAttempts, []);

  assert.equal(streak.completedCount, 1, 'Streak completedCount must be 1 unique completed passage');
  assert.equal(
    rec.completedAtCurrentLevel,
    1,
    'Adaptive recommendation completedAtCurrentLevel must also be 1 (excluding practice and in_progress)'
  );
  assert.equal(streak.currentStreak, 2, 'First completion on Oct 27 + practice completion on Oct 28 = 2-day streak');
});

function createTestLesson(id: string, level: ReadingLesson['level'] = 'B1'): ReadingLesson {
  return {
    id,
    title: `Title for ${id}`,
    level,
    topic: 'Science and technology',
    status: 'published',
    estimatedMinutes: 5,
    introduction: 'Test introduction.',
    passage: 'Paragraph 1 of the passage. Paragraph 2 with academic details.',
    illustrationUrl: '/images/passages/test.png',
    illustrationAlt: 'Test illustration',
    vocabulary: [],
    questions: [
      { id: 'q1', type: 'multiple_choice', prompt: 'Q1', options: ['A', 'B', 'C', 'D'], correctAnswer: 'A', acceptedAnswers: ['A'], explanation: 'E1', passageEvidence: 'Paragraph 1' },
      { id: 'q2', type: 'multiple_choice', prompt: 'Q2', options: ['A', 'B', 'C', 'D'], correctAnswer: 'B', acceptedAnswers: ['B'], explanation: 'E2', passageEvidence: 'Paragraph 1' },
      { id: 'q3', type: 'multiple_choice', prompt: 'Q3', options: ['A', 'B', 'C', 'D'], correctAnswer: 'C', acceptedAnswers: ['C'], explanation: 'E3', passageEvidence: 'Paragraph 1' },
      { id: 'q4', type: 'multiple_choice', prompt: 'Q4', options: ['A', 'B', 'C', 'D'], correctAnswer: 'D', acceptedAnswers: ['D'], explanation: 'E4', passageEvidence: 'Paragraph 2' },
      { id: 'q5', type: 'true_false_not_given', prompt: 'Q5', options: ['True', 'False', 'Not Given'], correctAnswer: 'True', acceptedAnswers: ['True'], explanation: 'E5', passageEvidence: 'Paragraph 2' },
      { id: 'q6', type: 'short_answer', prompt: 'Q6', correctAnswer: 'academic', acceptedAnswers: ['academic'], explanation: 'E6', passageEvidence: 'Paragraph 2' },
    ],
    createdAt: '2026-10-01T00:00:00.000Z',
    updatedAt: '2026-10-01T00:00:00.000Z',
  };
}

test('Unfinished Passage Persistence (Scenarios 1-7): Logout with 4/6 answers, login again, restore exact Passage A + 4 answers, answer remaining 2, complete Passage A, then assign Passage B', async () => {
  const userId = 'uid-learner-1';
  const profile = createAdaptiveProfile('B1');
  const lessons = [
    createTestLesson('b1-passage-a', 'B1'),
    createTestLesson('b1-passage-b', 'B1'),
    createTestLesson('b1-passage-c', 'B1'),
  ];

  // Simulated Firestore cloud store for attempts/{attemptId}
  const cloudFirestoreDocs = new Map<string, Record<string, unknown>>();
  const persistInProgressToFirestore = async (attempt: LessonAttempt) => {
    const existing = cloudFirestoreDocs.get(attempt.id);
    cloudFirestoreDocs.set(attempt.id, {
      id: attempt.id,
      userId: attempt.userId,
      lessonId: attempt.lessonId,
      lessonTitle: attempt.lessonTitle,
      level: attempt.level,
      topic: attempt.topic,
      status: attempt.status,
      attemptType: attempt.attemptType || 'first',
      score: attempt.score,
      totalQuestions: attempt.totalQuestions,
      accuracy: attempt.accuracy,
      answersJson: JSON.stringify(attempt.answers || {}),
      questionTypeStatsJson: JSON.stringify(attempt.questionTypeStats || {}),
      createdAt: existing?.createdAt || attempt.createdAt,
      updatedAt: attempt.updatedAt,
    });
  };

  // Step 1: Learner logs in and receives Passage A
  const initialAssign = await ensureOrRestoreUnfinishedAttempt({
    userId,
    profile,
    lessons,
    currentAttempts: [],
    persistInProgressToCloud: persistInProgressToFirestore,
  });
  assert.equal(initialAssign.createdNew, true);
  assert.equal(initialAssign.restoredExisting, false);
  const passageAId = initialAssign.lesson!.id;
  assert.ok(passageAId);
  assert.equal(initialAssign.attempt?.id, buildDeterministicFirstAttemptId(userId, passageAId));
  assert.equal(initialAssign.attempt?.status, 'in_progress');

  let activeLocalAttempts = initialAssign.attempts;

  // Step 2 & 3: Learner starts reading Passage A and answers 4 out of 6 questions
  const partialAnswers = {
    q1: 'A',
    q2: 'B',
    q3: 'C',
    q4: 'D',
  };
  const afterFourAnswers = await updateInProgressAttemptAnswers({
    userId,
    attemptId: initialAssign.attempt!.id,
    lessonId: passageAId,
    answers: partialAnswers,
    currentAttempts: activeLocalAttempts,
    persistAnswersToCloud: persistInProgressToFirestore,
  });
  activeLocalAttempts = afterFourAnswers.attempts;
  assert.deepEqual(afterFourAnswers.attempt?.answers, partialAnswers);

  // Step 4: Learner signs out -> local browser cache is completely wiped, cloud Firestore retains in_progress doc
  activeLocalAttempts = [];
  assert.equal(cloudFirestoreDocs.size, 1);

  // Step 5: Learner signs in again -> Firestore snapshot delivers persisted attempts
  const remoteSnapshotDocs = Array.from(cloudFirestoreDocs.values());
  const hydratedAfterLogin = mergeAndNormalizeAttempts([], remoteSnapshotDocs, userId);

  // Step 6: FluentLoop restores Passage A with the 4 previously selected answers
  const restoredUnfinished = findActiveUnfinishedAttempt(hydratedAfterLogin, userId, profile.currentLevel);
  assert.ok(restoredUnfinished, 'Unfinished attempt must be restored after sign-in');
  assert.equal(restoredUnfinished.lessonId, passageAId, 'Must restore exact same Passage A');
  assert.deepEqual(restoredUnfinished.answers, partialAnswers, 'Must restore all 4 previously selected answers');
  assert.equal(
    selectNextLesson(profile, lessons, hydratedAfterLogin)?.id,
    passageAId,
    'selectNextLesson must also return Passage A'
  );

  // Calling ensureOrRestoreUnfinishedAttempt after login must restore Passage A, NOT create a new assignment
  const postLoginCheck = await ensureOrRestoreUnfinishedAttempt({
    userId,
    profile,
    lessons,
    currentAttempts: hydratedAfterLogin,
    persistInProgressToCloud: persistInProgressToFirestore,
  });
  assert.equal(postLoginCheck.restoredExisting, true);
  assert.equal(postLoginCheck.createdNew, false);
  assert.equal(postLoginCheck.lesson?.id, passageAId);
  assert.deepEqual(postLoginCheck.attempt?.answers, partialAnswers);

  // Step 7: Learner continues from where they stopped, answering remaining 2 questions (q5 & q6)
  const allSixAnswers = {
    ...partialAnswers,
    q5: 'True',
    q6: 'academic',
  };
  const afterAllSix = await updateInProgressAttemptAnswers({
    userId,
    attemptId: restoredUnfinished.id,
    lessonId: passageAId,
    answers: allSixAnswers,
    currentAttempts: hydratedAfterLogin,
    persistAnswersToCloud: persistInProgressToFirestore,
  });
  assert.deepEqual(afterAllSix.attempt?.answers, allSixAnswers);

  // Step 8: Learner completes and submits Passage A -> adaptive engine assigns Passage B
  const completedOutcome = await recordCompletedAttemptWithPersistence({
    currentAttempts: afterAllSix.attempts,
    candidateAttempt: {
      ...afterAllSix.attempt!,
      status: 'completed',
      score: 6,
      totalQuestions: 6,
      accuracy: 100,
      answers: allSixAnswers,
      updatedAt: '2026-10-30T16:00:00.000Z',
    },
    persistToCloud: persistInProgressToFirestore,
  });
  assert.equal(completedOutcome.persisted, true);
  assert.equal(
    findActiveUnfinishedAttempt(completedOutcome.attempts, userId),
    null,
    'No unfinished attempt should remain after completing Passage A'
  );

  const nextAssign = await ensureOrRestoreUnfinishedAttempt({
    userId,
    profile,
    lessons,
    currentAttempts: completedOutcome.attempts,
    persistInProgressToCloud: persistInProgressToFirestore,
  });
  assert.equal(nextAssign.createdNew, true);
  assert.ok(nextAssign.lesson);
  assert.notEqual(
    nextAssign.lesson.id,
    passageAId,
    'After completing Passage A, adaptive engine must assign a new passage (Passage B)'
  );
});

test('Unfinished Passage Persistence (Scenario 8): Cross-device support restores Passage A and saved answers when signing in on a second device with empty localStorage', async () => {
  const userId = 'uid-cross-device-user';
  const profile = createAdaptiveProfile('A2');
  const lessons = [createTestLesson('a2-passage-1', 'A2'), createTestLesson('a2-passage-2', 'A2')];

  // Device 1: Learner starts a2-passage-1 and answers 3 questions, persisted to Firestore
  const firestoreDocFromDevice1 = {
    id: buildDeterministicFirstAttemptId(userId, 'a2-passage-1'),
    userId,
    lessonId: 'a2-passage-1',
    lessonTitle: 'Title for a2-passage-1',
    level: 'A2',
    topic: 'Science and technology',
    status: 'in_progress',
    attemptType: 'first',
    score: 0,
    totalQuestions: 6,
    accuracy: 0,
    answersJson: JSON.stringify({ q1: 'A', q2: 'B', q3: 'C' }),
    questionTypeStatsJson: '{}',
    createdAt: '2026-10-30T10:00:00.000Z',
    updatedAt: '2026-10-30T10:08:00.000Z',
  };

  // Device 2: Brand-new browser context (empty localAttempts = []) hydrates from Firestore
  const device2Attempts = mergeAndNormalizeAttempts([], [firestoreDocFromDevice1], userId);
  const restoredOnDevice2 = findActiveUnfinishedAttempt(device2Attempts, userId, profile.currentLevel);

  assert.ok(restoredOnDevice2);
  assert.equal(restoredOnDevice2.lessonId, 'a2-passage-1');
  assert.deepEqual(restoredOnDevice2.answers, { q1: 'A', q2: 'B', q3: 'C' });
  assert.equal(selectNextLesson(profile, lessons, device2Attempts)?.id, 'a2-passage-1');
});

test('Unfinished Passage Persistence (Scenarios 9, 10, 11): Multiple concurrent auth callbacks and multiple tabs coalesce without generating duplicate or conflicting assignments', async () => {
  const userId = 'uid-concurrent-tabs';
  const profile = createAdaptiveProfile('B1');
  const lessons = [
    createTestLesson('b1-lesson-1', 'B1'),
    createTestLesson('b1-lesson-2', 'B1'),
    createTestLesson('b1-lesson-3', 'B1'),
  ];

  let cloudWriteCount = 0;
  let sharedAttempts: LessonAttempt[] = [];

  const persistToCloud = async (attempt: LessonAttempt) => {
    cloudWriteCount += 1;
    await new Promise((r) => setTimeout(r, 20));
    sharedAttempts = mergeAndNormalizeAttempts([attempt, ...sharedAttempts], [], userId);
  };

  // Simulate 3 concurrent calls (e.g. 2 auth state callbacks + 2 browser tabs requesting assignment simultaneously)
  const [call1, call2, call3] = await Promise.all([
    ensureOrRestoreUnfinishedAttempt({
      userId,
      profile,
      lessons,
      currentAttempts: sharedAttempts,
      getCurrentAttempts: () => sharedAttempts,
      persistInProgressToCloud: persistToCloud,
    }),
    ensureOrRestoreUnfinishedAttempt({
      userId,
      profile,
      lessons,
      currentAttempts: sharedAttempts,
      getCurrentAttempts: () => sharedAttempts,
      persistInProgressToCloud: persistToCloud,
    }),
    ensureOrRestoreUnfinishedAttempt({
      userId,
      profile,
      lessons,
      currentAttempts: sharedAttempts,
      getCurrentAttempts: () => sharedAttempts,
      persistInProgressToCloud: persistToCloud,
    }),
  ]);

  assert.equal(cloudWriteCount, 1, 'Must only persist a single assignment across concurrent callbacks/tabs');
  assert.equal(call1.lesson?.id, call2.lesson?.id);
  assert.equal(call2.lesson?.id, call3.lesson?.id);
  assert.equal(call1.attempt?.id, call2.attempt?.id);
  assert.equal(call2.attempt?.id, call3.attempt?.id);

  // Scenario 11: Subsequent assignment request while an unfinished assignment exists must NOT generate a new assignment
  const subsequentCall = await ensureOrRestoreUnfinishedAttempt({
    userId,
    profile,
    lessons,
    currentAttempts: sharedAttempts,
    getCurrentAttempts: () => sharedAttempts,
    persistInProgressToCloud: persistToCloud,
  });
  assert.equal(subsequentCall.restoredExisting, true);
  assert.equal(subsequentCall.createdNew, false);
  assert.equal(subsequentCall.lesson?.id, call1.lesson?.id);
  assert.equal(cloudWriteCount, 1);
});

test('Unfinished Passage Persistence (Scenarios 12, 13, 14): Strict cross-user isolation, completed passages never restored as unfinished, and placement assessment unaffected', async () => {
  const profile = createAdaptiveProfile('B1');
  const lessons = [createTestLesson('b1-shared-1', 'B1'), createTestLesson('b1-shared-2', 'B1')];

  // Scenario 12: User A's unfinished assignment must NEVER be restored for User B
  const userAUnfinished = createAttempt({
    id: buildDeterministicFirstAttemptId('uid-user-a', 'b1-shared-1'),
    userId: 'uid-user-a',
    lessonId: 'b1-shared-1',
    level: 'B1',
    status: 'in_progress',
    attemptType: 'first',
    answers: { q1: 'A', q2: 'B' },
  });

  assert.equal(
    findActiveUnfinishedAttempt([userAUnfinished], 'uid-user-b', 'B1'),
    null,
    'User B must never see or restore User A unfinished attempt'
  );
  const mergedForUserB = mergeAndNormalizeAttempts([userAUnfinished], [], 'uid-user-b');
  assert.equal(mergedForUserB.length, 0);

  // Scenario 13: Completed passages are never restored as unfinished or downgraded by stale in_progress records
  const completedAttempt = createAttempt({
    id: buildDeterministicFirstAttemptId('uid-user-a', 'b1-shared-1'),
    userId: 'uid-user-a',
    lessonId: 'b1-shared-1',
    level: 'B1',
    status: 'completed',
    attemptType: 'first',
    score: 6,
    totalQuestions: 6,
    accuracy: 100,
    answers: { q1: 'A', q2: 'B', q3: 'C', q4: 'D', q5: 'True', q6: 'academic' },
    updatedAt: '2026-10-30T15:00:00.000Z',
  });
  const staleInProgress = createAttempt({
    id: 'att-legacy-stale',
    userId: 'uid-user-a',
    lessonId: 'b1-shared-1',
    level: 'B1',
    status: 'in_progress',
    attemptType: 'first',
    answers: { q1: 'A' },
    updatedAt: '2026-10-30T14:00:00.000Z',
  });

  const mergedCompleted = mergeAndNormalizeAttempts([staleInProgress], [completedAttempt], 'uid-user-a');
  assert.equal(mergedCompleted.length, 1);
  assert.equal(mergedCompleted[0].status, 'completed');
  assert.equal(findActiveUnfinishedAttempt(mergedCompleted, 'uid-user-a', 'B1'), null);

  // Attempting to update in-progress answers on an already-completed lesson is a no-op
  const updateCompletedNoOp = await updateInProgressAttemptAnswers({
    userId: 'uid-user-a',
    lessonId: 'b1-shared-1',
    answers: { q1: 'C' },
    currentAttempts: mergedCompleted,
  });
  assert.equal(updateCompletedNoOp.attempt, null);
  assert.equal(updateCompletedNoOp.attempts[0].status, 'completed');

  // Scenario 14: Diagnostic placement passages (`diag-*`) and placement timer/abandonment remain completely isolated
  const diagAttempt = createAttempt({
    id: 'att-diag-b1-1',
    userId: 'uid-user-a',
    lessonId: 'diag-b1-1',
    level: 'B1',
    status: 'in_progress',
    attemptType: 'first',
  });
  assert.equal(
    findActiveUnfinishedAttempt([diagAttempt], 'uid-user-a', 'B1'),
    null,
    'Diagnostic placement passages must never be treated as regular reading assignments'
  );
  assert.notEqual(selectNextLesson(profile, lessons, [diagAttempt])?.id, 'diag-b1-1');
});

