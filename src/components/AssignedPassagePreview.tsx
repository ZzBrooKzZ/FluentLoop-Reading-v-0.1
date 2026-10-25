import React from 'react';
import { ArrowLeft, BookOpen, Flame, TrendingUp } from 'lucide-react';
import { ReadingLesson } from '../types/reading';

interface ProgressPoint { id: string; x: number; y: number; accuracy: number; }
interface AssignedPassagePreviewProps {
  lesson: ReadingLesson;
  streakDays: number;
  completedCount: number;
  progressPoints: ProgressPoint[];
  onBack: () => void;
  onStart: () => void;
}

export const AssignedPassagePreview: React.FC<AssignedPassagePreviewProps> = ({ lesson, streakDays, completedCount, progressPoints, onBack, onStart }) => {
  const firstParagraph = lesson.passage.split(/\n\s*\n/).filter(Boolean)[0] || '';
  const previewWords = firstParagraph.split(/\s+/).filter(Boolean);
  const excerpt = previewWords.length > 64 ? previewWords.slice(0, 64).join(' ') + '…' : firstParagraph;
  const latestAccuracy = progressPoints.length ? progressPoints[progressPoints.length - 1].accuracy : null;
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-[#57534E] hover:bg-[#F3EFE6] hover:text-[#141413] focus:outline-none focus:ring-2 focus:ring-[#9A3412]"><ArrowLeft className="h-4 w-4"/> Back to your dashboard</button>
      <section className="overflow-hidden rounded-2xl border border-[#E5DEC9] bg-white shadow-sm"><div className="grid lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative min-h-64 bg-[#EAE3D5] lg:min-h-[360px]"><img src={lesson.illustrationUrl} alt={lesson.illustrationAlt || lesson.title} className="absolute inset-0 h-full w-full object-cover"/><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent p-5 pt-16 text-white"><span className="rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-[#9A3412]">{lesson.level} · {lesson.estimatedMinutes} min read</span></div></div>
        <div className="flex flex-col justify-center p-6 sm:p-9"><span className="text-xs font-bold uppercase tracking-[0.16em] text-[#9A3412]">Your passage is ready</span><h1 className="mt-3 font-display text-3xl font-bold leading-tight text-[#141413] sm:text-4xl">{lesson.title}</h1><p className="mt-4 text-sm leading-relaxed text-[#57534E]">{lesson.introduction}</p><div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-[#78716C]"><span>{lesson.topic}</span><span>{lesson.wordCount || lesson.passage.split(/\s+/).length} words</span><span>{lesson.questions.length} comprehension questions</span></div></div>
      </div></section>
      <section className="grid gap-4 md:grid-cols-[0.72fr_1.28fr]" aria-label="Your reading progress">
        <article className="flex items-center gap-4 rounded-2xl border border-[#E5DEC9] bg-[#F3EFE6] p-5"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FDE7C5] text-[#9A3412]"><Flame className="h-6 w-6" aria-hidden="true"/></div><div><p className="text-xs font-bold uppercase tracking-wider text-[#78716C]">Reading streak</p><p className="mt-0.5 font-display text-2xl font-bold text-[#141413]">{streakDays} {streakDays === 1 ? 'day' : 'days'}</p><p className="mt-1 text-xs text-[#57534E]">{streakDays ? 'Keep your reading rhythm going.' : 'Finish a passage today to begin your streak.'}</p></div></article>
        <article className="rounded-2xl border border-[#E5DEC9] bg-white p-5"><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-[#78716C]">Your progress</p><p className="mt-1 text-sm font-semibold text-[#141413]">{completedCount ? completedCount + ' completed ' + (completedCount === 1 ? 'passage' : 'passages') + ' · recent accuracy' : 'Your reading progress will appear here'}</p></div><TrendingUp className="h-5 w-5 shrink-0 text-[#9A3412]" aria-hidden="true"/></div>
          {progressPoints.length ? <div className="mt-3"><svg viewBox="0 0 300 104" role="img" aria-label="Recent completed passage accuracy chart" className="h-24 w-full overflow-visible"><line x1="20" y1="10" x2="280" y2="10" stroke="#E5DEC9" strokeDasharray="4 4"/><line x1="20" y1="50" x2="280" y2="50" stroke="#E5DEC9" strokeDasharray="4 4"/><line x1="20" y1="90" x2="280" y2="90" stroke="#E5DEC9" strokeDasharray="4 4"/><polyline fill="none" stroke="#9A3412" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={progressPoints.map((point) => point.x + ',' + point.y).join(' ')}/>{progressPoints.map((point) => <circle key={point.id} cx={point.x} cy={point.y} r="4" fill="#9A3412"><title>{point.accuracy}%</title></circle>)}</svg><div className="flex justify-between text-[10px] text-[#78716C]"><span>Earlier</span><span>Latest · {latestAccuracy}%</span></div></div> : <div className="mt-3 rounded-lg bg-[#FAF7F2] px-3 py-2 text-xs text-[#57534E]">Complete your first passage and your progress trend will show here.</div>}
        </article>
      </section>
      <article className="rounded-2xl border border-[#E5DEC9] bg-white p-5 sm:p-7"><div className="mb-3 flex items-center gap-2"><BookOpen className="h-5 w-5 text-[#9A3412]"/><h2 className="font-display text-lg font-bold">A glimpse of the passage</h2></div><p className="max-w-4xl text-sm leading-7 text-[#292524] sm:text-base">{excerpt}</p><p className="mt-2 text-xs text-[#78716C]">Start reading to see the full passage and questions.</p></article>
      <div className="sticky bottom-3 z-20 flex justify-center"><button type="button" onClick={onStart} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#9A3412] px-8 py-3 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#7C2D12] focus:outline-none focus:ring-4 focus:ring-[#9A3412]/30">Start Reading <span aria-hidden="true">→</span></button></div>
    </div>
  );
};

