import { NextRequest, NextResponse } from 'next/server';
import { sanitizeUntrustedInput } from '@/src/server/gradingEngine';
import { startOrResumePlacementSessionOnServer } from '@/src/server/placementRepository';
import { PlacementAbandonReason } from '@/src/types/reading';

export const runtime = 'nodejs';

const VALID_ABANDON_REASONS = new Set<PlacementAbandonReason>([
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
    body = {};
  }

  const sessionId =
    typeof body?.sessionId === 'string'
      ? sanitizeUntrustedInput(body.sessionId, 128)
      : undefined;
  const abandonSessionId =
    typeof body?.abandonSessionId === 'string'
      ? sanitizeUntrustedInput(body.abandonSessionId, 128)
      : undefined;
  const abandonSessionIds = Array.isArray(body?.abandonSessionIds)
    ? body.abandonSessionIds
        .slice(0, 50)
        .filter((id: unknown): id is string => typeof id === 'string')
        .map((id: string) => sanitizeUntrustedInput(id, 128))
        .filter(Boolean)
    : undefined;
  const rawAbandonReason =
    typeof body?.abandonReason === 'string'
      ? (sanitizeUntrustedInput(body.abandonReason, 64) as PlacementAbandonReason)
      : undefined;
  const abandonReason: PlacementAbandonReason | undefined =
    rawAbandonReason && VALID_ABANDON_REASONS.has(rawAbandonReason)
      ? rawAbandonReason
      : undefined;
  const userId =
    typeof body?.userId === 'string'
      ? sanitizeUntrustedInput(body.userId, 128)
      : 'guest';
  const isAnonymous = body?.isAnonymous !== false;
  const forceNew = Boolean(body?.forceNew);

  const { session, activePassage, serverNowMs } =
    startOrResumePlacementSessionOnServer({
      sessionId,
      abandonSessionId,
      abandonSessionIds,
      abandonReason,
      userId,
      isAnonymous,
      forceNew,
    });

  return NextResponse.json(
    {
      session,
      activePassage,
      serverNowMs,
      durationSeconds: session.durationSeconds,
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
