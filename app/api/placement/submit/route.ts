import { NextRequest, NextResponse } from 'next/server';
import { requireVerifiedGoogleAuth } from '@/src/server/firebaseAdmin';
import { sanitizeUntrustedInput } from '@/src/server/gradingEngine';
import {
  PlacementHttpError,
  submitPlacementPassagePersistent,
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
import { initializePlacementAdaptiveProfileTransactional } from '@/src/server/userProfileRepository';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    resolvePlacementGuestSecret();

    const parsed = await readJsonBodyWithLimit<any>(req, 32_768);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: parsed.status });
    }
    const body = parsed.data;

    const sessionId = sanitizeUntrustedInput(body?.sessionId, 128);
    const passageId = sanitizeUntrustedInput(body?.passageId, 128);
    if (!sessionId || !passageId) {
      return NextResponse.json(
        { error: 'sessionId and passageId are required.' },
        { status: 400 }
      );
    }

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

    // Per-session operation rate limit (max 10 submits/min) before Firestore read
    const trustedClientIp = extractTrustedClientIp(req);
    const opLimit = checkPlacementSessionOperationLimit({
      sessionId,
      trustedClientIp,
      verifiedUid,
      operation: 'submit',
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

    // Steps 3, 4 & 5: Retrieve session from Firestore, verify stored hash/ownership, and grade/advance step
    const result = await submitPlacementPassagePersistent({
      sessionId,
      passageId,
      answers: body?.answers,
      autoSubmitOnTimeout: Boolean(body?.autoSubmitOnTimeout),
      verifiedUid,
      verifiedGuestTokenHash,
    });

    if (
      verifiedUid &&
      result.session.status === 'completed' &&
      result.session.recommendedLevel
    ) {
      await initializePlacementAdaptiveProfileTransactional({
        uid: verifiedUid,
        recommendedLevel: result.session.recommendedLevel,
        recommendedDifficultyScore: result.session.recommendedDifficultyScore,
        placementSessionId: result.session.id,
        placementCompletedAt: result.session.finalizedAt || result.session.updatedAt,
      });
    }

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
      { error: err?.message || 'Failed to submit placement passage.' },
      { status: 400 }
    );
  }
}
