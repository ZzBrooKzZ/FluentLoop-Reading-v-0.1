import crypto from 'crypto';

if (typeof window !== 'undefined') {
  throw new Error('src/server/placementToken.ts is a server-only module and must never be imported in client code.');
}

/**
 * Guest Placement Session Token TTL:
 * 24 hours so completed guest placement sessions can be viewed and linked to Google Sign-In
 * after finishing the 20-minute assessment.
 */
export const PLACEMENT_GUEST_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;
export const PLACEMENT_GUEST_SECRET_MIN_BYTES = 32; // 256 bits

const PLACEHOLDER_SECRET_VALUES = new Set([
  'REPLACE_WITH_32_BYTE_RANDOM_SECRET',
  'MY_PLACEMENT_GUEST_SECRET',
  'YOUR_SECRET_HERE',
  'CHANGEME',
  'CHANGE_ME',
]);

const NON_PROD_DEV_FALLBACK_KEY = Buffer.from(
  'fluentloop-non-production-dev-test-hmac-key-256bit-do-not-use-in-prod',
  'utf8'
);

export class PlacementSecretConfigurationError extends Error {
  readonly status = 503;
  readonly code = 'PLACEMENT_SECRET_MISCONFIGURED';

  constructor() {
    super(
      'Placement service is unavailable: PLACEMENT_GUEST_SECRET must be configured with at least 256 bits (32 bytes) of entropy in production.'
    );
    this.name = 'PlacementSecretConfigurationError';
  }
}

export interface PlacementGuestSecretDiagnostics {
  configured: boolean;
  valid: boolean;
  mode: 'production' | 'non-production';
  source: 'env' | 'dev-fallback' | 'missing-or-invalid';
  algorithm: 'HMAC-SHA256';
  minRequiredBits: 256;
}

/**
 * Parses and validates raw secret material from `process.env.PLACEMENT_GUEST_SECRET`.
 * Supports:
 * - 64+ character hex strings (decoded to >= 32 raw bytes / 256 bits)
 * - 32+ byte UTF-8 or base64/base64url secret strings
 * Rejects empty strings, known placeholders, or values shorter than 32 bytes.
 * Never logs or echoes the secret value.
 */
function parseConfiguredPlacementSecret(rawValue: string | undefined): Buffer | null {
  if (typeof rawValue !== 'string') return null;
  const trimmed = rawValue.trim();
  if (!trimmed) return null;
  if (
    PLACEHOLDER_SECRET_VALUES.has(trimmed) ||
    PLACEHOLDER_SECRET_VALUES.has(trimmed.toUpperCase())
  ) {
    return null;
  }

  // If the string is hexadecimal (e.g., `openssl rand -hex 32`), require >= 64 hex chars (32 raw bytes = 256 bits)
  if (/^[0-9a-fA-F]+$/.test(trimmed)) {
    if (trimmed.length < 64 || trimmed.length % 2 !== 0) {
      return null;
    }
    const hexBuf = Buffer.from(trimmed, 'hex');
    return hexBuf.byteLength >= PLACEMENT_GUEST_SECRET_MIN_BYTES ? hexBuf : null;
  }

  const utf8Buf = Buffer.from(trimmed, 'utf8');
  if (utf8Buf.byteLength >= PLACEMENT_GUEST_SECRET_MIN_BYTES) {
    return utf8Buf;
  }

  return null;
}

/**
 * Returns safe boolean metadata about `PLACEMENT_GUEST_SECRET` availability at runtime
 * without ever exposing, hashing, or logging the secret value.
 */
