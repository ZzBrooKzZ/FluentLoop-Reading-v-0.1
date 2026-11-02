import { NextRequest, NextResponse } from 'next/server';
import { requireVerifiedGoogleAuth } from '@/src/server/firebaseAdmin';
import {
  getOrHydrateServerAdaptiveProfile,
} from '@/src/server/userProfileRepository';
import { isValidAdaptiveLevel } from '@/src/services/adaptiveLearning';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const authCheck = await requireVerifiedGoogleAuth(req.headers.get('authorization'));
  if (!authCheck.ok) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }
  const verifiedUser = authCheck.user;

  const fallbackParam = req.nextUrl.searchParams.get('fallbackLevel');
  const fallbackLevel = isValidAdaptiveLevel(fallbackParam) ? fallbackParam : 'B1';

  const result = await getOrHydrateServerAdaptiveProfile({
    uid: verifiedUser.uid,
    fallbackLevel,
    persistIfMissing: true,
  });

  return NextResponse.json({
    profile: result.profile,
    wasMigrated: result.wasMigrated,
  });
}
