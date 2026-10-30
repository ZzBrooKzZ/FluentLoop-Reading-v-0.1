import { NextRequest, NextResponse } from 'next/server';
import {
  checkGradingRateLimit,
  sanitizeUntrustedInput,
} from '@/src/server/gradingEngine';
import { submitPlacementPassageOnServer } from '@/src/server/placementRepository';
import { PLACEMENT_TIMEOUT_MESSAGE } from '@/src/services/placementEngine';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const clientIp =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'local';

  if (!checkGradingRateLimit(clientIp)) {
    return NextResponse.json(
      { error: 'Too many placement submissions. Please wait a moment and try again.' },
      { status: 429 }
    );
  }

  let body: any = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON request body.' }, { status: 400 });
  }

  const sessionId = sanitizeUntrustedInput(body?.sessionId, 128);
  const passageId = sanitizeUntrustedInput(body?.passageId, 128);
  const userId =
    typeof body?.userId === 'string'
      ? sanitizeUntrustedInput(body.userId, 128)
      : 'guest';
  const autoSubmitOnTimeout = Boolean(body?.autoSubmitOnTimeout);
  const clientRecoveryStartedAtMs =
    typeof body?.recoveryStartedAtMs === 'number' &&
    Number.isFinite(body.recoveryStartedAtMs)
      ? body.recoveryStartedAtMs
      : undefined;

  if (!sessionId || !passageId) {
    return NextResponse.json(
      { error: 'Both sessionId and passageId are required.' },
      { status: 400 }
    );
  }

  const rawAnswers = body?.answers && typeof body.answers === 'object' ? body.answers : {};
  const sanitizedAnswers: Record<string, string> = {};
  for (const [qId, val] of Object.entries(rawAnswers)) {
    if (typeof val === 'string') {
      sanitizedAnswers[sanitizeUntrustedInput(qId, 100)] = sanitizeUntrustedInput(val, 400);
    }
  }

  const priorStepsForRecovery = Array.isArray(body?.priorStepsForRecovery)
    ? body.priorStepsForRecovery.slice(0, 3).map((step: any) => ({
        passageId: sanitizeUntrustedInput(step?.passageId, 128),
        answers:
          step?.answers && typeof step.answers === 'object' ? step.answers : {},
      }))
    : undefined;

  try {
    const result = submitPlacementPassageOnServer({
      sessionId,
      userId,
      passageId,
      answers: sanitizedAnswers,
      autoSubmitOnTimeout,
      clientRecoveryStartedAtMs,
      priorStepsForRecovery,
    });

    if (result.lateRejected) {
      return NextResponse.json(
        {
          error: PLACEMENT_TIMEOUT_MESSAGE,
          lateRejected: true,
          timedOut: true,
          session: result.session,
          stepResult: result.stepResult,
          nextPassage: null,
          wasDuplicate: result.wasDuplicate,
          serverNowMs: result.serverNowMs,
          maxPassages: 3,
        },
        {
          status: 409,
          headers: {
            'X-Robots-Tag': 'noindex, nofollow, noarchive',
            'Cache-Control': 'no-store',
          },
        }
      );
    }

    return NextResponse.json(
      {
        session: result.session,
        stepResult: result.stepResult,
        nextPassage: result.nextPassage,
        wasDuplicate: result.wasDuplicate,
        lateRejected: false,
        timedOut: result.timedOut,
        serverNowMs: result.serverNowMs,
        maxPassages: 3,
      },
      {
        headers: {
          'X-Robots-Tag': 'noindex, nofollow, noarchive',
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (err: any) {
    const message = err?.message || 'Failed to grade diagnostic passage.';
    if (message.includes('abandoned')) {
      return NextResponse.json(
        { error: message, abandoned: true },
        { status: 409 }
      );
    }
    const status = message.includes('different learner account') ? 403 : 404;
    return NextResponse.json({ error: message }, { status });
  }
}
