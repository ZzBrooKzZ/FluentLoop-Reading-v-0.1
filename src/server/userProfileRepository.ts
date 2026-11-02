import { Timestamp } from 'firebase-admin/firestore';
import { CEFRLevel } from '../types/reading';
import {
  ADAPTIVE_PROFILE_SCHEMA_VERSION,
  AdaptiveProfile,
  applyAttemptProgression,
  createAdaptiveProfile,
  DIFFICULTY_RANGES,
  isValidAdaptiveLevel,
  normalizeAdaptiveProfile,
  ProgressionResult,
} from '../services/adaptiveLearning';
import { isAllowedPlacementLevel, MAX_PLACEMENT_LEVEL } from '../services/placementEngine';
import { getServerFirestore } from './firebaseAdmin';

export const USERS_COLLECTION = 'users';
export const ADAPTIVE_ATTEMPT_LOCKS_COLLECTION = 'adaptive_attempt_locks';

function extractIsoFromTimestampOrString(value: unknown, fallbackIso: string): string {
  if (typeof value === 'string' && value.length >= 10) {
    return value;
  }
  if (value && typeof (value as { toDate?: () => Date }).toDate === 'function') {
    try {
      return (value as { toDate: () => Date }).toDate().toISOString();
    } catch {
      return fallbackIso;
    }
  }
  if (value && typeof (value as { seconds?: number }).seconds === 'number') {
    return new Date((value as { seconds: number }).seconds * 1000).toISOString();
  }
  if (value && typeof (value as { _seconds?: number })._seconds === 'number') {
    return new Date((value as { _seconds: number })._seconds * 1000).toISOString();
  }
  return fallbackIso;
}

function toFirestoreTimestamp(value: unknown, fallbackMs: number): Timestamp {
  if (value instanceof Timestamp) {
    return value;
  }
  if (value && typeof (value as { toDate?: () => Date }).toDate === 'function') {
    try {
      return Timestamp.fromDate((value as { toDate: () => Date }).toDate());
    } catch {
      return Timestamp.fromMillis(fallbackMs);
    }
  }
  if (typeof value === 'string') {
    const parsed = Date.parse(value);
    if (Number.isFinite(parsed)) {
      return Timestamp.fromMillis(parsed);
    }
  }
  return Timestamp.fromMillis(fallbackMs);
}

