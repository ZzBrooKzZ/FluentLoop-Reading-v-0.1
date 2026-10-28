import React from 'react';
import { ArrowLeft, BookOpen, Flame, TrendingUp } from 'lucide-react';
import { ReadingLesson } from '../types/reading';
import { CornerBotanicalSprig } from './BotanicalIllustrations';

interface ProgressPoint {
  id: string;
  x: number;
  y: number;
  accuracy: number;
}
interface AssignedPassagePreviewProps {
  lesson: ReadingLesson;
  streakDays: number;
  longestStreak?: number;
  studiedToday?: boolean;
  completedCount: number;
  progressPoints: ProgressPoint[];
  onBack: () => void;
  onStart: () => void;
}

export const AssignedPassagePreview: React.FC<AssignedPassagePreviewProps> = ({
  lesson,
  streakDays,
  longestStreak = 0,
  studiedToday = false,
  completedCount,
  progressPoints,
  onBack,
  onStart,
}) => {
  const firstParagraph = lesson.passage.split(/\n\s*\n/).filter(Boolean)[0] || '';
  const previewWords = firstParagraph.split(/\s+/).filter(Boolean);
  const excerpt =
    previewWords.length > 64 ? previewWords.slice(0, 64).join(' ') + '…' : firstParagraph;
  const latestAccuracy = progressPoints.length
    ? progressPoints[progressPoints.length - 1].accuracy
    : null;
  const effectiveLongestStreak = Math.max(longestStreak, streakDays);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-semibold text-[#76675B] hover:bg-[#F2EDE3] hover:text-[#171615] focus:outline-none focus:ring-2 focus:ring-[#A63816] cursor-pointer transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to your dashboard
      </button>

      <section className="relative overflow-hidden rounded-2xl border border-[#E3D7C3] bg-[#FFFDFA] shadow-sm">
        <CornerBotanicalSprig className="pointer-events-none absolute -right-4 -top-4 h-28 w-28 opacity-45" />
        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative min-h-64 bg-[#F2EDE3] lg:min-h-[360px]">
            <img
              src={lesson.illustrationUrl}
              alt={lesson.illustrationAlt || lesson.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5 pt-16 text-white">
              <span className="rounded-full bg-[#FAF7F1]/95 px-3 py-1 text-xs font-bold text-[#A63816]">
                {lesson.level} · {lesson.estimatedMinutes} min read
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-center p-6 sm:p-9">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#A63816]">
              Your passage is ready
            </span>
            <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-[#171615] sm:text-4xl">
              {lesson.title}
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-[#76675B]">{lesson.introduction}</p>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-[#76675B]">
              <span className="rounded-md bg-[#F2EDE3] px-2.5 py-1 text-[#171615]">
                {lesson.topic}
              </span>
              <span className="py-1">
                {lesson.wordCount || lesson.passage.split(/\s+/).length} words
              </span>
              <span className="py-1">{lesson.questions.length} comprehension questions</span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-[0.72fr_1.28fr]" aria-label="Your reading progress">
        <article className="flex items-center gap-4 rounded-2xl border border-[#E3D7C3] bg-[#F2EDE3] p-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F7E9DC] text-[#A63816]">
            <Flame className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-bold uppercase tracking-wider text-[#76675B]">
                Reading streak
              </p>
              <span className="font-mono-code text-[11px] font-semibold text-[#76675B] tabular-nums">
                Best: {effectiveLongestStreak} {effectiveLongestStreak === 1 ? 'day' : 'days'}
              </span>
            </div>
            <p className="mt-0.5 font-display text-2xl font-bold text-[#171615] tabular-nums">
              {streakDays} {streakDays === 1 ? 'day' : 'days'}
            </p>
            <p className="mt-1 text-xs text-[#76675B]">
              {studiedToday
                ? 'Studied today — keep your reading rhythm going.'
                : streakDays > 0
                ? 'Finish a passage today to extend your streak.'
                : 'Finish a passage today to begin your streak.'}
            </p>
          </div>
        </article>

        <article className="rounded-2xl border border-[#E3D7C3] bg-[#FFFDFA] p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#76675B]">
                Your progress
              </p>
              <p className="mt-1 text-sm font-semibold text-[#171615]">
                {completedCount
                  ? completedCount +
                    ' completed ' +
                    (completedCount === 1 ? 'passage' : 'passages') +
                    ' · recent accuracy'
                  : 'Your reading progress will appear here'}
              </p>
            </div>
            <TrendingUp className="h-5 w-5 shrink-0 text-[#A63816]" aria-hidden="true" />
          </div>
          {progressPoints.length ? (
            <div className="mt-3">
              <svg
                viewBox="0 0 300 104"
                role="img"
                aria-label="Recent completed passage accuracy chart"
                className="h-24 w-full overflow-visible"
              >
                <line x1="20" y1="10" x2="280" y2="10" stroke="#E3D7C3" strokeDasharray="4 4" />
                <line x1="20" y1="50" x2="280" y2="50" stroke="#E3D7C3" strokeDasharray="4 4" />
                <line x1="20" y1="90" x2="280" y2="90" stroke="#E3D7C3" strokeDasharray="4 4" />
                <polyline
                  fill="none"
                  stroke="#A63816"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={progressPoints.map((point) => point.x + ',' + point.y).join(' ')}
                />
                {progressPoints.map((point) => (
                  <circle key={point.id} cx={point.x} cy={point.y} r="4" fill="#A63816">
                    <title>{point.accuracy}%</title>
                  </circle>
                ))}
              </svg>
              <div className="flex justify-between text-[10px] text-[#76675B]">
                <span>Earlier</span>
                <span>Latest · {latestAccuracy}%</span>
              </div>
            </div>
          ) : (
            <div className="mt-3 rounded-lg bg-[#FAF7F1] px-3 py-2 text-xs text-[#76675B]">
              Complete your first passage and your progress trend will show here.
            </div>
          )}
        </article>
      </section>

      <article className="rounded-2xl border border-[#E3D7C3] bg-[#FFFDFA] p-5 sm:p-7">
        <div className="mb-3 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-[#A63816]" />
          <h2 className="font-display text-lg font-bold text-[#171615]">A glimpse of the passage</h2>
        </div>
        <p className="max-w-4xl font-serif-passage text-sm leading-7 text-[#171615] sm:text-base">
          {excerpt}
        </p>
        <p className="mt-2 text-xs text-[#76675B]">
          Start reading to see the full passage and questions.
        </p>
      </article>

      <div className="sticky bottom-3 z-20 flex justify-center">
        <button
          type="button"
          onClick={onStart}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#A63816] px-8 py-3 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#842B12] focus:outline-none focus:ring-4 focus:ring-[#A63816]/30 cursor-pointer"
        >
          Start Reading <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
};