export function getPlacementGuestSecretDiagnostics(): PlacementGuestSecretDiagnostics {
  const isProd = process.env.NODE_ENV === 'production';
  const raw = process.env.PLACEMENT_GUEST_SECRET;
  const hasRaw = typeof raw === 'string' && raw.trim().length > 0;
  const parsed = parseConfiguredPlacementSecret(raw);

  if (parsed) {
    return {
      configured: true,
      valid: true,
      mode: isProd ? 'production' : 'non-production',
      source: 'env',
      algorithm: 'HMAC-SHA256',
      minRequiredBits: 256,
    };
  }

  if (isProd) {
    return {
      configured: hasRaw,
      valid: false,
      mode: 'production',
      source: 'missing-or-invalid',
      algorithm: 'HMAC-SHA256',
      minRequiredBits: 256,
    };
  }

  return {
    configured: hasRaw,
    valid: true,
    mode: 'non-production',
    source: 'dev-fallback',
    algorithm: 'HMAC-SHA256',
    minRequiredBits: 256,
  };
}

/**
 * Resolves the server-only HMAC-SHA256 signing key from `process.env.PLACEMENT_GUEST_SECRET`.
 * - In production (`NODE_ENV === 'production'`), fails closed by throwing
 *   `PlacementSecretConfigurationError` if `PLACEMENT_GUEST_SECRET` is missing, shorter
 *   than 32 bytes (256 bits), or set to a placeholder.
 * - Never calls cloud provider SDKs directly and never generates random per-instance
 *   secrets at startup, preserving stateless token verification across instances and hosts.
 */
export function resolvePlacementGuestSecret(): Buffer {
  const parsed = parseConfiguredPlacementSecret(process.env.PLACEMENT_GUEST_SECRET);
  if (parsed) {
    return parsed;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new PlacementSecretConfigurationError();
  }

  return NON_PROD_DEV_FALLBACK_KEY;
}

export function computeGuestTokenHash(rawToken: string): string {
  return crypto.createHash('sha256').update(rawToken, 'utf8').digest('hex');
}

export interface IssuedPlacementGuestTokenDetails {
  token: string;
  tokenHash: string;
  issuedAtMs: number;
  expiresAtMs: number;
}

/**
 * Issues a signed guest placement token bound to `sessionId`, `issuedAtMs`, and `expiresAtMs`.
 * Token format: `v1.<sessionId>.<issuedAtMs>.<expiresAtMs>.<randomNonceHex>.<hmacBase64Url>`
 */
export function issuePlacementGuestTokenDetails(
  sessionId: string,
  issuedAtMs = Date.now(),
  expiresAtMs = issuedAtMs + PLACEMENT_GUEST_TOKEN_TTL_MS
): IssuedPlacementGuestTokenDetails {
  const secretKey = resolvePlacementGuestSecret();
  const cleanSessionId = sessionId.trim();
  const iat = Math.floor(issuedAtMs);
  const exp = Math.floor(expiresAtMs);
  const nonce = crypto.randomBytes(16).toString('hex');
  const payload = `v1.${cleanSessionId}.${iat}.${exp}.${nonce}`;
  const sig = crypto
    .createHmac('sha256', secretKey)
    .update(payload, 'utf8')
    .digest('base64url');
  const token = `${payload}.${sig}`;
  return {
    token,
    tokenHash: computeGuestTokenHash(token),
    issuedAtMs: iat,
    expiresAtMs: exp,
  };
}

export function issuePlacementGuestToken(
  sessionId: string,
  issuedAtMs = Date.now(),
  expiresAtMs = issuedAtMs + PLACEMENT_GUEST_TOKEN_TTL_MS
): string {
  return issuePlacementGuestTokenDetails(sessionId, issuedAtMs, expiresAtMs).token;
}

export type GuestTokenVerificationResult =
  | {
      ok: true;
      valid: true;
      status: 200;
      sessionId: string;
      issuedAtMs: number;
      expiresAtMs: number;
      tokenHash: string;
      error?: string;
      reason?: string;
    }
  | {
      ok: false;
      valid: false;
      status: 401 | 403;
      sessionId?: string;
      issuedAtMs?: number;
      expiresAtMs?: number;
      tokenHash?: string;
      error: string;
      reason: string;
    };

/**
 * Steps 1 & 2 of the 5-step guest placement verification order:
 * 1. Local token structure, sessionId binding, and expiry check (in-memory, zero Firestore reads).
 * 2. Local constant-time HMAC-SHA256 signature verification (in-memory, zero Firestore reads).
 * Fails closed in production if `PLACEMENT_GUEST_SECRET` is missing or invalid.
 */
