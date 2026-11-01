import {
  applicationDefault,
  getApps as getAdminApps,
  initializeApp as initializeAdminApp,
} from 'firebase-admin/app';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

export const BOOTSTRAPPED_ADMIN_EMAIL = 'megritarek19@gmail.com';
export const FLUENTLOOP_FIREBASE_PROJECT_ID = firebaseConfig.projectId;
export const FLUENTLOOP_FIRESTORE_DATABASE_ID = firebaseConfig.firestoreDatabaseId;
export const FLUENTLOOP_STORAGE_BUCKET = firebaseConfig.storageBucket;

export interface VerifiedAuthUser {
  uid: string;
  email: string | null;
  emailVerified: boolean;
  isAnonymous: boolean;
  signInProvider: string;
  isAdmin: boolean;
}

export interface VerifiedFirebaseUser {
  uid: string;
  email?: string | null;
  emailVerified?: boolean;
  email_verified?: boolean;
  isAnonymous?: boolean;
  signInProvider?: string;
  firebase?: {
    sign_in_provider?: string;
  };
}

export type VerifiedAuthCheckResult =
  | {
      ok: true;
      status: 200;
      user: VerifiedAuthUser;
      error?: string;
      reason?: string;
    }
  | {
      ok: false;
      status: 401 | 403;
      user?: VerifiedAuthUser;
      error: string;
      reason: string;
    };

type TestTokenVerifier = (rawToken: string) => Promise<VerifiedFirebaseUser | null>;
let testTokenVerifierOverride: TestTokenVerifier | null = null;

export function setTestTokenVerifierForTests(verifier: TestTokenVerifier | null): void {
  testTokenVerifierOverride = verifier;
}

function getOrInitAdminApp() {
  const existing = getAdminApps();
  if (existing.length > 0) {
    return existing[0];
  }

  try {
    return initializeAdminApp({
      credential: applicationDefault(),
      projectId: FLUENTLOOP_FIREBASE_PROJECT_ID,
      storageBucket: FLUENTLOOP_STORAGE_BUCKET,
    });
  } catch {
    return initializeAdminApp({
      projectId: FLUENTLOOP_FIREBASE_PROJECT_ID,
      storageBucket: FLUENTLOOP_STORAGE_BUCKET,
    });
  }
}

export function getFirebaseProjectDiagnostics() {
  return {
    firebaseProjectId: FLUENTLOOP_FIREBASE_PROJECT_ID,
    firestoreDatabaseId: FLUENTLOOP_FIRESTORE_DATABASE_ID,
    storageBucket: FLUENTLOOP_STORAGE_BUCKET,
    serviceAccountMode: 'firebase_apphosting_adc',
  };
}

export function getServerFirestore() {
  try {
    const app = getOrInitAdminApp();
    return getAdminFirestore(app, FLUENTLOOP_FIRESTORE_DATABASE_ID);
  } catch {
    return null;
  }
}

interface DecodedJwtClaimsPreview {
  aud?: string;
  iss?: string;
  sub?: string;
  exp?: number;
  iat?: number;
  email?: string;
  email_verified?: boolean;
  firebase?: {
    sign_in_provider?: string;
  };
}

/**
 * Decodes and pre-validates JWT claims (`aud`, `iss`, `sub`, `exp`, `iat`, `firebase.sign_in_provider`)
 * for defense-in-depth before or alongside cryptographic verification.
 */
export function preValidateFirebaseJwtClaims(idToken: string): DecodedJwtClaimsPreview | null {
  try {
    const segments = idToken.split('.');
    if (segments.length !== 3) return null;
    const payloadJson = Buffer.from(segments[1], 'base64url').toString('utf8');
    const claims = JSON.parse(payloadJson) as DecodedJwtClaimsPreview;
    if (!claims || typeof claims !== 'object') return null;

    const expectedAud = FLUENTLOOP_FIREBASE_PROJECT_ID;
    const expectedIss = `https://securetoken.google.com/${FLUENTLOOP_FIREBASE_PROJECT_ID}`;
    const nowSec = Math.floor(Date.now() / 1000);

    if (claims.aud !== expectedAud) return null;
    if (claims.iss !== expectedIss) return null;
    if (typeof claims.sub !== 'string' || !claims.sub.trim() || claims.sub.length > 128) {
      return null;
    }
    if (typeof claims.exp !== 'number' || claims.exp <= nowSec - 30) {
      return null;
    }
    if (typeof claims.iat !== 'number' || claims.iat > nowSec + 300) {
      return null;
    }
    return claims;
  } catch {
    return null;
  }
}

