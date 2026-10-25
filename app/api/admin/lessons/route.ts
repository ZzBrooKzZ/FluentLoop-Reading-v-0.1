import { NextRequest, NextResponse } from 'next/server';
import { verifyBearerToken } from '@/src/server/firebaseAdmin';
import {
  deleteAuthoritativeAdminLesson,
  getAllAuthoritativeLessons,
  getAllDiagnosticPassages,
  getServerDifficultyOverrides,
  saveAuthoritativeAdminLesson,
} from '@/src/server/lessonRepository';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const verified = await verifyBearerToken(req.headers.get('authorization'));
  if (!verified || !verified.isAdmin) {
    return NextResponse.json(
      { error: 'Unauthorized: Verified administrator token required.' },
      { status: 403 }
    );
  }

  return NextResponse.json({
    lessons: getAllAuthoritativeLessons(),
    diagnosticPassages: getAllDiagnosticPassages(),
    difficultyOverrides: getServerDifficultyOverrides(),
  });
}

export async function POST(req: NextRequest) {
  const verified = await verifyBearerToken(req.headers.get('authorization'));
  if (!verified || !verified.isAdmin) {
    return NextResponse.json(
      { error: 'Unauthorized: Verified administrator token required.' },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    if (Array.isArray(body?.lessons)) {
      const saved = body.lessons.map((l: any) => saveAuthoritativeAdminLesson(l));
      return NextResponse.json({ savedCount: saved.length });
    }
    if (body?.lesson && typeof body.lesson.id === 'string') {
      const saved = saveAuthoritativeAdminLesson(body.lesson, body.difficultyOverride);
      return NextResponse.json({ lesson: saved });
    }
    return NextResponse.json({ error: 'Invalid lesson payload.' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to save lesson.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const verified = await verifyBearerToken(req.headers.get('authorization'));
  if (!verified || !verified.isAdmin) {
    return NextResponse.json(
      { error: 'Unauthorized: Verified administrator token required.' },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(req.url);
  const lessonId = searchParams.get('id');
  if (!lessonId) {
    return NextResponse.json({ error: 'Missing lesson id parameter.' }, { status: 400 });
  }
  deleteAuthoritativeAdminLesson(lessonId);
  return NextResponse.json({ deleted: lessonId });
}