export function verifyPlacementGuestToken(
  rawToken: string | null | undefined,
  expectedSessionId: string,
  nowMs = Date.now()
): GuestTokenVerificationResult {
  const secretKey = resolvePlacementGuestSecret();

  if (!rawToken || typeof rawToken !== 'string' || !rawToken.trim()) {
    return {
      ok: false,
      valid: false,
      status: 401,
      error: 'Missing placement guest token.',
      reason: 'Missing placement guest token.',
    };
  }

  const trimmed = rawToken.trim();
  if (trimmed.length > 512) {
    return {
      ok: false,
      valid: false,
      status: 403,
      error: 'Malformed placement guest token.',
      reason: 'Malformed placement guest token.',
    };
  }

  const parts = trimmed.split('.');
  if (parts.length !== 6 || parts[0] !== 'v1') {
    return {
      ok: false,
      valid: false,
      status: 403,
      error: 'Invalid placement guest token format.',
      reason: 'Invalid placement guest token format.',
    };
  }

  const [, tokenSessionId, iatStr, expStr, nonce, providedSig] = parts;
  if (
    !tokenSessionId ||
    !/^[a-zA-Z0-9_-]{4,128}$/.test(tokenSessionId) ||
    !/^\d{10,16}$/.test(iatStr) ||
    !/^\d{10,16}$/.test(expStr) ||
    !/^[a-f0-9]{16,64}$/i.test(nonce) ||
    !providedSig
  ) {
    return {
      ok: false,
      valid: false,
      status: 403,
      error: 'Invalid placement guest token claims.',
      reason: 'Invalid placement guest token claims.',
    };
  }

  // Step 1b: Session binding check before any database read
  if (expectedSessionId && tokenSessionId !== expectedSessionId.trim()) {
    return {
      ok: false,
      valid: false,
      status: 403,
      error: 'Placement guest token does not match the requested sessionId.',
      reason: 'Placement guest token does not match the requested sessionId.',
    };
  }

  const issuedAtMs = Number(iatStr);
  const expiresAtMs = Number(expStr);
  if (!Number.isFinite(issuedAtMs) || !Number.isFinite(expiresAtMs) || expiresAtMs < nowMs) {
    return {
      ok: false,
      valid: false,
      status: 403,
      error: 'Placement guest token has expired.',
      reason: 'Placement guest token has expired.',
    };
  }

  // Step 2: Constant-time HMAC-SHA256 verification before any database read
  const payload = `v1.${tokenSessionId}.${iatStr}.${expStr}.${nonce}`;
  const expectedSig = crypto
    .createHmac('sha256', secretKey)
    .update(payload, 'utf8')
    .digest('base64url');

  const providedBuf = Buffer.from(providedSig, 'utf8');
  const expectedBuf = Buffer.from(expectedSig, 'utf8');
  if (
    providedBuf.length !== expectedBuf.length ||
    !crypto.timingSafeEqual(providedBuf, expectedBuf)
  ) {
    return {
      ok: false,
      valid: false,
      status: 403,
      error: 'Invalid placement guest token signature.',
      reason: 'Invalid placement guest token signature.',
    };
  }

  return {
    ok: true,
    valid: true,
    status: 200,
    sessionId: tokenSessionId,
    issuedAtMs,
    expiresAtMs,
    tokenHash: computeGuestTokenHash(trimmed),
  };
}

/**
 * Constant-time comparison of stored SHA-256 hex token hashes (Step 4).
 */
