import { NextRequest, NextResponse } from 'next/server';
import { requireVerifiedGoogleAuth } from '@/src/server/firebaseAdmin';
import {
  checkGradingRateLimit,
  evaluateSemanticBatchOnServer,
  IncomingGradingItem,
  sanitizeUntrustedInput,
} from '@/src/server/gradingEngine';
import { getAuthoritativeLessonByIdPersistent } from '@/src/server/lessonRepository';
import {
  extractTrustedClientIp,
  readJsonBodyWithLimit,
} from '@/src/server/placementToken';
import {
  computeEvaluationCacheKey,
  extractRelevantPassageExcerpt,
  normalizeAnswer,
} from '@/src/services/gradingService';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  // 1. Require strict Google-only authentication before reading body, cache, or Gemini
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

  // 4. Rate limit by verified UID + trusted IP (max 6 requests/minute)
  const trustedIp = extractTrustedClientIp(req);
  if (
    !checkGradingRateLimit(`uid:${verifiedUser.uid}`) ||
    !checkGradingRateLimit(`ip:${trustedIp}`)
  ) {
    return NextResponse.json(
      { error: 'Too many grading requests. Please wait a moment and try again.' },
      { status: 429 }
    );
  }

  const lessonId = sanitizeUntrustedInput(body?.lessonId, 128);
  if (!lessonId) {
    return NextResponse.json(
      { error: 'Valid "lessonId" is required for semantic grading.' },
      { status: 400 }
    );
  }

  // 5. Require lessonId to resolve to a published authoritative server lesson
  const authoritativeLesson = await getAuthoritativeLessonByIdPersistent(lessonId);
  if (
    !authoritativeLesson ||
    (authoritativeLesson.status !== 'published' && !verifiedUser.isAdmin)
  ) {
    return NextResponse.json(
      { error: `Lesson "${lessonId}" not found in authoritative catalog.` },
      { status: 404 }
    );
  }

  const rawItems = Array.isArray(body?.items) ? body.items : null;
  if (!rawItems || rawItems.length === 0) {
    return NextResponse.json(
      { error: 'Invalid request payload: "items" array is required.' },
      { status: 400 }
    );
  }

  if (rawItems.length > 12) {
    return NextResponse.json(
      { error: 'Batch size exceeds maximum limit of 12 open-ended items per submission.' },
      { status: 400 }
    );
  }

  // 6. Populate prompt, instruction, expectedAnswer, acceptedAnswers, rubric, and passageExcerpt
  // EXCLUSIVELY from the authoritative server lesson (never from client request body)
  const normalizedItems: IncomingGradingItem[] = [];
  for (const raw of rawItems) {
    if (!raw || typeof raw !== 'object' || typeof raw.questionId !== 'string') {
      return NextResponse.json(
        { error: 'Each item in "items" must contain a valid string "questionId".' },
        { status: 400 }
      );
    }

    const questionId = sanitizeUntrustedInput(raw.questionId, 100);
    const authQuestion = authoritativeLesson.questions.find((q) => q.id === questionId);
    if (!authQuestion) {
      return NextResponse.json(
        { error: `Question "${questionId}" does not belong to lesson "${lessonId}".` },
        { status: 400 }
      );
    }

    const isSemanticEligible =
      authQuestion.type === 'short_answer' || Boolean(authQuestion.allowSemanticGrading);
    if (!isSemanticEligible) {
      return NextResponse.json(
        { error: `Question "${questionId}" is not eligible for semantic AI evaluation.` },
        { status: 400 }
      );
    }

    const rawAnswerCandidate =
      typeof raw.learnerAnswer === 'string'
        ? raw.learnerAnswer
        : typeof raw.studentAnswer === 'string'
        ? raw.studentAnswer
        : '';
    const learnerAnswer = sanitizeUntrustedInput(rawAnswerCandidate, 400);
    if (!learnerAnswer) {
      return NextResponse.json(
        {
          error: `Empty learnerAnswer for question "${questionId}". Blank answers must be graded locally.`,
        },
        { status: 400 }
      );
    }

    const passageExcerpt = extractRelevantPassageExcerpt(
      authoritativeLesson.passage,
      authQuestion.passageEvidence
    );
    const normUser = normalizeAnswer(learnerAnswer);
    const authoritativeCacheKey = computeEvaluationCacheKey(
      authQuestion,
      passageExcerpt,
      normUser
    );

    normalizedItems.push({
      questionId: authQuestion.id,
      cacheKey: authoritativeCacheKey,
      prompt: sanitizeUntrustedInput(authQuestion.prompt, 500),
      instruction: sanitizeUntrustedInput(authQuestion.instruction || '', 200),
      expectedAnswer: sanitizeUntrustedInput(authQuestion.correctAnswer, 300),
      acceptedAnswers: Array.isArray(authQuestion.acceptedAnswers)
        ? authQuestion.acceptedAnswers.slice(0, 10).map((a) => sanitizeUntrustedInput(a, 200))
        : [],
      rubric: sanitizeUntrustedInput(authQuestion.rubric || '', 400),
      allowPartialCredit: Boolean(authQuestion.allowPartialCredit),
      passageExcerpt: sanitizeUntrustedInput(passageExcerpt, 1200),
      learnerAnswer,
    });
  }

  const result = await evaluateSemanticBatchOnServer(normalizedItems, verifiedUser.uid);
  return NextResponse.json(result, { status: 200 });
}
