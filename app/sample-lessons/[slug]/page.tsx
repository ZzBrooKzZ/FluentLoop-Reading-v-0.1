import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPublicSampleLessons } from '@/src/server/lessonRepository';
import { QUESTION_TYPE_LABELS } from '@/src/services/gradingService';
import { PublicGuideHeader } from '@/src/components/PublicGuideHeader';
import { PublicFooter } from '@/src/components/PublicFooter';
import { AdSenseSlotReserve } from '@/src/components/AdSenseSlotReserve';
import { getPassagePhotoMetadata } from '@/src/utils/illustrations';

export function generateStaticParams() {
  const samples = getPublicSampleLessons();
  return samples.map((l) => ({ slug: l.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lesson = getPublicSampleLessons().find((l) => l.id === slug);
  if (!lesson) {
    return {
      title: 'Sample Lesson Not Found',
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${lesson.title} — CEFR ${lesson.level} Academic Reading Sample`,
    description: `${lesson.introduction} Read this CEFR ${lesson.level} academic passage with ${lesson.vocabulary.length} contextual English-to-English vocabulary explanations and IELTS comprehension questions.`,
    alternates: {
      canonical: `/sample-lessons/${lesson.id}`,
    },
    openGraph: {
      title: `${lesson.title} (CEFR ${lesson.level}) | FluentLoop Reading`,
      description: lesson.introduction,
      url: `/sample-lessons/${lesson.id}`,
      type: 'article',
      images: [
        {
          url: lesson.illustrationUrl,
          width: 1200,
          height: 675,
          alt: lesson.illustrationAlt,
        },
      ],
    },
  };
}

export default async function SampleLessonDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = getPublicSampleLessons().find((l) => l.id === slug);
  if (!lesson) {
    notFound();
  }

  const paragraphs = lesson.passage.split(/\n\s*\n/).filter(Boolean);
  const wordCount = lesson.wordCount || lesson.passage.split(/\s+/).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#FAF7F1] text-[#171615] flex flex-col">
      <PublicGuideHeader />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 sm:px-8 py-10 space-y-10">
        <nav className="text-xs font-semibold text-[#76675B]">
          <Link href="/sample-lessons" className="hover:text-[#A63816] hover:underline">
            ← All Public Sample Passages
          </Link>
        </nav>

        <header className="space-y-3 border-b border-[#E3D7C3] pb-6">
          <div className="text-xs sm:text-sm text-[#76675B] tabular-nums">
            <strong className="font-mono-code font-bold text-[#A63816]">
              CEFR {lesson.level} Sample
            </strong>{' '}
            · {lesson.topic} · {wordCount} words · {lesson.estimatedMinutes} min read ·{' '}
            {lesson.vocabulary.length} annotated vocabulary terms
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#171615] leading-tight">
            {lesson.title}
          </h1>
          <p className="text-base text-[#76675B] leading-relaxed">{lesson.introduction}</p>
        </header>

        <figure className="overflow-hidden rounded-xl border border-[#E3D7C3] bg-[#F2EDE3]">
          <div className="aspect-video w-full overflow-hidden">
            <img
              src={lesson.illustrationUrl}
              alt={lesson.illustrationAlt}
              width={1200}
              height={675}
              className="h-full w-full object-cover"
            />
          </div>
          {(() => {
            const photoMeta = getPassagePhotoMetadata(lesson.id);
            if (!photoMeta) return null;
            return (
              <figcaption className="flex flex-wrap items-center justify-between gap-2 border-t border-[#E3D7C3] bg-[#FAF7F1] px-4 py-2 text-[11px] text-[#76675B]">
                <span>Photo: {photoMeta.photographer}</span>
                <a
                  href={photoMeta.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#A63816] hover:underline"
                >
                  {photoMeta.sourceName} ({photoMeta.license})
                </a>
              </figcaption>
            );
          })()}
        </figure>

        <article className="rounded-xl border border-[#E3D7C3] bg-[#FFFDFA] p-6 sm:p-8 space-y-5 font-serif-passage text-base sm:text-lg leading-relaxed text-[#171615]">
          {paragraphs.map((para, idx) => (
            <p key={idx}>
              <span className="mr-2 font-mono-code text-xs font-bold text-[#A63816]">
                [{String.fromCharCode(65 + idx)}]
              </span>
              {para}
            </p>
          ))}
        </article>

        <AdSenseSlotReserve slotId={`sample-lesson-${lesson.level.toLowerCase()}`} format="in-article" />

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-[#171615]">
            Contextual English-to-English Vocabulary Glossary ({lesson.vocabulary.length} Terms)
          </h2>
          <p className="text-xs sm:text-sm text-[#76675B]">
            In the interactive FluentLoop reader, hovering or tapping any of these words inside the
            passage opens a floating explanation bubble without shifting the page layout.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {lesson.vocabulary.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-[#E3D7C3] bg-white p-4 space-y-1.5 text-xs sm:text-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <strong className="font-display text-base font-bold text-[#171615]">
                    {item.word}
                  </strong>
                  <span className="font-mono-code text-xs text-[#A63816]">{item.partOfSpeech}</span>
                </div>
                <p className="text-[#76675B]">
                  <span className="font-semibold text-[#171615]">Definition: </span>
                  {item.simpleDefinition}
                </p>
                <p className="text-[#171615]">
                  <span className="font-semibold text-[#A63816]">In this passage: </span>
                  {item.contextMeaning}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[#E3D7C3] bg-[#F2EDE3] p-6 sm:p-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-[#171615]">
                Sample Comprehension Questions ({lesson.questions.length} Items)
              </h2>
              <p className="text-xs sm:text-sm text-[#76675B]">
                Launch the interactive reading app to submit answers, receive instant IELTS &
                semantic grading, and highlight passage evidence quotes.
              </p>
            </div>
            <Link
              href="/"
              className="rounded-xl bg-[#A63816] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#842B12]"
            >
              Take Interactive Assessment →
            </Link>
          </div>

          <div className="space-y-3 pt-2">
            {lesson.questions.slice(0, 5).map((q, idx) => (
              <div
                key={q.id}
                className="rounded-lg border border-[#E3D7C3] bg-[#FFFDFA] p-4 space-y-1"
              >
                <div className="font-mono-code text-xs font-semibold text-[#A63816]">
                  Question {idx + 1} · {QUESTION_TYPE_LABELS[q.type] || q.type}
                </div>
                <p className="text-sm font-medium text-[#171615]">{q.prompt}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