export function verifyStoredGuestTokenHash(
  storedHash: string | undefined,
  candidateHash: string | undefined
): boolean {
  if (!storedHash || !candidateHash) return false;
  const a = Buffer.from(storedHash, 'utf8');
  const b = Buffer.from(candidateHash, 'utf8');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

type HeadersOrRequestLike =
  | { headers: { get(name: string): string | null } }
  | { get(name: string): string | null };

function getHeaderFromInput(input: HeadersOrRequestLike, name: string): string | null {
  if ('headers' in input && input.headers && typeof input.headers.get === 'function') {
    return input.headers.get(name);
  }
  if ('get' in input && typeof input.get === 'function') {
    return input.get(name);
  }
  return null;
}

export function extractPlacementGuestToken(
  reqOrHeaders: HeadersOrRequestLike,
  body?: Record<string, unknown> | null
): string | null {
  const headerToken = getHeaderFromInput(reqOrHeaders, 'x-placement-guest-token');
  if (headerToken && headerToken.trim()) {
    return headerToken.trim();
  }
  if (body && typeof body.guestToken === 'string' && body.guestToken.trim()) {
    return body.guestToken.trim();
  }
  return null;
}

/**
 * Checks whether an IPv4 address belongs to Google Front End (GFE) / Cloud Load Balancing
 * proxy ranges (`35.191.0.0/16` or `130.211.0.0/22`).
 */
function isGoogleFrontEndIp(ip: string): boolean {
  const clean = ip.trim();
  const ipv4Match = clean.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!ipv4Match) return false;
  const o1 = Number(ipv4Match[1]);
  const o2 = Number(ipv4Match[2]);
  const o3 = Number(ipv4Match[3]);
  // 35.191.0.0/16
  if (o1 === 35 && o2 === 191) return true;
  // 130.211.0.0/22 (130.211.0.0 - 130.211.3.255)
  if (o1 === 130 && o2 === 211 && o3 >= 0 && o3 <= 3) return true;
  return false;
}

function isValidIpLiteral(candidate: string): boolean {
  const trimmed = candidate.trim();
  if (!trimmed || trimmed.length > 64) return false;
  // IPv4
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(trimmed)) {
    return trimmed.split('.').every((part) => {
      const n = Number(part);
      return Number.isInteger(n) && n >= 0 && n <= 255;
    });
  }
  // IPv6
  if (/^[0-9a-fA-F:]+$/.test(trimmed) && trimmed.includes(':')) {
    return true;
  }
  return false;
}

/**
 * Extracts the trusted client IP from Cloud Run / Firebase App Hosting headers.
 * Parses `X-Forwarded-For` from RIGHT to LEFT, skipping known Google Front End (GFE)
 * proxy hops (`35.191.0.0/16`, `130.211.0.0/22`) and returning the rightmost external IP
 * appended by the Google edge load balancer (never trusting spoofable leftmost entries).
 */
export function extractTrustedClientIp(reqOrHeaders: HeadersOrRequestLike): string {
  const xff = getHeaderFromInput(reqOrHeaders, 'x-forwarded-for');
  if (xff) {
    const hops = xff
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean);
    for (let i = hops.length - 1; i >= 0; i--) {
      const hop = hops[i];
      if (!isValidIpLiteral(hop)) continue;
      if (isGoogleFrontEndIp(hop)) continue;
      return hop;
    }
    // If all valid hops matched GFE ranges, return the rightmost valid IP
    for (let i = hops.length - 1; i >= 0; i--) {
      if (isValidIpLiteral(hops[i])) {
        return hops[i];
      }
    }
  }
  const realIp = getHeaderFromInput(reqOrHeaders, 'x-real-ip')?.trim();
  if (realIp && isValidIpLiteral(realIp)) {
    return realIp;
  }
  return '127.0.0.1';
}

export interface RateLimitCheckResult {
  allowed: boolean;
  retryAfterMs: number;
  retryAfterSeconds: number;
  reason?: string;
}

interface CreationRateRecord {
  tenMinuteTimestamps: number[];
  hourTimestamps: number[];
  lastCreatedWithoutPriorTokenAtMs: number;
}

const sessionCreationByKey = new Map<string, CreationRateRecord>();
const sessionOperationByKey = new Map<
  string,
  {
    draftTimestamps: number[];
    submitTimestamps: number[];
    abandonTimestamps: number[];
  }
>();

