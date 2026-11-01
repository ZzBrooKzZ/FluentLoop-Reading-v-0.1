import { NextRequest, NextResponse } from 'next/server';
import { requireVerifiedGoogleAuth } from '@/src/server/firebaseAdmin';
import { sanitizeUntrustedInput } from '@/src/server/gradingEngine';
import {
  abandonPlacementSessionPersistent,
  PlacementHttpError,
} from '@/src/server/placementRepository';
import {
  checkPlacementSessionOperationLimit,
  extractPlacementGuestToken,
  extractTrustedClientIp,
  PlacementSecretConfigurationError,
  readJsonBodyWithLimit,
  resolvePlacementGuestSecret,
  verifyPlacementGuestToken,
} from '@/src/server/placementToken';
import { PlacementAbandonReason } from '@/src/types/reading';

export const runtime = 'nodejs';

const VALID_ABANDON_REASONS: PlacementAbandonReason[] = [
  'refresh',
  'navigation_exit',
  'superseded',
  'user_cancelled',
];

export async function POST(req: NextRequest) {
  try {
    resolvePlacementGuestSecret();

    const parsed = await readJsonBodyWithLimit<any>(req, 16_384);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: parsed.status });
    }
    const body = parsed.data;

    const sessionId = sanitizeUntrustedInput(body?.sessionId, 128);
    if (!sessionId) {
      return NextResponse.json(
        { error: 'sessionId is required to abandon a placement session.' },
        { status: 400 }
      );
    }

    const reason: PlacementAbandonReason = VALID_ABANDON_REASONS.includes(body?.reason)
      ? body.reason
      : 'navigation_exit';

    // Authenticate caller: either verified Google user OR guest with HMAC-verified session token
    const rawAuthHeader = req.headers.get('authorization');
    let verifiedUid: string | null = null;
    let verifiedGuestTokenHash: string | null = null;

    if (rawAuthHeader && rawAuthHeader.trim() !== '') {
      const authCheck = await requireVerifiedGoogleAuth(rawAuthHeader);
      if (!authCheck.ok) {
        return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
      }
      verifiedUid = authCheck.user.uid;
      if (
        typeof body?.userId === 'string' &&
        body.userId.trim() !== '' &&
        body.userId.trim() !== 'guest' &&
        body.userId.trim() !== verifiedUid
      ) {
        return NextResponse.json(
          { error: 'Forbidden: Client-supplied userId does not match authenticated user.' },
          { status: 403 }
        );
      }
    } else {
      // Steps 1 & 2 of the 5-step guest verification order (in-memory, zero Firestore reads)
      const rawGuestToken = extractPlacementGuestToken(req, body);
      const guestCheck = verifyPlacementGuestToken(rawGuestToken, sessionId);
      if (!guestCheck.ok) {
        return NextResponse.json({ error: guestCheck.error }, { status: guestCheck.status });
      }
      verifiedGuestTokenHash = guestCheck.tokenHash;
    }

    const trustedClientIp = extractTrustedClientIp(req);
    const opLimit = checkPlacementSessionOperationLimit({
      sessionId,
      trustedClientIp,
      verifiedUid,
      operation: 'abandon',
    });
    if (!opLimit.allowed) {
      return NextResponse.json(
        { error: opLimit.reason },
        {
          status: 429,
          headers: { 'Retry-After': String(opLimit.retryAfterSeconds) },
        }
      );
    }

    // Steps 3, 4 & 5: Retrieve session from Firestore, verify stored hash/ownership, and mark abandoned
    const result = await abandonPlacementSessionPersistent({
      sessionId,
      reason,
      verifiedUid,
      verifiedGuestTokenHash,
    });
    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    if (err instanceof PlacementSecretConfigurationError) {
      return NextResponse.json(
        { error: err.message, code: err.code },
        { status: err.status }
      );
    }
    if (err instanceof PlacementHttpError) {
      return NextResponse.json(
        { error: err.message, ...(err.extra || {}) },
        { status: err.status }
      );
    }
    return NextResponse.json(
      { error: err?.message || 'Failed to abandon placement session.' },
      { status: 400 }
    );
  }
}
