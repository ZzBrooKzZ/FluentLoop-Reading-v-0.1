import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getPublicSampleLessons } from '@/src/server/lessonRepository';
import { PublicGuideHeader } from '@/src/components/PublicGuideHeader';
import { PublicFooter } from '@/src/components/PublicFooter';
import { AdSenseSlotReserve } from '@/src/components/AdSenseSlotReserve';

export const metadata: Metadata = {
  title: 'Public Sample Academic Reading Passages (CEFR A1–C1)',
  description:
    'Explore curated sample English reading passages from CEFR A1 to C1 with contextual English-to-English vocabulary annotations and IELTS Academic comprehension questions.',
  alternates: {
    canonical: '/sample-lessons',
  },
  openGraph: {
    title: 'Public Sample Academic Reading Passages (CEFR A1–C1) | FluentLoop',
    description:
      'Preview representative A1, A2, B1, B2, and C1 reading passages with contextual vocabulary and IELTS Academic question formats.',
    url: '/sample-lessons',
    type: 'website',
  },
};

export default function SampleLessonsIndexPage() {
  const sampleLessons = getPublicSampleLessons();

  return (
    <div className="min-h-screen bg-[#FAF7F1] text-[#171615] flex flex-col">
      <PublicGuideHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 sm:px-8 py-10 space-y-10">
        <header className="space-y-4 border-b border-[#E3D7C3] pb-8">
          <div className="font-mono-code text-xs font-bold uppercase tracking-widest text-[#A63816]">
            Representative Curriculum Samples · CEFR A1–C1
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold leading-tight text-[#171615]">
            Public Sample Academic Reading Passages
          </h1>
          <p className="text-base sm:text-lg text-[#76675B] max-w-3xl leading-relaxed">
            Explore one representative reading lesson from each CEFR level (A1 through C1). Each
            sample demonstrates FluentLoop’s academic prose, contextual English-to-English
            vocabulary explanations, and IELTS-style comprehension tasks while keeping our broader
            adaptive passage library unseen for personalized progression.
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sampleLessons.map((lesson) => {
            const wc = lesson.wordCount || lesson.passage.split(/\s+/).filter(Boolean).length;
            return (
              <article
                key={lesson.id}
                className="flex flex-col overflow-hidden rounded-xl border border-[#E3D7C3] bg-[#FFFDFA] shadow-xs transition hover:border-[#A63816] hover:shadow-md"
              >
                <div className="aspect-video w-full overflow-hidden border-b border-[#E3D7C3] bg-[#F2EDE3]">
                  <img
                    src={lesson.illustrationUrl}
                    alt={lesson.illustrationAlt}
                    width={640}
                    height={360}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
                  <div className="space-y-2">
                    <div className="text-xs text-[#76675B] tabular-nums">
                      <strong className="font-mono-code font-bold text-[#A63816]">
                        CEFR {lesson.level}
                      </strong>{' '}
                      · {lesson.topic}
                    </div>
                    <h2 className="font-display text-lg font-bold text-[#171615] leading-snug">
                      <Link
                        href={`/sample-lessons/${lesson.id}`}
                        className="hover:text-[#A63816] hover:underline"
                      >
                        {lesson.title}
                      </Link>
                    </h2>
                    <p className="text-xs text-[#76675B] leading-relaxed line-clamp-3">
                      {lesson.introduction}
                    </p>
                  </div>
                  <div className="border-t border-[#E3D7C3] pt-3 flex items-center justify-between text-xs text-[#76675B] tabular-nums">
                    <span>
                      {wc} words · {lesson.vocabulary.length} vocabulary terms
                    </span>
                    <Link
                      href={`/sample-lessons/${lesson.id}`}
                      className="font-bold text-[#A63816] hover:underline"
                    >
                      Read Sample →
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <AdSenseSlotReserve slotId="sample-lessons-index" format="horizontal" />
      </main>

      <PublicFooter />
    </div>
  );
}
