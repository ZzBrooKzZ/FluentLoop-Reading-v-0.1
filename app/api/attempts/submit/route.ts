import { NextRequest, NextResponse } from 'next/server';
import {
  checkGradingRateLimit,
  gradeLessonSubmissionOnServer,
  sanitizeUntrustedInput,
} from '@/src/server/gradingEngine';
import { getAuthoritativeLessonById } from '@/src/server/lessonRepository';
import { ADAPTIVE_LEVELS, createAdaptiveProfile } from '@/src/services/adaptiveLearning';
import { CEFRLevel, ReadingLesson } from '@/src/types/reading';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const clientIp =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'local';

  if (!checkGradingRateLimit(clientIp)) {
    return NextResponse.json(
      { error: 'Too many grading submissions. Please wait a moment and try again.' },
      { status: 429 }
    );
  }

  let body: any = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON request body.' }, { status: 400 });
  }

  const lessonId = sanitizeUntrustedInput(body?.lessonId, 128);
  if (!lessonId) {
    return NextResponse.json({ error: 'lessonId is required.' }, { status: 400 });
  }

  // Use authoritative server lesson so private answer keys & rubrics are evaluated server-side
  const authoritativeLesson: ReadingLesson | null =
    getAuthoritativeLessonById(lessonId) ||
    (body?.customLesson && body.customLesson.id === lessonId ? body.customLesson : null);

  if (!authoritativeLesson) {
    return NextResponse.json({ error: `Lesson "${lessonId}" not found.` }, { status: 404 });
  }

  const rawAnswers = body?.answers && typeof body.answers === 'object' ? body.answers : {};
  const sanitizedAnswers: Record<string, string> = {};
  for (const [qId, val] of Object.entries(rawAnswers)) {
    if (typeof val === 'string') {
      sanitizedAnswers[sanitizeUntrustedInput(qId, 100)] = sanitizeUntrustedInput(val, 400);
    }
  }

  const attemptId =
    typeof body?.attemptId === 'string' ? sanitizeUntrustedInput(body.attemptId, 128) : undefined;
  const rawAttemptType = body?.attemptType;
  const attemptType: 'first' | 'practice' | 'review' =
    rawAttemptType === 'practice' || rawAttemptType === 'review' ? rawAttemptType : 'first';

  let currentProfile = undefined;
  if (body?.profile && typeof body.profile === 'object') {
    const startLvl: CEFRLevel = ADAPTIVE_LEVELS.includes(body.profile.startingLevel)
      ? body.profile.startingLevel
      : 'B1';
    const currLvl: CEFRLevel = ADAPTIVE_LEVELS.includes(body.profile.currentLevel)
      ? body.profile.currentLevel
      : startLvl;
    const base = createAdaptiveProfile(startLvl);
    currentProfile = {
      startingLevel: startLvl,
      currentLevel: currLvl,
      currentDifficultyScore: Number.isFinite(Number(body.profile.currentDifficultyScore))
        ? Number(body.profile.currentDifficultyScore)
        : base.currentDifficultyScore,
      consecutivePasses: Math.max(0, Math.floor(Number(body.profile.consecutivePasses) || 0)),
      consecutiveFailures: Math.max(0, Math.floor(Number(body.profile.consecutiveFailures) || 0)),
    };
  }

  const { graded, progression } = await gradeLessonSubmissionOnServer({
    lesson: authoritativeLesson,
    answers: sanitizedAnswers,
    attemptId,
    attemptType,
    currentProfile,
  });

  return NextResponse.json({
    graded,
    progression,
  });
}
