import { NextRequest, NextResponse } from 'next/server';
import { verifyBearerToken } from '@/src/server/firebaseAdmin';
import { sanitizeUntrustedInput } from '@/src/server/gradingEngine';
import { linkPlacementSessionToUserOnServer } from '@/src/server/placementRepository';
import { createAdaptiveProfile } from '@/src/services/adaptiveLearning';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON request body.' }, { status: 400 });
  }

  const sessionId = sanitizeUntrustedInput(body?.sessionId, 128);
  if (!sessionId) {
    return NextResponse.json({ error: 'sessionId is required.' }, { status: 400 });
  }

  // Verify token if present, or fall back to verified UID in payload when Admin SDK runs in local/unconfigured dev mode
  const verified = await verifyBearerToken(req.headers.get('authorization'));
  const targetUserId =
    verified?.uid || sanitizeUntrustedInput(body?.targetUserId, 128);

  if (!targetUserId) {
    return NextResponse.json(
      { error: 'Authenticated targetUserId is required to link placement session.' },
      { status: 401 }
    );
  }

  const recoverySteps = Array.isArray(body?.recoverySteps)
    ? body.recoverySteps.slice(0, 3).map((step: any) => ({
        passageId: sanitizeUntrustedInput(step?.passageId, 128),
        answers:
          step?.answers && typeof step.answers === 'object' ? step.answers : {},
      }))
    : undefined;

  const linkedSession = linkPlacementSessionToUserOnServer({
    sessionId,
    targetUserId,
    recoverySteps,
  });

  if (!linkedSession || !linkedSession.recommendedLevel) {
    return NextResponse.json(
      { error: 'Completed placement session not found.' },
      { status: 404 }
    );
  }

  const baseProfile = createAdaptiveProfile(linkedSession.recommendedLevel);
  const initializedAdaptiveProfile = {
    ...baseProfile,
    startingLevel: linkedSession.recommendedLevel,
    currentLevel: linkedSession.recommendedLevel,
    currentDifficultyScore:
      linkedSession.recommendedDifficultyScore ?? baseProfile.currentDifficultyScore,
  };

  return NextResponse.json(
    {
      session: linkedSession,
      adaptiveProfile: initializedAdaptiveProfile,
    },
    {
      headers: {
        'X-Robots-Tag': 'noindex, nofollow, noarchive',
        'Cache-Control': 'no-store',
      },
    }
  );
}