export interface StoredUserAdaptiveDoc {
  uid: string;
  displayName: string;
  preferredLevel: CEFRLevel;
  startingLevel: CEFRLevel;
  placementLevel?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
  placementSessionId?: string;
  placementCompletedAt?: string;
  currentDifficultyScore: number;
  consecutivePasses: number;
  consecutiveFailures: number;
  adaptiveProfileVersion: number;
  lastProcessedAttemptId?: string;
  showArabicTranslation: boolean;
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  completedCount: number;
  averageAccuracy: number;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

export interface TestUserProfileFirestoreStore {
  users: Map<string, Record<string, unknown>>;
  attemptLocks?: Map<string, Record<string, unknown>>;
  transactionCount?: number;
  simulatedContentionRetries?: number;
}

const memoryUsersStore = new Map<string, Record<string, unknown>>();
const memoryAttemptLocksStore = new Map<string, Record<string, unknown>>();

let testUserProfileStore: TestUserProfileFirestoreStore | null = null;

export function setTestUserProfileFirestoreStoreForTests(
  store: TestUserProfileFirestoreStore | null
): void {
  testUserProfileStore = store;
}

export function clearMemoryUserProfileStoreForTests(): void {
  memoryUsersStore.clear();
  memoryAttemptLocksStore.clear();
}

interface UserProfileTransactionAdapter {
  getUserDoc(uid: string): Promise<Record<string, unknown> | null>;
  setUserDoc(uid: string, data: Record<string, unknown>): void;
  getAttemptLock(lockKey: string): Promise<Record<string, unknown> | null>;
  setAttemptLock(lockKey: string, data: Record<string, unknown>): void;
}

// Serialize in-memory / test transactions to accurately model Firestore optimistic concurrency control
let inMemoryTxQueue: Promise<unknown> = Promise.resolve();

async function runUserProfileTransaction<T>(
  fn: (tx: UserProfileTransactionAdapter) => Promise<T>
): Promise<T> {
  if (testUserProfileStore) {
    const activeStore = testUserProfileStore;
    if (!activeStore.attemptLocks) {
      activeStore.attemptLocks = new Map<string, Record<string, unknown>>();
    }
    const executeTestTx = async (): Promise<T> => {
      let remainingContention = activeStore.simulatedContentionRetries || 0;
      while (true) {
        activeStore.transactionCount = (activeStore.transactionCount || 0) + 1;
        const stagedUsers = new Map<string, Record<string, unknown>>();
        const stagedLocks = new Map<string, Record<string, unknown>>();
        const txAdapter: UserProfileTransactionAdapter = {
          async getUserDoc(uid: string) {
            if (stagedUsers.has(uid)) {
              return JSON.parse(JSON.stringify(stagedUsers.get(uid)!));
            }
            const raw = activeStore.users.get(uid);
            return raw ? JSON.parse(JSON.stringify(raw)) : null;
          },
          setUserDoc(uid: string, data: Record<string, unknown>) {
            stagedUsers.set(uid, JSON.parse(JSON.stringify(data)));
          },
          async getAttemptLock(lockKey: string) {
            if (stagedLocks.has(lockKey)) {
              return JSON.parse(JSON.stringify(stagedLocks.get(lockKey)!));
            }
            const raw = activeStore.attemptLocks!.get(lockKey);
            return raw ? JSON.parse(JSON.stringify(raw)) : null;
          },
          setAttemptLock(lockKey: string, data: Record<string, unknown>) {
            stagedLocks.set(lockKey, JSON.parse(JSON.stringify(data)));
          },
        };

        const result = await fn(txAdapter);
        if (remainingContention > 0) {
          remainingContention -= 1;
          activeStore.simulatedContentionRetries = remainingContention;
          continue;
        }

        for (const [uid, docData] of stagedUsers.entries()) {
          activeStore.users.set(uid, docData);
        }
        for (const [lockKey, lockData] of stagedLocks.entries()) {
          activeStore.attemptLocks!.set(lockKey, lockData);
        }
        return result;
      }
    };

    const next = inMemoryTxQueue.then(executeTestTx, executeTestTx);
    inMemoryTxQueue = next.then(
      () => undefined,
      () => undefined
    );
    return next;
  }

  const db = getServerFirestore();
  if (db) {
    try {
      return await db.runTransaction(async (firestoreTx) => {
        const stagedUsers = new Map<string, Record<string, unknown>>();
        const stagedLocks = new Map<string, Record<string, unknown>>();
        const txAdapter: UserProfileTransactionAdapter = {
          async getUserDoc(uid: string) {
            if (stagedUsers.has(uid)) {
              return stagedUsers.get(uid)!;
            }
            const snap = await firestoreTx.get(db.collection(USERS_COLLECTION).doc(uid));
            if (!snap.exists) return null;
            return (snap.data() as Record<string, unknown>) || null;
          },
          setUserDoc(uid: string, data: Record<string, unknown>) {
            stagedUsers.set(uid, data);
            const fallbackNow = Date.now();
            const firestoreData: Record<string, unknown> = {
              ...data,
              createdAt: toFirestoreTimestamp(data.createdAt, fallbackNow),
              updatedAt: toFirestoreTimestamp(data.updatedAt, fallbackNow),
            };
            firestoreTx.set(db.collection(USERS_COLLECTION).doc(uid), firestoreData, {
              merge: true,
            });
          },
          async getAttemptLock(lockKey: string) {
            if (stagedLocks.has(lockKey)) {
              return stagedLocks.get(lockKey)!;
            }
            const snap = await firestoreTx.get(
              db.collection(ADAPTIVE_ATTEMPT_LOCKS_COLLECTION).doc(lockKey)
            );
            if (!snap.exists) return null;
            return (snap.data() as Record<string, unknown>) || null;
          },
          setAttemptLock(lockKey: string, data: Record<string, unknown>) {
            stagedLocks.set(lockKey, data);
            firestoreTx.set(
              db.collection(ADAPTIVE_ATTEMPT_LOCKS_COLLECTION).doc(lockKey),
              data
            );
          },
        };
        return await fn(txAdapter);
      });
    } catch (err) {
      console.warn(
        '[userProfileRepository] Firestore transaction unavailable, using local fallback:',
        err instanceof Error ? err.message : err
      );
    }
  }

  // Fallback serialized in-memory transaction when Firestore credentials are not configured in local tests
  const executeMemoryTx = async (): Promise<T> => {
    const stagedUsers = new Map<string, Record<string, unknown>>();
    const stagedLocks = new Map<string, Record<string, unknown>>();
    const txAdapter: UserProfileTransactionAdapter = {
      async getUserDoc(uid: string) {
        if (stagedUsers.has(uid)) {
          return JSON.parse(JSON.stringify(stagedUsers.get(uid)!));
        }
        const raw = memoryUsersStore.get(uid);
        return raw ? JSON.parse(JSON.stringify(raw)) : null;
      },
      setUserDoc(uid: string, data: Record<string, unknown>) {
        stagedUsers.set(uid, JSON.parse(JSON.stringify(data)));
      },
      async getAttemptLock(lockKey: string) {
        if (stagedLocks.has(lockKey)) {
          return JSON.parse(JSON.stringify(stagedLocks.get(lockKey)!));
        }
        const raw = memoryAttemptLocksStore.get(lockKey);
        return raw ? JSON.parse(JSON.stringify(raw)) : null;
      },
      setAttemptLock(lockKey: string, data: Record<string, unknown>) {
        stagedLocks.set(lockKey, JSON.parse(JSON.stringify(data)));
      },
    };
    const result = await fn(txAdapter);
    for (const [uid, docData] of stagedUsers.entries()) {
      memoryUsersStore.set(uid, docData);
    }
    for (const [lockKey, lockData] of stagedLocks.entries()) {
      memoryAttemptLocksStore.set(lockKey, lockData);
    }
    return result;
  };

  const next = inMemoryTxQueue.then(executeMemoryTx, executeMemoryTx);
  inMemoryTxQueue = next.then(
    () => undefined,
    () => undefined
  );
  return next;
}

function buildCompleteUserDocWithAdaptiveProfile(
  uid: string,
  existing: Record<string, unknown> | null,
  profile: AdaptiveProfile,
  nowIso: string,
  extras?: {
    placementLevel?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
    placementSessionId?: string;
    placementCompletedAt?: string;
    lastProcessedAttemptId?: string;
  }
): StoredUserAdaptiveDoc {
  const baseCreatedAt = extractIsoFromTimestampOrString(existing?.createdAt, nowIso);
  const baseDisplayName =
    typeof existing?.displayName === 'string' && existing.displayName.trim().length > 0
      ? existing.displayName.slice(0, 120)
      : 'Learner';
  const baseShowArabic =
    typeof existing?.showArabicTranslation === 'boolean'
      ? existing.showArabicTranslation
      : false;
  const baseFontSize =
    existing?.fontSize === 'sm' ||
    existing?.fontSize === 'md' ||
    existing?.fontSize === 'lg' ||
    existing?.fontSize === 'xl'
      ? existing.fontSize
      : 'md';
  const baseCompletedCount =
    typeof existing?.completedCount === 'number' &&
    Number.isFinite(existing.completedCount) &&
    existing.completedCount >= 0
      ? Math.floor(existing.completedCount)
      : 0;
  const baseAverageAccuracy =
    typeof existing?.averageAccuracy === 'number' &&
    Number.isFinite(existing.averageAccuracy) &&
    existing.averageAccuracy >= 0 &&
    existing.averageAccuracy <= 100
      ? Math.round(existing.averageAccuracy)
      : 0;

  const existingPlacementLevel = isAllowedPlacementLevel(existing?.placementLevel)
    ? existing.placementLevel
    : undefined;
  const effectivePlacementLevel = extras?.placementLevel || existingPlacementLevel;

  const doc: StoredUserAdaptiveDoc = {
    uid,
    displayName: baseDisplayName,
    preferredLevel: profile.currentLevel,
    startingLevel: profile.startingLevel,
    currentDifficultyScore: profile.currentDifficultyScore,
    consecutivePasses: profile.consecutivePasses,
    consecutiveFailures: profile.consecutiveFailures,
    adaptiveProfileVersion: ADAPTIVE_PROFILE_SCHEMA_VERSION,
    showArabicTranslation: baseShowArabic,
    fontSize: baseFontSize,
    completedCount: baseCompletedCount,
    averageAccuracy: baseAverageAccuracy,
    createdAt: baseCreatedAt,
    updatedAt: nowIso,
  };

  if (effectivePlacementLevel) {
    doc.placementLevel = effectivePlacementLevel;
  }

  const effectiveLastAttemptId =
    extras?.lastProcessedAttemptId ||
    (typeof existing?.lastProcessedAttemptId === 'string'
      ? existing.lastProcessedAttemptId
      : undefined);
  if (effectiveLastAttemptId) {
    doc.lastProcessedAttemptId = effectiveLastAttemptId.slice(0, 128);
  }

  return doc;
}

/**
 * Loads or hydrates the authoritative AdaptiveProfile for a verified user from Firestore.
 * If the user has a legacy profile without currentDifficultyScore/streak fields,
 * initializes safe defaults within their stored level's DIFFICULTY_RANGES[level]
 * without resetting their level to A1 or breaking C2 users.
 */
export async function getOrHydrateServerAdaptiveProfile(params: {
  uid: string;
  fallbackLevel?: CEFRLevel;
  persistIfMissing?: boolean;
  nowMs?: number;
}): Promise<{
  profile: AdaptiveProfile;
  userDoc: StoredUserAdaptiveDoc | null;
  wasMigrated: boolean;
}> {
  const cleanUid = params.uid.trim();
  const fallbackLevel: CEFRLevel = isValidAdaptiveLevel(params.fallbackLevel)
    ? params.fallbackLevel
    : 'B1';
  const nowMs =
    typeof params.nowMs === 'number' && Number.isFinite(params.nowMs)
      ? Math.floor(params.nowMs)
      : Date.now();
  const nowIso = new Date(nowMs).toISOString();

  return runUserProfileTransaction(async (tx) => {
    const existing = await tx.getUserDoc(cleanUid);
    if (!existing) {
      const initialProfile = createAdaptiveProfile(fallbackLevel);
      if (params.persistIfMissing) {
        const createdDoc = buildCompleteUserDocWithAdaptiveProfile(
          cleanUid,
          null,
          initialProfile,
          nowIso
        );
        tx.setUserDoc(cleanUid, createdDoc);
        return { profile: initialProfile, userDoc: createdDoc, wasMigrated: true };
      }
      return { profile: initialProfile, userDoc: null, wasMigrated: false };
    }

    const hydrated = normalizeAdaptiveProfile(
      {
        startingLevel: existing.startingLevel,
        currentLevel: existing.preferredLevel ?? existing.currentLevel,
        preferredLevel: existing.preferredLevel,
        placementLevel: existing.placementLevel,
        currentDifficultyScore: existing.currentDifficultyScore,
        consecutivePasses: existing.consecutivePasses,
        consecutiveFailures: existing.consecutiveFailures,
        adaptiveProfileVersion: existing.adaptiveProfileVersion,
      },
      fallbackLevel
    );

    const needsMigration =
      typeof existing.currentDifficultyScore !== 'number' ||
      typeof existing.consecutivePasses !== 'number' ||
      typeof existing.consecutiveFailures !== 'number' ||
      existing.adaptiveProfileVersion !== ADAPTIVE_PROFILE_SCHEMA_VERSION ||
      existing.preferredLevel !== hydrated.currentLevel;

    if (needsMigration && params.persistIfMissing !== false) {
      const migratedDoc = buildCompleteUserDocWithAdaptiveProfile(
        cleanUid,
        existing,
        hydrated,
        nowIso
      );
      tx.setUserDoc(cleanUid, migratedDoc);
      return { profile: hydrated, userDoc: migratedDoc, wasMigrated: true };
    }

    const completeView = buildCompleteUserDocWithAdaptiveProfile(
      cleanUid,
      existing,
      hydrated,
      typeof existing.updatedAt === 'string' ? existing.updatedAt : nowIso
    );
    return { profile: hydrated, userDoc: completeView, wasMigrated: false };
  });
}

/**
 * Initializes or updates the authoritative AdaptiveProfile when a learner completes
 * the initial placement assessment (strictly capped at A1–C1).
 */
export async function initializePlacementAdaptiveProfileTransactional(params: {
  uid: string;
  recommendedLevel: CEFRLevel;
  recommendedDifficultyScore?: number;
  placementSessionId?: string;
  placementCompletedAt?: string;
  nowMs?: number;
}): Promise<{
  profile: AdaptiveProfile;
  userDoc: StoredUserAdaptiveDoc;
}> {
  const cleanUid = params.uid.trim();
  const safePlacementLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' = isAllowedPlacementLevel(
    params.recommendedLevel
  )
    ? params.recommendedLevel
    : (MAX_PLACEMENT_LEVEL as 'C1');

