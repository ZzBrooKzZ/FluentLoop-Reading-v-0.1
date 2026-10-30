import { NextRequest, NextResponse } from 'next/server';
import { sanitizeUntrustedInput } from '@/src/server/gradingEngine';
import { abandonPlacementSessionOnServer } from '@/src/server/placementRepository';
import { PlacementAbandonReason } from '@/src/types/reading';

export const runtime = 'nodejs';

const VALID_REASONS = new Set<PlacementAbandonReason>([
  'refresh',
  'navigation_exit',
  'superseded',
  'user_cancelled',
]);

export async function POST(req: NextRequest) {
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON request body.' },
      { status: 400 }
    );
  }

  const sessionId = sanitizeUntrustedInput(body?.sessionId, 128);
  const userId =
    typeof body?.userId === 'string'
      ? sanitizeUntrustedInput(body.userId, 128)
      : 'guest';
  const rawReason = sanitizeUntrustedInput(body?.reason, 64) as PlacementAbandonReason;
  const reason: PlacementAbandonReason = VALID_REASONS.has(rawReason)
    ? rawReason
    : 'navigation_exit';

  if (!sessionId) {
    return NextResponse.json(
      { error: 'sessionId is required.' },
      { status: 400 }
    );
  }

  try {
    const result = abandonPlacementSessionOnServer({
      sessionId,
      userId,
      reason,
    });

    return NextResponse.json(
      {
        abandoned: result.abandoned,
        alreadyCompleted: result.alreadyCompleted,
        alreadyAbandoned: result.alreadyAbandoned,
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
    const message = err?.message || 'Failed to abandon placement session.';
    const status = message.includes('different learner account') ? 403 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
