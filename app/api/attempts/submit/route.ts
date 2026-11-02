import { NextRequest, NextResponse } from 'next/server';
import { requireVerifiedGoogleAuth } from '@/src/server/firebaseAdmin';
import {
  checkGradingRateLimit,
  gradeLessonSubmissionOnServer,
  sanitizeUntrustedInput,
} from '@/src/server/gradingEngine';
import { getAuthoritativeLessonByIdPersistent } from '@/src/server/lessonRepository';
import {
  extractTrustedClientIp,
  readJsonBodyWithLimit,
} from '@/src/server/placementToken';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  // 1. Enforce strict Google-only authentication before reading body or grading
  const authCheck = await requireVerifiedGoogleAuth(req.headers.get('authorization'));
  if (!authCheck.ok) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }
  const verifiedUser = authCheck.user;

  // 2. Enforce 64 KiB body size limit
  const parsed = await readJsonBodyWithLimit<any>(req, 65_536);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  }
  const body = parsed.data;

  // 3. Reject conflicting client-supplied userId
  if (
    typeof body?.userId === 'string' &&
    body.userId.trim() !== '' &&
    body.userId.trim() !== verifiedUser.uid
  ) {
    return NextResponse.json(
      { error: 'Forbidden: Client-supplied userId does not match authenticated user.' },
      { status: 403 }
    );
  }

  // 4. Rate limit by verified UID + trusted IP
  const trustedIp = extractTrustedClientIp(req);
  if (
    !checkGradingRateLimit(`uid:${verifiedUser.uid}`) ||
    !checkGradingRateLimit(`ip:${trustedIp}`)
  ) {
    return NextResponse.json(
      { error: 'Too many grading submissions. Please wait a moment and try again.' },
      { status: 429 }
    );
  }

  const lessonId = sanitizeUntrustedInput(body?.lessonId, 128);
  if (!lessonId) {
    return NextResponse.json({ error: 'lessonId is required.' }, { status: 400 });
  }

  // 5. Resolve authoritative lesson strictly from server repository (never trust body.customLesson)
  const authoritativeLesson = await getAuthoritativeLessonByIdPersistent(lessonId);
  if (
    !authoritativeLesson ||
    (authoritativeLesson.status !== 'published' && !verifiedUser.isAdmin)
  ) {
    return NextResponse.json({ error: `Lesson "${lessonId}" not found.` }, { status: 404 });
  }

  const rawAnswers = body?.answers && typeof body.answers === 'object' ? body.answers : {};
  const answerEntries = Object.entries(rawAnswers);
  if (answerEntries.length > 20) {
    return NextResponse.json(
      { error: 'Too many answer entries in submission.' },
      { status: 400 }
    );
  }

  const sanitizedAnswers: Record<string, string> = {};
  for (const [qId, val] of answerEntries) {
    if (typeof val === 'string') {
      sanitizedAnswers[sanitizeUntrustedInput(qId, 100)] = sanitizeUntrustedInput(val, 400);
    }
  }

  const attemptId =
    typeof body?.attemptId === 'string' ? sanitizeUntrustedInput(body.attemptId, 128) : undefined;
  const rawAttemptType = body?.attemptType;
  const attemptType: 'first' | 'practice' | 'review' =
    rawAttemptType === 'practice' || rawAttemptType === 'review' ? rawAttemptType : 'first';

  // 6. Grade on server and compute adaptive progression transactionally from stored users/{uid} profile.
  // Client-supplied body.profile is intentionally ignored so difficulty and streaks cannot be forged.
  const { graded, progression } = await gradeLessonSubmissionOnServer({
    lesson: authoritativeLesson,
    answers: sanitizedAnswers,
    authenticatedUserId: verifiedUser.uid,
    attemptId,
    attemptType,
    useServerProfileTransaction: true,
  });

  return NextResponse.json({
    graded,
    progression,
  });
}

