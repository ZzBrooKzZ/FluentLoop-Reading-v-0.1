import { NextRequest, NextResponse } from 'next/server';
import {
  checkGradingRateLimit,
  evaluateSemanticBatchOnServer,
  IncomingGradingItem,
  sanitizeUntrustedInput,
} from '@/src/server/gradingEngine';
import { getAuthoritativeLessonById } from '@/src/server/lessonRepository';
import { extractRelevantPassageExcerpt } from '@/src/services/gradingService';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const clientIp =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'local';

  if (!checkGradingRateLimit(clientIp)) {
    return NextResponse.json(
      { error: 'Too many grading requests. Please wait a moment and try again.' },
      { status: 429 }
    );
  }

  let body: any = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON request body.' },
      { status: 400 }
    );
  }

  const rawItems = Array.isArray(body?.items) ? body.items : null;
  if (!rawItems || rawItems.length === 0) {
    return NextResponse.json(
      { error: 'Invalid request payload: "items" array is required.' },
      { status: 400 }
    );
  }

  if (rawItems.length > 15) {
    return NextResponse.json(
      { error: 'Batch size exceeds maximum limit of 15 open-ended items per submission.' },
      { status: 400 }
    );
  }

  const lessonId = typeof body?.lessonId === 'string' ? body.lessonId : '';
  const authoritativeLesson = lessonId ? getAuthoritativeLessonById(lessonId) : null;

  const normalizedItems: IncomingGradingItem[] = [];
  for (const raw of rawItems) {
    if (!raw || typeof raw !== 'object' || typeof raw.questionId !== 'string') {
      return NextResponse.json(
        { error: 'Each item in "items" must contain a valid string "questionId".' },
        { status: 400 }
      );
    }
    const learnerAnswer = sanitizeUntrustedInput(raw.learnerAnswer, 400);
    if (!learnerAnswer) {
      return NextResponse.json(
        {
          error: `Empty learnerAnswer for question "${raw.questionId}". Blank answers must be graded locally.`,
        },
        { status: 400 }
      );
    }

    const authQuestion = authoritativeLesson?.questions.find((q) => q.id === raw.questionId);
    const expectedAnswer = sanitizeUntrustedInput(
      authQuestion?.correctAnswer || raw.expectedAnswer,
      300
    );
    const acceptedAnswers = Array.isArray(authQuestion?.acceptedAnswers)
      ? authQuestion!.acceptedAnswers!.slice(0, 10).map((a) => sanitizeUntrustedInput(a, 200))
      : Array.isArray(raw.acceptedAnswers)
      ? raw.acceptedAnswers.slice(0, 10).map((a: unknown) => sanitizeUntrustedInput(a, 200))
      : [];
    const rubric = sanitizeUntrustedInput(authQuestion?.rubric || raw.rubric || '', 400);
    const passageExcerpt = sanitizeUntrustedInput(
      raw.passageExcerpt ||
        (authoritativeLesson && authQuestion
          ? extractRelevantPassageExcerpt(authoritativeLesson.passage, authQuestion.passageEvidence)
          : ''),
      1200
    );

    normalizedItems.push({
      questionId: sanitizeUntrustedInput(raw.questionId, 100),
      cacheKey: sanitizeUntrustedInput(
        raw.cacheKey || `${raw.questionId}:${learnerAnswer}`,
        200
      ),
      prompt: sanitizeUntrustedInput(authQuestion?.prompt || raw.prompt, 500),
      instruction: sanitizeUntrustedInput(
        authQuestion?.instruction || raw.instruction || '',
        200
      ),
      expectedAnswer,
      acceptedAnswers,
      rubric,
      allowPartialCredit: Boolean(
        authQuestion ? authQuestion.allowPartialCredit : raw.allowPartialCredit
      ),
      passageExcerpt,
      learnerAnswer,
    });
  }

  const result = await evaluateSemanticBatchOnServer(normalizedItems);
  return NextResponse.json(result, { status: 200 });
}
