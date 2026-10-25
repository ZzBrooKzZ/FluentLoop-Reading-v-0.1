import { NextRequest, NextResponse } from 'next/server';
import { verifyBearerToken } from '@/src/server/firebaseAdmin';
import {
  getAllAuthoritativeLessons,
  sanitizeLessonForLearner,
} from '@/src/server/lessonRepository';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const verifiedUser = await verifyBearerToken(req.headers.get('authorization'));
  const allLessons = getAllAuthoritativeLessons();

  if (verifiedUser?.isAdmin) {
    return NextResponse.json({
      lessons: allLessons,
      sanitized: false,
    });
  }

  const publishedLearnerLessons = allLessons
    .filter((l) => l.status === 'published')
    .map(sanitizeLessonForLearner);

  return NextResponse.json({
    lessons: publishedLearnerLessons,
    sanitized: true,
  });
}
