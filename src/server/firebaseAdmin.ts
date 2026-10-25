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
  isAdmin: boolean;
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
    serviceAccountMode: 'fluentloop_project_adc_and_identity_toolkit',
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

/**
 * Verifies a Firebase Bearer ID token on the server.
 * 1. Attempts verification via Firebase Admin SDK (`getAdminAuth().verifyIdToken`).
 * 2. If ADC/service-account credentials are unavailable in the local container, verifies the signed ID token
 *    directly against Google Identity Toolkit (`accounts:lookup`) using the project's Firebase Web API key.
 * Never trusts client-provided UIDs or email strings from request bodies.
 */
export async function verifyBearerToken(authHeader: string | null): Promise<VerifiedAuthUser | null> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const idToken = authHeader.slice('Bearer '.length).trim();
  if (!idToken) {
    return null;
  }

  // Path 1: Firebase Admin SDK verification
  try {
    const app = getOrInitAdminApp();
    const decoded = await getAdminAuth(app).verifyIdToken(idToken);
    const email = decoded.email?.toLowerCase() || null;
    const emailVerified = Boolean(decoded.email_verified);
    const isAdmin = emailVerified && email === BOOTSTRAPPED_ADMIN_EMAIL.toLowerCase();
    return {
      uid: decoded.uid,
      email,
      emailVerified,
      isAdmin,
    };
  } catch {
    // Fallback to Google Identity Toolkit token verification when container lacks GCP metadata credentials
  }

  // Path 2: Google Identity Toolkit REST verification of the signed Firebase ID token
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
      return null;
    }
    const data = await resp.json();
    const account = Array.isArray(data?.users) ? data.users[0] : null;
    if (!account || typeof account.localId !== 'string') {
      return null;
    }
    const email = typeof account.email === 'string' ? account.email.toLowerCase() : null;
    const emailVerified = Boolean(account.emailVerified);
    const isAdmin = emailVerified && email === BOOTSTRAPPED_ADMIN_EMAIL.toLowerCase();
    return {
      uid: account.localId,
      email,
      emailVerified,
      isAdmin,
    };
  } catch {
    return null;
  }
}