function isProductionRuntime(): boolean {
  const nodeEnv = String(process.env.NODE_ENV || '');
  return (
    nodeEnv === 'production' ||
    Boolean(process.env.K_SERVICE) ||
    Boolean(process.env.FIREBASE_CONFIG)
  );
}

/**
 * Internal cryptographic token verifier that returns the raw decoded identity
 * (including `signInProvider`, `emailVerified`, and `isAnonymous`) so callers can
 * distinguish 401 (unauthenticated/invalid token) from 403 (anonymous, non-Google, or unverified).
 */
async function decodeAndVerifyFirebaseToken(
  authHeader: string | null
): Promise<
  | { status: 'missing' }
  | { status: 'invalid' }
  | { status: 'verified'; user: VerifiedAuthUser }
> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { status: 'missing' };
  }
  const idToken = authHeader.slice('Bearer '.length).trim();
  if (!idToken) {
    return { status: 'missing' };
  }

  // Test hook for deterministic unit tests
  if (testTokenVerifierOverride) {
    const mocked = await testTokenVerifierOverride(idToken);
    if (!mocked) {
      return { status: 'invalid' };
    }
    const email = mocked.email ? mocked.email.toLowerCase() : null;
    const emailVerified = Boolean(mocked.emailVerified ?? mocked.email_verified);
    const signInProvider =
      mocked.signInProvider || mocked.firebase?.sign_in_provider || 'unknown';
    const isAnonymous = Boolean(mocked.isAnonymous || signInProvider === 'anonymous');
    const isAdmin =
      !isAnonymous &&
      signInProvider === 'google.com' &&
      emailVerified &&
      email === BOOTSTRAPPED_ADMIN_EMAIL.toLowerCase();
    return {
      status: 'verified',
      user: {
        uid: mocked.uid,
        email,
        emailVerified,
        isAnonymous,
        signInProvider,
        isAdmin,
      },
    };
  }

  // Path 1: Primary cryptographic verification via Firebase Admin SDK
  try {
    const app = getOrInitAdminApp();
    const decoded = await getAdminAuth(app).verifyIdToken(idToken);
    const email = decoded.email?.toLowerCase() || null;
    const emailVerified = Boolean(decoded.email_verified);
    const signInProvider =
      typeof decoded.firebase?.sign_in_provider === 'string'
        ? decoded.firebase.sign_in_provider
        : 'unknown';
    const isAnonymous = signInProvider === 'anonymous';
    const isAdmin =
      !isAnonymous &&
      signInProvider === 'google.com' &&
      emailVerified &&
      email === BOOTSTRAPPED_ADMIN_EMAIL.toLowerCase();

    return {
      status: 'verified',
      user: {
        uid: decoded.uid,
        email,
        emailVerified,
        isAnonymous,
        signInProvider,
        isAdmin,
      },
    };
  } catch (adminErr) {
    // In production (Cloud Run / Firebase App Hosting), fail closed if Admin SDK verification fails
    if (isProductionRuntime()) {
      console.error('[Auth] Firebase Admin verifyIdToken failed in production:', adminErr);
      return { status: 'invalid' };
    }
  }

  // Path 2: Development-only fallback when container lacks GCP metadata credentials
  const jwtClaims = preValidateFirebaseJwtClaims(idToken);
  if (!jwtClaims) {
    return { status: 'invalid' };
  }

  try {
    const resp = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(firebaseConfig.apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      }
    );
    if (!resp.ok) {
      return { status: 'invalid' };
    }
    const data = await resp.json();
    const account = Array.isArray(data?.users) ? data.users[0] : null;
    if (!account || typeof account.localId !== 'string' || account.localId !== jwtClaims.sub) {
      return { status: 'invalid' };
    }
    const email = typeof account.email === 'string' ? account.email.toLowerCase() : null;
    const emailVerified = Boolean(account.emailVerified) && Boolean(jwtClaims.email_verified);
    const providerIds: string[] = Array.isArray(account.providerUserInfo)
      ? account.providerUserInfo
          .map((p: any) => (typeof p?.providerId === 'string' ? p.providerId : ''))
          .filter(Boolean)
      : [];
    const jwtProvider = jwtClaims.firebase?.sign_in_provider || 'unknown';
    const signInProvider =
      jwtProvider === 'google.com' && providerIds.includes('google.com')
        ? 'google.com'
        : jwtProvider;
    const isAnonymous = signInProvider === 'anonymous';
    const isAdmin =
      !isAnonymous &&
      signInProvider === 'google.com' &&
      emailVerified &&
      email === BOOTSTRAPPED_ADMIN_EMAIL.toLowerCase();

    return {
      status: 'verified',
      user: {
        uid: account.localId,
        email,
        emailVerified,
        isAnonymous,
        signInProvider,
        isAdmin,
      },
    };
  } catch {
    return { status: 'invalid' };
  }
}