const TEN_MINUTES_MS = 10 * 60 * 1000;
const ONE_HOUR_MS = 60 * 60 * 1000;
const ONE_MINUTE_MS = 60 * 1000;
const CREATION_COOLDOWN_MS = 15 * 1000;

export function resetPlacementRateLimitsForTests(): void {
  sessionCreationByKey.clear();
  sessionOperationByKey.clear();
}

/**
 * Protects `POST /api/placement/start` against session-creation floods:
 * - Max 5 new sessions per 10 minutes per trusted IP (or UID).
 * - Max 12 new sessions per hour per trusted IP (or UID).
 * - 15-second cooldown between brand-new guest session creations when no valid prior session token is presented.
 */
export function checkPlacementSessionCreationLimit(
  paramsOrIp:
    | string
    | {
        trustedClientIp: string;
        verifiedUid?: string | null;
        hasValidPriorGuestToken?: boolean;
        nowMs?: number;
      },
  hasValidPriorSessionTokenArg = false,
  nowMsArg = Date.now()
): RateLimitCheckResult {
  const trustedClientIp =
    typeof paramsOrIp === 'string' ? paramsOrIp : paramsOrIp.trustedClientIp;
  const verifiedUid =
    typeof paramsOrIp === 'string' ? null : paramsOrIp.verifiedUid ?? null;
  const hasValidPriorSessionToken =
    typeof paramsOrIp === 'string'
      ? hasValidPriorSessionTokenArg
      : Boolean(paramsOrIp.hasValidPriorGuestToken);
  const nowMs =
    typeof paramsOrIp === 'string'
      ? nowMsArg
      : typeof paramsOrIp.nowMs === 'number'
      ? paramsOrIp.nowMs
      : Date.now();

  const key = verifiedUid ? `uid:${verifiedUid}` : `ip:${trustedClientIp || '127.0.0.1'}`;
  const existing = sessionCreationByKey.get(key) || {
    tenMinuteTimestamps: [],
    hourTimestamps: [],
    lastCreatedWithoutPriorTokenAtMs: 0,
  };

  existing.tenMinuteTimestamps = existing.tenMinuteTimestamps.filter(
    (t) => nowMs - t < TEN_MINUTES_MS
  );
  existing.hourTimestamps = existing.hourTimestamps.filter((t) => nowMs - t < ONE_HOUR_MS);

  if (
    !hasValidPriorSessionToken &&
    !verifiedUid &&
    existing.lastCreatedWithoutPriorTokenAtMs > 0 &&
    nowMs - existing.lastCreatedWithoutPriorTokenAtMs < CREATION_COOLDOWN_MS
  ) {
    const retryAfterMs =
      CREATION_COOLDOWN_MS - (nowMs - existing.lastCreatedWithoutPriorTokenAtMs);
    return {
      allowed: false,
      retryAfterMs,
      retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000)),
      reason: 'Please wait a few seconds before starting another placement assessment.',
    };
  }

  if (existing.tenMinuteTimestamps.length >= 5) {
    const oldest = existing.tenMinuteTimestamps[0];
    const retryAfterMs = Math.max(1000, TEN_MINUTES_MS - (nowMs - oldest));
    return {
      allowed: false,
      retryAfterMs,
      retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000)),
      reason: 'Too many placement assessments started recently. Please try again in a few minutes.',
    };
  }

  if (existing.hourTimestamps.length >= 12) {
    const oldest = existing.hourTimestamps[0];
    const retryAfterMs = Math.max(1000, ONE_HOUR_MS - (nowMs - oldest));
    return {
      allowed: false,
      retryAfterMs,
      retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000)),
      reason: 'Hourly placement assessment limit reached. Please try again later.',
    };
  }

  existing.tenMinuteTimestamps.push(nowMs);
  existing.hourTimestamps.push(nowMs);
  if (!hasValidPriorSessionToken && !verifiedUid) {
    existing.lastCreatedWithoutPriorTokenAtMs = nowMs;
  }
  sessionCreationByKey.set(key, existing);
  return {
    allowed: true,
    retryAfterMs: 0,
    retryAfterSeconds: 0,
  };
}

