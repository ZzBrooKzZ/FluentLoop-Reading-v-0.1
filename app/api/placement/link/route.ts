import { NextRequest, NextResponse } from 'next/server';
import { requireVerifiedGoogleAuth } from '@/src/server/firebaseAdmin';
import { sanitizeUntrustedInput } from '@/src/server/gradingEngine';
import {
  linkPlacementSessionToUserPersistent,
  PlacementHttpError,
} from '@/src/server/placementRepository';
import {
  extractPlacementGuestToken,
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

    // 1. Require strict Google-only authentication to link a placement session
    const authCheck = await requireVerifiedGoogleAuth(req.headers.get('authorization'));
    if (!authCheck.ok) {
      return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
    }
    const verifiedUser = authCheck.user;

    const parsed = await readJsonBodyWithLimit<any>(req, 16_384);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: parsed.status });
    }
    const body = parsed.data;

    const sessionId = sanitizeUntrustedInput(body?.sessionId, 128);
    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId is required.' }, { status: 400 });
    }

    // Reject conflicting targetUserId
    if (
      typeof body?.targetUserId === 'string' &&
      body.targetUserId.trim() !== '' &&
      body.targetUserId.trim() !== verifiedUser.uid
    ) {
      return NextResponse.json(
        { error: 'Forbidden: targetUserId does not match authenticated Google account.' },
        { status: 403 }
      );
    }

    // 2. Verify guestToken locally (Steps 1 & 2) before reading Firestore
    const rawGuestToken = extractPlacementGuestToken(req, body);
    if (!rawGuestToken) {
      return NextResponse.json(
        { error: 'Missing placement guest token required to link guest placement session.' },
        { status: 401 }
      );
    }
    const guestCheck = verifyPlacementGuestToken(rawGuestToken, sessionId);
    if (!guestCheck.ok) {
      return NextResponse.json({ error: guestCheck.error }, { status: guestCheck.status });
    }

    // 3. Steps 3, 4 & 5: Retrieve session, verify stored hash, link to verifiedUser.uid, and revoke guest token
    const linked = await linkPlacementSessionToUserPersistent({
      sessionId,
      verifiedUid: verifiedUser.uid,
      verifiedGuestTokenHash: guestCheck.tokenHash,
    });

    let adaptiveProfile = undefined;
    if (linked.status === 'completed' && linked.recommendedLevel) {
      const initialized = await initializePlacementAdaptiveProfileTransactional({
        uid: verifiedUser.uid,
        recommendedLevel: linked.recommendedLevel,
        recommendedDifficultyScore: linked.recommendedDifficultyScore,
        placementSessionId: linked.id,
        placementCompletedAt: linked.finalizedAt || linked.updatedAt,
      });
      adaptiveProfile = initialized.profile;
    }

    return NextResponse.json({ session: linked, adaptiveProfile }, { status: 200 });
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
      { error: err?.message || 'Placement session could not be linked.' },
      { status: 400 }
    );
  }
}