/**
 * Enforces FluentLoop's strict Google-only authentication policy:
 * - Valid cryptographic Firebase ID token (401 if missing/invalid)
 * - Non-anonymous account (403 if anonymous)
 * - `sign_in_provider === 'google.com'` (403 if email/password or non-Google federated provider)
 * - `email_verified === true` (403 if unverified)
 */
export async function requireVerifiedGoogleAuth(
  authHeader: string | null
): Promise<VerifiedAuthCheckResult> {
  const outcome = await decodeAndVerifyFirebaseToken(authHeader);
  if (outcome.status === 'missing') {
    return {
      ok: false,
      status: 401,
      error: 'Authentication required. Please sign in with Google.',
      reason: 'Authentication required. Please sign in with Google.',
    };
  }
  if (outcome.status === 'invalid') {
    return {
      ok: false,
      status: 401,
      error: 'Invalid or expired authentication token. Please sign in with Google again.',
      reason: 'Invalid or expired authentication token. Please sign in with Google again.',
    };
  }

  const { user } = outcome;
  if (user.isAnonymous || user.signInProvider === 'anonymous') {
    return {
      ok: false,
      status: 403,
      error: 'Anonymous accounts cannot access regular reading lessons. Please sign in with Google.',
      reason: 'Anonymous accounts cannot access regular reading lessons. Please sign in with Google.',
    };
  }
  if (user.signInProvider !== 'google.com') {
    return {
      ok: false,
      status: 403,
      error: 'FluentLoop requires Google Sign-In (google.com provider).',
      reason: 'FluentLoop requires Google Sign-In (google.com provider).',
    };
  }
  if (!user.emailVerified) {
    return {
      ok: false,
      status: 403,
      error: 'A verified Google email address is required.',
      reason: 'A verified Google email address is required.',
    };
  }

  return {
    ok: true,
    status: 200,
    user,
  };
}

/**
 * Enforces verified Google administrator authentication (`401` if unauthenticated, `403` if non-admin).
 */
export async function requireVerifiedAdminAuth(
  authHeader: string | null
): Promise<VerifiedAuthCheckResult> {
  const check = await requireVerifiedGoogleAuth(authHeader);
  if (!check.ok) {
    return check;
  }
  if (!check.user.isAdmin) {
    return {
      ok: false,
      status: 403,
      error: 'Forbidden: Verified Google administrator account required.',
      reason: 'Forbidden: Verified Google administrator account required.',
    };
  }
  return check;
}

/**
 * Returns the verified user ONLY if they satisfy FluentLoop's strict Google-only verified policy,
 * or `null` otherwise.
 */
export async function verifyBearerToken(
  authHeader: string | null
): Promise<VerifiedAuthUser | null> {
  const check = await requireVerifiedGoogleAuth(authHeader);
  return check.ok ? check.user : null;
}