  const range = DIFFICULTY_RANGES[safePlacementLevel];
  const initialScore = Math.min(range.max, range.min + 4);

  const nowMs =
    typeof params.nowMs === 'number' && Number.isFinite(params.nowMs)
      ? Math.floor(params.nowMs)
      : Date.now();
  const nowIso = new Date(nowMs).toISOString();

  return runUserProfileTransaction(async (tx) => {
    const existing = await tx.getUserDoc(cleanUid);
    const placementProfile: AdaptiveProfile = {
      startingLevel: safePlacementLevel,
      currentLevel: safePlacementLevel,
      currentDifficultyScore: initialScore,
      consecutivePasses: 0,
      consecutiveFailures: 0,
    };

    const updatedDoc = buildCompleteUserDocWithAdaptiveProfile(
      cleanUid,
      existing,
      placementProfile,
      nowIso,
      {
        placementLevel: safePlacementLevel,
        placementSessionId: params.placementSessionId,
        placementCompletedAt: params.placementCompletedAt || nowIso,
      }
    );

    tx.setUserDoc(cleanUid, updatedDoc);
    return { profile: placementProfile, userDoc: updatedDoc };
  });
}

/**
 * Concurrency-safe, idempotent server transaction that loads the learner's authoritative
 * adaptive profile from Firestore, applies progression for a graded attempt, and persists
 * the updated state atomically.
 *
 * Client-supplied difficulty/streak values are NEVER trusted here; only the server-stored
 * profile in `users/{uid}` is used.
 */
