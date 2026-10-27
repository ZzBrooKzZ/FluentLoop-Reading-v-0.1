import { NextRequest, NextResponse } from 'next/server';
import { verifyBearerToken } from '@/src/server/firebaseAdmin';
import { getHealthStatusPayload } from '@/src/server/gradingEngine';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const verified = await verifyBearerToken(req.headers.get('authorization'));
  return NextResponse.json(getHealthStatusPayload(Boolean(verified?.isAdmin)));
}
