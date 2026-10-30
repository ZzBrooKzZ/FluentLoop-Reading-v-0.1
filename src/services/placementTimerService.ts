import { PlacementSession } from '../types/reading';

export const MAX_PLACEMENT_PASSAGES = 3;

/** Strict 20-minute (1,200 seconds) duration for the placement assessment. */
export const PLACEMENT_DURATION_SECONDS = 1200;
export const PLACEMENT_DURATION_MS = PLACEMENT_DURATION_SECONDS * 1000;

/** Server-controlled network transit allowance (ms) for auto-timeout requests sent at 00:00. */
export const SERVER_NETWORK_LATENCY_TOLERANCE_MS = 2000;

export const PLACEMENT_TIMEOUT_MESSAGE =
  'Time is up! Your placement assessment has been submitted automatically.';

export type PlacementTimerVisualTier =
  | 'normal_sage'
  | 'subtle_amber'
  | 'noticeable_warning'
  | 'red_warning';

export interface PlacementTimerVisualState {
  remainingSeconds: number;
  formatted: string;
  tier: PlacementTimerVisualTier;
  isExpired: boolean;
  label: string;
  containerClass: string;
  iconClass: string;
  timeClass: string;
  labelClass: string;
}

/**
 * Formats remaining seconds as MM:SS (clamped between 00:00 and 20:00).
 */
