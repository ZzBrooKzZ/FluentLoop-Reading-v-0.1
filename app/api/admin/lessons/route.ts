import { NextRequest, NextResponse } from 'next/server';
import { requireVerifiedAdminAuth } from '@/src/server/firebaseAdmin';
import {
  deleteAuthoritativeAdminLessonPersistent,
  getAllAuthoritativeLessonsPersistent,
  getAllDiagnosticPassages,
  getServerDifficultyOverrides,
  saveAuthoritativeAdminLessonPersistent,
} from '@/src/server/lessonRepository';
import { readJsonBodyWithLimit } from '@/src/server/placementToken';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const authCheck = await requireVerifiedAdminAuth(req.headers.get('authorization'));
  if (!authCheck.ok) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  const lessons = await getAllAuthoritativeLessonsPersistent();
  return NextResponse.json({
    lessons,
    diagnosticPassages: getAllDiagnosticPassages(),
    difficultyOverrides: getServerDifficultyOverrides(),
  });
}

export async function POST(req: NextRequest) {
  const authCheck = await requireVerifiedAdminAuth(req.headers.get('authorization'));
  if (!authCheck.ok) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  const parsed = await readJsonBodyWithLimit<any>(req, 512 * 1024);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  }

  try {
    const body = parsed.data;
    if (Array.isArray(body?.lessons)) {
      if (body.lessons.length > 50) {
        return NextResponse.json(
          { error: 'Bulk lesson import cannot exceed 50 lessons per request.' },
          { status: 400 }
        );
      }
      const saved = [];
      for (const l of body.lessons) {
        const s = await saveAuthoritativeAdminLessonPersistent(
          l,
          undefined,
          authCheck.user.uid
        );
        saved.push(s);
      }
      return NextResponse.json({ savedCount: saved.length });
    }
    if (body?.lesson && typeof body.lesson.id === 'string') {
      const saved = await saveAuthoritativeAdminLessonPersistent(
        body.lesson,
        body.difficultyOverride,
        authCheck.user.uid
      );
      return NextResponse.json({ lesson: saved });
    }
    return NextResponse.json({ error: 'Invalid lesson payload.' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to save lesson.' },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const authCheck = await requireVerifiedAdminAuth(req.headers.get('authorization'));
  if (!authCheck.ok) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  const { searchParams } = new URL(req.url);
  const lessonId = searchParams.get('id');
  if (!lessonId) {
    return NextResponse.json({ error: 'Missing lesson id parameter.' }, { status: 400 });
  }
  await deleteAuthoritativeAdminLessonPersistent(lessonId, authCheck.user.uid);
  return NextResponse.json({ deleted: lessonId });
}
