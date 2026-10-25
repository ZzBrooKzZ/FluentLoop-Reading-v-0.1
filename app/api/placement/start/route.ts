import { NextRequest, NextResponse } from 'next/server';
import { sanitizeUntrustedInput } from '@/src/server/gradingEngine';
import { startOrResumePlacementSessionOnServer } from '@/src/server/placementRepository';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const sessionId =
    typeof body?.sessionId === 'string'
      ? sanitizeUntrustedInput(body.sessionId, 128)
      : undefined;
  const userId =
    typeof body?.userId === 'string'
      ? sanitizeUntrustedInput(body.userId, 128)
      : 'guest';
  const isAnonymous = body?.isAnonymous !== false;
  const forceNew = Boolean(body?.forceNew);

  const clientRecoverySteps = Array.isArray(body?.recoverySteps)
    ? body.recoverySteps.slice(0, 3).map((step: any) => ({
        passageId: sanitizeUntrustedInput(step?.passageId, 128),
        answers:
          step?.answers && typeof step.answers === 'object' ? step.answers : {},
      }))
    : undefined;

  const { session, activePassage } = startOrResumePlacementSessionOnServer({
    sessionId,
    userId,
    isAnonymous,
    forceNew,
    clientRecoverySteps,
  });

  return NextResponse.json(
    {
      session,
      activePassage,
      maxPassages: 3,
    },
    {
      headers: {
        'X-Robots-Tag': 'noindex, nofollow, noarchive',
        'Cache-Control': 'no-store',
      },
    }
  );
}
