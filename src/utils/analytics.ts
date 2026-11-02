export const PLACEHOLDER_GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';
export const ANALYTICS_CONSENT_STORAGE_KEY = 'fluentloop_analytics_consent_v1';

export type AnalyticsConsentState = 'unset' | 'granted' | 'denied';

const GA_MEASUREMENT_ID_PATTERN = /^G-[A-Z0-9]{6,}$/i;

const FORBIDDEN_PII_PARAM_KEYS = new Set([
  'email',
  'useremail',
  'user_email',
  'name',
  'displayname',
  'display_name',
  'uid',
  'userid',
  'user_id',
  'firebase_uid',
  'token',
  'idtoken',
  'id_token',
  'authtoken',
  'auth_token',
  'password',
  'answer',
  'answers',
  'useranswer',
  'user_answer',
  'response',
  'score',
  'accuracy',
  'currentdifficultyscore',
]);

/**
 * Resolves the active GA4 Measurement ID strictly from `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
 *
 * `NEXT_PUBLIC_GA_MEASUREMENT_ID` is the single source of truth:
 * - If missing (`undefined`), empty, set to the `.env.example` placeholder (`G-XXXXXXXXXX`),
 *   or not matching a valid `G-XXXXXXXXXX` format, returns `null` so analytics is
 *   gracefully disabled without falling back to any hardcoded production ID.
 */
export function resolveGaMeasurementId(
  env: Record<string, string | undefined> = process.env
): string | null {
  const raw = env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (raw === undefined) {
    return null;
  }

  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (trimmed.toUpperCase() === PLACEHOLDER_GA_MEASUREMENT_ID) return null;
  if (!GA_MEASUREMENT_ID_PATTERN.test(trimmed)) return null;

  return trimmed.toUpperCase();
}

/**
 * Reads the current learner analytics consent state in the browser:
 * - `'unset'`: No saved preference yet (default for new visitors; analytics blocked).
 * - `'granted'`: User explicitly accepted analytics cookies.
 * - `'denied'`: User explicitly rejected analytics cookies.
 */
export function getAnalyticsConsentState(
  storage?: Pick<Storage, 'getItem'> | null
): AnalyticsConsentState {
  try {
    const targetStorage =
      storage !== undefined
        ? storage
        : typeof window !== 'undefined'
          ? window.localStorage
          : null;
    if (!targetStorage) return 'unset';
    const raw = targetStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY);
    if (!raw) return 'unset';
    const normalized = raw.trim().toLowerCase();
    if (normalized === 'granted' || normalized === 'true' || normalized === '1') {
      return 'granted';
    }
    if (normalized === 'denied' || normalized === 'false' || normalized === '0') {
      return 'denied';
    }
    return 'unset';
  } catch {
    return 'unset';
  }
}

/**
 * Clears first-party `_ga` and `_ga_*` cookies when a user revokes analytics consent.
 */
function clearGaCookies(): void {
  if (typeof document === 'undefined' || !document.cookie) return;
  try {
    const cookies = document.cookie.split(';');
    const hostParts = typeof window !== 'undefined' ? window.location.hostname.split('.') : [];
    const rootDomain =
      hostParts.length >= 2 ? `.${hostParts.slice(-2).join('.')}` : undefined;

    for (const rawCookie of cookies) {
      const name = rawCookie.split('=')[0]?.trim();
      if (!name || (!name.startsWith('_ga') && !name.startsWith('_gid'))) continue;
      document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
      if (rootDomain) {
        document.cookie = `${name}=; Max-Age=0; path=/; domain=${rootDomain}; SameSite=Lax`;
      }
    }
  } catch {}
}

/**
 * Persists the user's explicit analytics choice (`'granted'` or `'denied'`)
 * and immediately updates `window['ga-disable-<GA_ID>']` and Google Consent Mode.
 */
export function setAnalyticsConsentState(
  state: 'granted' | 'denied',
  gaId: string | null = resolveGaMeasurementId()
): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, state);
  } catch {}

  if (gaId) {
    (window as unknown as Record<string, unknown>)[`ga-disable-${gaId}`] = state !== 'granted';
  }

  const win = window as unknown as { gtag?: (...args: unknown[]) => void };
  if (typeof win.gtag === 'function') {
    win.gtag('consent', 'update', {
      analytics_storage: state,
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
  }

  if (state === 'denied') {
    clearGaCookies();
  }

  try {
    window.dispatchEvent(
      new CustomEvent('fluentloop:analytics-consent-change', { detail: state })
    );
  } catch {}
}

/**
 * Opens the analytics preferences banner so users can review or change their
 * saved analytics choice at any time.
 */
export function openAnalyticsPreferences(): void {
  if (typeof window === 'undefined') return;
  try {
    window.dispatchEvent(new CustomEvent('fluentloop:open-analytics-preferences'));
  } catch {}
}

/**
 * Strips any personally identifiable information (email, displayName, UID,
 * auth tokens) and private learner assessment fields from analytics payloads.
 */
export function sanitizeAnalyticsPayload(
  params: Record<string, unknown>
): Record<string, string | number | boolean> {
  const safe: Record<string, string | number | boolean> = {};

  for (const [key, value] of Object.entries(params)) {
    const normalizedKey = key.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
    if (FORBIDDEN_PII_PARAM_KEYS.has(normalizedKey)) {
      continue;
    }
    if (typeof value === 'string') {
      if (value.includes('@') || /^eyJ[A-Za-z0-9_-]+\./.test(value.trim())) {
        continue;
      }
      safe[key] = value;
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      safe[key] = value;
    }
  }

  return safe;
}
