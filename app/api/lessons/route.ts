import { NextRequest, NextResponse } from 'next/server';
import { requireVerifiedGoogleAuth } from '@/src/server/firebaseAdmin';
import {
  getAllAuthoritativeLessonsPersistent,
  sanitizeLessonForLearner,
} from '@/src/server/lessonRepository';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const authCheck = await requireVerifiedGoogleAuth(req.headers.get('authorization'));
  if (!authCheck.ok) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  const allLessons = await getAllAuthoritativeLessonsPersistent();

  if (authCheck.user.isAdmin) {
    return NextResponse.json({
      lessons: allLessons,
      sanitized: false,
    });
  }

  const publishedLearnerLessons = allLessons
    .filter((l) => l.status === 'published' && !l.isDiagnostic)
    .map(sanitizeLessonForLearner);

  return NextResponse.json({
    lessons: publishedLearnerLessons,
    sanitized: true,
  });
}
