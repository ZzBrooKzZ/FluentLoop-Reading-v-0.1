import { NextRequest, NextResponse } from 'next/server';
import { sanitizeUntrustedInput } from '@/src/server/gradingEngine';
import { savePlacementDraftAnswersOnServer } from '@/src/server/placementRepository';
import { PLACEMENT_TIMEOUT_MESSAGE } from '@/src/services/placementEngine';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
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

  try {
    const result = savePlacementDraftAnswersOnServer({
      sessionId,
      userId,
      passageId,
      answers: sanitizedAnswers,
    });

    if (result.lateRejected) {
      return NextResponse.json(
        {
          accepted: false,
          lateRejected: true,
          error: PLACEMENT_TIMEOUT_MESSAGE,
          session: result.session,
          serverNowMs: result.serverNowMs,
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
        accepted: true,
        lateRejected: false,
        session: result.session,
        serverNowMs: result.serverNowMs,
      },
      {
        headers: {
          'X-Robots-Tag': 'noindex, nofollow, noarchive',
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (err: any) {
    const message = err?.message || 'Failed to save placement draft answers.';
    if (message.includes('abandoned')) {
      return NextResponse.json(
        { error: message, abandoned: true, accepted: false },
        { status: 409 }
      );
    }
    const status = message.includes('different learner account') ? 403 : 404;
    return NextResponse.json({ error: message }, { status });
  }
}