export async function applyAttemptProgressionTransactional(params: {
  uid: string;
  attemptId?: string;
  attemptType: 'first' | 'practice' | 'review';
  completed: boolean;
  pendingReviewCount: number;
  accuracy: number;
  lessonId: string;
  lessonLevel: CEFRLevel;
  lessonDifficulty: number;
  nowMs?: number;
}): Promise<
  ProgressionResult & {
    wasDuplicateAttempt: boolean;
    lessonDifficulty: number;
    lastProcessedAttemptId?: string;
  }
> {
  const cleanUid = params.uid.trim();
  const cleanAttemptId =
    typeof params.attemptId === 'string' && params.attemptId.trim().length > 0
      ? params.attemptId.trim().slice(0, 128)
      : undefined;
  const nowMs =
    typeof params.nowMs === 'number' && Number.isFinite(params.nowMs)
      ? Math.floor(params.nowMs)
      : Date.now();
  const nowIso = new Date(nowMs).toISOString();

  return runUserProfileTransaction(async (tx) => {
    const existing = await tx.getUserDoc(cleanUid);
    const currentProfile = normalizeAdaptiveProfile(
      existing
        ? {
            startingLevel: existing.startingLevel,
            currentLevel: existing.preferredLevel ?? existing.currentLevel,
            preferredLevel: existing.preferredLevel,
            placementLevel: existing.placementLevel,
            currentDifficultyScore: existing.currentDifficultyScore,
            consecutivePasses: existing.consecutivePasses,
            consecutiveFailures: existing.consecutiveFailures,
            adaptiveProfileVersion: existing.adaptiveProfileVersion,
          }
        : null,
      params.lessonLevel
    );

    // Non-eligible attempts (e.g. practice/review or incomplete) do not mutate progression
    if (
      params.attemptType !== 'first' ||
      !params.completed ||
      params.pendingReviewCount > 0
    ) {
      if (!existing) {
        const initialDoc = buildCompleteUserDocWithAdaptiveProfile(
          cleanUid,
          null,
          currentProfile,
          nowIso
        );
        tx.setUserDoc(cleanUid, initialDoc);
      }
      return {
        profile: currentProfile,
        changed: false,
        levelChanged: false,
        reason: 'Attempt is not eligible for progression.',
        wasDuplicateAttempt: false,
        lessonDifficulty: params.lessonDifficulty,
        lastProcessedAttemptId:
          typeof existing?.lastProcessedAttemptId === 'string'
            ? existing.lastProcessedAttemptId
            : undefined,
      };
    }

    // Idempotency check: prevent duplicate progression if the same attemptId is submitted more than once
    if (cleanAttemptId) {
      const lockKey = `${cleanUid}__${cleanAttemptId}`;
      const existingLock = await tx.getAttemptLock(lockKey);
      if (existingLock || existing?.lastProcessedAttemptId === cleanAttemptId) {
        const cachedReason =
          typeof existingLock?.reason === 'string'
            ? existingLock.reason
            : 'Duplicate attempt submission; existing progression state preserved.';
        const cachedChanged =
          typeof existingLock?.changed === 'boolean' ? existingLock.changed : false;
        const cachedLevelChanged =
          typeof existingLock?.levelChanged === 'boolean'
            ? existingLock.levelChanged
            : false;

        return {
          profile: currentProfile,
          changed: cachedChanged,
          levelChanged: cachedLevelChanged,
          reason: cachedReason,
          wasDuplicateAttempt: true,
          lessonDifficulty: params.lessonDifficulty,
          lastProcessedAttemptId:
            typeof existing?.lastProcessedAttemptId === 'string'
              ? existing.lastProcessedAttemptId
              : cleanAttemptId,
        };
      }
    }

    const progression = applyAttemptProgression({
      profile: currentProfile,
      attemptType: params.attemptType,
      completed: params.completed,
      pendingReviewCount: params.pendingReviewCount,
      accuracy: params.accuracy,
      lessonDifficulty: params.lessonDifficulty,
    });

    const updatedDoc = buildCompleteUserDocWithAdaptiveProfile(
      cleanUid,
      existing,
      progression.profile,
      nowIso,
      {
        lastProcessedAttemptId: cleanAttemptId,
      }
    );

    tx.setUserDoc(cleanUid, updatedDoc);

    if (cleanAttemptId) {
      const lockKey = `${cleanUid}__${cleanAttemptId}`;
      tx.setAttemptLock(lockKey, {
        uid: cleanUid,
        attemptId: cleanAttemptId,
        lessonId: params.lessonId,
        accuracy: params.accuracy,
        lessonDifficulty: params.lessonDifficulty,
        changed: progression.changed,
        levelChanged: progression.levelChanged,
        reason: progression.reason,
        processedAt: nowIso,
      });
    }

    return {
      ...progression,
      wasDuplicateAttempt: false,
      lessonDifficulty: params.lessonDifficulty,
      lastProcessedAttemptId: updatedDoc.lastProcessedAttemptId,
    };
  });
}