/**
 * Per-session / per-IP rate limiting for operations on an existing placement session:
 * - draft: max 30/min
 * - submit: max 10/min
 * - abandon: max 10/min
 */
export function checkPlacementSessionOperationLimit(
  paramsOrKey:
    | string
    | {
        sessionId: string;
        trustedClientIp?: string;
        verifiedUid?: string | null;
        operation: 'draft' | 'submit' | 'abandon';
        nowMs?: number;
      },
  operationArg?: 'draft' | 'submit' | 'abandon',
  nowMsArg = Date.now()
): RateLimitCheckResult {
  const key =
    typeof paramsOrKey === 'string'
      ? paramsOrKey
      : `sess:${paramsOrKey.sessionId}:${paramsOrKey.verifiedUid || paramsOrKey.trustedClientIp || 'ip'}`;
  const operation =
    typeof paramsOrKey === 'string' ? operationArg || 'draft' : paramsOrKey.operation;
  const nowMs =
    typeof paramsOrKey === 'string'
      ? nowMsArg
      : typeof paramsOrKey.nowMs === 'number'
      ? paramsOrKey.nowMs
      : Date.now();

  const record = sessionOperationByKey.get(key) || {
    draftTimestamps: [],
    submitTimestamps: [],
    abandonTimestamps: [],
  };

  const bucket =
    operation === 'draft'
      ? record.draftTimestamps
      : operation === 'submit'
      ? record.submitTimestamps
      : record.abandonTimestamps;
  const maxPerMinute = operation === 'draft' ? 30 : 10;

  const filtered = bucket.filter((t) => nowMs - t < ONE_MINUTE_MS);
  if (filtered.length >= maxPerMinute) {
    const retryAfterMs = Math.max(1000, ONE_MINUTE_MS - (nowMs - filtered[0]));
    return {
      allowed: false,
      retryAfterMs,
      retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000)),
      reason: `Too many placement ${operation} requests. Please wait a moment and try again.`,
    };
  }
  filtered.push(nowMs);
  if (operation === 'draft') {
    record.draftTimestamps = filtered;
  } else if (operation === 'submit') {
    record.submitTimestamps = filtered;
  } else {
    record.abandonTimestamps = filtered;
  }
  sessionOperationByKey.set(key, record);
  return {
    allowed: true,
    retryAfterMs: 0,
    retryAfterSeconds: 0,
  };
}

/**
 * Safely reads and parses a JSON request body while enforcing a strict byte-size limit.
 */
export async function readJsonBodyWithLimit<T = any>(
  req: Request,
  maxBytes = 65_536
): Promise<
  | { ok: true; status?: 200; data: T; body: T; error?: string }
  | { ok: false; status: 400 | 413; data?: T; body?: T; error: string }
> {
  const contentLengthHeader = req.headers.get('content-length');
  if (contentLengthHeader) {
    const contentLength = Number(contentLengthHeader);
    if (Number.isFinite(contentLength) && contentLength > maxBytes) {
      return {
        ok: false,
        status: 413,
        error: `Request payload exceeds maximum allowed size of ${maxBytes} bytes.`,
      };
    }
  }

  let rawText = '';
  try {
    rawText = await req.text();
  } catch {
    return {
      ok: false,
      status: 400,
      error: 'Could not read request body.',
    };
  }

  if (Buffer.byteLength(rawText, 'utf8') > maxBytes) {
    return {
      ok: false,
      status: 413,
      error: `Request payload exceeds maximum allowed size of ${maxBytes} bytes.`,
    };
  }

  if (!rawText.trim()) {
    const emptyObj = {} as T;
    return { ok: true, data: emptyObj, body: emptyObj };
  }

  try {
    const parsed = JSON.parse(rawText) as T;
    return { ok: true, data: parsed, body: parsed };
  } catch {
    return {
      ok: false,
      status: 400,
      error: 'Invalid JSON request body.',
    };
  }
}
