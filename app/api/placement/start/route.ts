import { NextRequest, NextResponse } from 'next/server';
import { requireVerifiedGoogleAuth } from '@/src/server/firebaseAdmin';
import { sanitizeUntrustedInput } from '@/src/server/gradingEngine';
import {
  PlacementHttpError,
  startOrResumePlacementSessionPersistent,
} from '@/src/server/placementRepository';
import {
  checkPlacementSessionCreationLimit,
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
    // Fail closed immediately in production if PLACEMENT_GUEST_SECRET is missing or invalid
    resolvePlacementGuestSecret();

    const parsed = await readJsonBodyWithLimit<any>(req, 16_384);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: parsed.status });
    }
    const body = parsed.data;

    // If an Authorization header is present, require a verified Google account (reject anonymous/non-Google)
    const rawAuthHeader = req.headers.get('authorization');
    let verifiedUid: string | null = null;
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
      // Unauthenticated guest: reject any attempt to impersonate a non-guest userId
      if (
        typeof body?.userId === 'string' &&
        body.userId.trim() !== '' &&
        body.userId.trim() !== 'guest'
      ) {
        return NextResponse.json(
          { error: 'Authentication required to start a placement session for a user account.' },
          { status: 401 }
        );
      }
    }

    const sessionId =
      typeof body?.sessionId === 'string' && body.sessionId.trim()
        ? sanitizeUntrustedInput(body.sessionId, 128)
        : undefined;
    const abandonSessionId =
      typeof body?.abandonSessionId === 'string' && body.abandonSessionId.trim()
        ? sanitizeUntrustedInput(body.abandonSessionId, 128)
        : undefined;
    const abandonSessionIds: string[] | undefined = Array.isArray(body?.abandonSessionIds)
      ? body.abandonSessionIds
          .filter((item: unknown): item is string => typeof item === 'string')
          .slice(0, 10)
          .map((id: string) => sanitizeUntrustedInput(id, 128))
          .filter(Boolean)
      : undefined;
    const abandonReason: PlacementAbandonReason = VALID_ABANDON_REASONS.includes(
      body?.abandonReason
    )
      ? body.abandonReason
      : 'refresh';
    const forceNew = Boolean(body?.forceNew);

    // Check if guest provided a valid prior guestToken (for viewing completed result or superseding prior session)
    let verifiedGuestTokenHash: string | null = null;
    const candidateGuestToken = extractPlacementGuestToken(req, body);
    const targetSessionForTokenCheck =
      (!forceNew && sessionId) ||
      abandonSessionId ||
      (abandonSessionIds && abandonSessionIds[abandonSessionIds.length - 1]) ||
      '';
    if (!verifiedUid && candidateGuestToken) {
      const tokenCheck = verifyPlacementGuestToken(
        candidateGuestToken,
        targetSessionForTokenCheck
      );
      if (tokenCheck.ok) {
        verifiedGuestTokenHash = tokenCheck.tokenHash;
      } else if (!forceNew && sessionId) {
        // Guest requested viewing a specific sessionId with an invalid token -> reject before any DB read
        return NextResponse.json({ error: tokenCheck.error }, { status: tokenCheck.status });
      }
    } else if (!verifiedUid && !forceNew && sessionId) {
      // Guest requested viewing a specific sessionId without any guest token -> reject before any DB read
      return NextResponse.json(
        { error: 'Missing placement guest token for requested session.' },
        { status: 401 }
      );
    }

    // Enforce session-creation rate limits when creating a new session
    const isCreatingNewSession = forceNew || !sessionId;
    if (isCreatingNewSession) {
      const trustedClientIp = extractTrustedClientIp(req);
      const rateCheck = checkPlacementSessionCreationLimit({
        trustedClientIp,
        verifiedUid,
        hasValidPriorGuestToken: Boolean(verifiedGuestTokenHash),
      });
      if (!rateCheck.allowed) {
        return NextResponse.json(
          {
            error: rateCheck.reason || 'Too many placement session requests.',
            retryAfterSeconds: rateCheck.retryAfterSeconds,
          },
          {
            status: 429,
            headers: { 'Retry-After': String(rateCheck.retryAfterSeconds) },
          }
        );
      }
    }

    const result = await startOrResumePlacementSessionPersistent({
      sessionId,
      abandonSessionId,
      abandonSessionIds,
      abandonReason,
      verifiedUid,
      verifiedGuestTokenHash,
      forceNew,
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
      { error: err?.message || 'Failed to start placement assessment.' },
      { status: 400 }
    );
  }
}