export function formatPlacementCountdown(remainingSeconds: number): string {
  const safeSeconds = Number.isFinite(remainingSeconds)
    ? Math.max(0, Math.min(PLACEMENT_DURATION_SECONDS, Math.floor(remainingSeconds)))
    : 0;
  const mins = Math.floor(safeSeconds / 60);
  const secs = safeSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/**
 * Returns the visual progression state for the placement assessment timer:
 * - 20:00–05:01 (301–1200s): Normal sage green (#879477 / #626F53)
 * - 05:00–02:01 (121–300s): Subtle amber warning
 * - 02:00–01:01 (61–120s): More noticeable warning
 * - 01:00–00:01 (0–60s): Red warning
 */
export function getPlacementTimerVisualState(
  remainingSeconds: number
): PlacementTimerVisualState {
  const clamped = Number.isFinite(remainingSeconds)
    ? Math.max(0, Math.min(PLACEMENT_DURATION_SECONDS, Math.floor(remainingSeconds)))
    : 0;
  const formatted = formatPlacementCountdown(clamped);
  const isExpired = clamped <= 0;

  if (clamped >= 301) {
    return {
      remainingSeconds: clamped,
      formatted,
      tier: 'normal_sage',
      isExpired: false,
      label: 'Time remaining',
      containerClass:
        'border-[#879477]/60 bg-[#F4F6F0] text-[#171615] transition-colors duration-300 motion-reduce:transition-none',
      iconClass: 'text-[#626F53]',
      timeClass: 'text-[#2D3624]',
      labelClass: 'text-[#626F53]',
    };
  }

  if (clamped >= 121) {
    return {
      remainingSeconds: clamped,
      formatted,
      tier: 'subtle_amber',
      isExpired: false,
      label: 'Time remaining',
      containerClass:
        'border-[#D4A03E]/60 bg-[#FCF6E6] text-[#171615] transition-colors duration-300 motion-reduce:transition-none',
      iconClass: 'text-[#946200]',
      timeClass: 'text-[#784E00]',
      labelClass: 'text-[#946200]',
    };
  }

  if (clamped >= 61) {
    return {
      remainingSeconds: clamped,
      formatted,
      tier: 'noticeable_warning',
      isExpired: false,
      label: 'Time remaining',
      containerClass:
        'border-[#C97122]/75 bg-[#FDEBD2] text-[#171615] transition-colors duration-300 motion-reduce:transition-none',
      iconClass: 'text-[#9A4400]',
      timeClass: 'text-[#7A3300]',
      labelClass: 'text-[#8C3B00]',
    };
  }

  return {
    remainingSeconds: clamped,
    formatted,
    tier: 'red_warning',
    isExpired,
    label: isExpired ? 'Time expired' : 'Time remaining',
    containerClass:
      'border-[#B42318]/70 bg-[#FEE2E2] text-[#171615] transition-colors duration-300 motion-reduce:transition-none',
    iconClass: 'text-[#B42318]',
    timeClass: 'text-[#911810]',
    labelClass: 'text-[#B42318]',
  };
}

/**
 * Computes the remaining milliseconds before the session's authoritative deadline.
 * Uses `serverClockOffsetMs` (or monotonic elapsed time anchored to `serverNowMs`) so
 * browser clock manipulations cannot extend the deadline.
 */
export function computeRemainingPlacementMs(
  session: Pick<PlacementSession, 'deadlineAtMs' | 'status'> | null | undefined,
  currentTimeMs: number = Date.now(),
  serverClockOffsetMs: number = 0
): number {
  if (!session || session.status !== 'in_progress') {
    return 0;
  }
  if (typeof session.deadlineAtMs !== 'number' || !Number.isFinite(session.deadlineAtMs)) {
    return PLACEMENT_DURATION_MS;
  }
  const offset = Number.isFinite(serverClockOffsetMs) ? serverClockOffsetMs : 0;
  const authoritativeNowMs = currentTimeMs + offset;
  const remaining = session.deadlineAtMs - authoritativeNowMs;
  return Math.max(0, Math.min(PLACEMENT_DURATION_MS, remaining));
}

/**
 * Computes the remaining whole seconds (0..1200) for the placement assessment.
 */
export function computeRemainingPlacementSeconds(
  session: Pick<PlacementSession, 'deadlineAtMs' | 'status'> | null | undefined,
  currentTimeMs: number = Date.now(),
  serverClockOffsetMs: number = 0
): number {
  const remainingMs = computeRemainingPlacementMs(session, currentTimeMs, serverClockOffsetMs);
  if (remainingMs <= 0) return 0;
  return Math.max(0, Math.min(PLACEMENT_DURATION_SECONDS, Math.ceil(remainingMs / 1000)));
}

/**
 * Checks whether the placement session's authoritative 20-minute deadline has expired.
 */
export function isPlacementSessionExpired(
  session: Pick<PlacementSession, 'deadlineAtMs'> | null | undefined,
  authoritativeNowMs: number = Date.now()
): boolean {
  if (!session || typeof session.deadlineAtMs !== 'number' || !Number.isFinite(session.deadlineAtMs)) {
    return false;
  }
  return authoritativeNowMs >= session.deadlineAtMs;
}

/**
 * Checks whether all answer inputs and navigation controls in the placement assessment
 * must be locked (either because the session is completed, abandoned, timedOut, or remaining time is 0).
 */
export function isPlacementAssessmentLocked(
  session: Pick<PlacementSession, 'deadlineAtMs' | 'status' | 'timedOut'> | null | undefined,
  currentTimeMs: number = Date.now(),
  serverClockOffsetMs: number = 0
): boolean {
  if (!session) return true;
  if (session.status !== 'in_progress' || session.timedOut) return true;
  return computeRemainingPlacementSeconds(session, currentTimeMs, serverClockOffsetMs) <= 0;
}

/**
 * Builds an account- and session-scoped storage key for in-progress placement answers
 * so stale answers from another learner account or session can never collide.
 */
export function getPlacementDraftStorageKey(
  userId: string | undefined | null,
  sessionId: string | undefined | null,
  passageId: string | undefined | null
): string {
  const safeUser = (userId || 'guest').trim() || 'guest';
  const safeSession = (sessionId || 'session').trim() || 'session';
  const safePassage = (passageId || 'passage').trim() || 'passage';
  return `placement-${safeUser}-${safeSession}-${safePassage}`;
}

/**
 * Singleton timer registry per placement session ID to ensure React re-renders or
 * passage transitions never create duplicate countdown intervals.
 */
const activePlacementTimers = new Map<
  string,
  {
    intervalId: ReturnType<typeof setInterval>;
    subscribers: Set<(remainingSeconds: number) => void>;
    getDeadlineAtMs: () => number;
    getAuthoritativeNowMs: () => number;
    createdCount: number;
  }
>();

export function subscribePlacementSessionTimer(params: {
  sessionId: string;
  getDeadlineAtMs: () => number;
  getAuthoritativeNowMs: () => number;
  onTick: (remainingSeconds: number) => void;
  tickIntervalMs?: number;
}): () => void {
  const key = (params.sessionId || '').trim();
  if (!key) return () => {};

  const existing = activePlacementTimers.get(key);
  if (existing) {
    existing.getDeadlineAtMs = params.getDeadlineAtMs;
    existing.getAuthoritativeNowMs = params.getAuthoritativeNowMs;
    existing.subscribers.add(params.onTick);
    const currentRem = computeRemainingPlacementSeconds(
      { deadlineAtMs: existing.getDeadlineAtMs(), status: 'in_progress' },
      existing.getAuthoritativeNowMs(),
      0
    );
    params.onTick(currentRem);
    return () => {
      const entry = activePlacementTimers.get(key);
      if (!entry) return;
      entry.subscribers.delete(params.onTick);
      if (entry.subscribers.size === 0) {
        clearInterval(entry.intervalId);
        activePlacementTimers.delete(key);
      }
    };
  }

  const subscribers = new Set<(remainingSeconds: number) => void>([params.onTick]);
  const entry = {
    intervalId: setInterval(() => {
      const currentEntry = activePlacementTimers.get(key);
      if (!currentEntry) return;
      const rem = computeRemainingPlacementSeconds(
        { deadlineAtMs: currentEntry.getDeadlineAtMs(), status: 'in_progress' },
        currentEntry.getAuthoritativeNowMs(),
        0
      );
      currentEntry.subscribers.forEach((cb) => cb(rem));
      if (rem <= 0) {
        clearInterval(currentEntry.intervalId);
        activePlacementTimers.delete(key);
      }
    }, params.tickIntervalMs ?? 250),
    subscribers,
    getDeadlineAtMs: params.getDeadlineAtMs,
    getAuthoritativeNowMs: params.getAuthoritativeNowMs,
    createdCount: 1,
  };

  activePlacementTimers.set(key, entry);
  const initialRem = computeRemainingPlacementSeconds(
    { deadlineAtMs: entry.getDeadlineAtMs(), status: 'in_progress' },
    entry.getAuthoritativeNowMs(),
    0
  );
  params.onTick(initialRem);

  return () => {
    const currentEntry = activePlacementTimers.get(key);
    if (!currentEntry) return;
    currentEntry.subscribers.delete(params.onTick);
    if (currentEntry.subscribers.size === 0) {
      clearInterval(currentEntry.intervalId);
      activePlacementTimers.delete(key);
    }
  };
}

export function getActivePlacementTimerCount(sessionId?: string): number {
  if (sessionId) {
    return activePlacementTimers.has(sessionId.trim()) ? 1 : 0;
  }
  return activePlacementTimers.size;
}

export function stopPlacementSessionTimer(sessionId: string): void {
  const key = (sessionId || '').trim();
  if (!key) return;
  const entry = activePlacementTimers.get(key);
  if (entry) {
    clearInterval(entry.intervalId);
    activePlacementTimers.delete(key);
  }
}

export function clearAllPlacementTimersForTests(): void {
  for (const entry of activePlacementTimers.values()) {
    clearInterval(entry.intervalId);
  }
  activePlacementTimers.clear();
}
