import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { PublicGuideHeader } from '@/src/components/PublicGuideHeader';
import { PublicFooter } from '@/src/components/PublicFooter';
import { AdSenseSlotReserve } from '@/src/components/AdSenseSlotReserve';

export const metadata: Metadata = {
  title: 'CEFR Reading Levels (A1 to C1) & Academic Stamina Guide',
  description:
    'Understand how English reading passages progress from CEFR A1 beginner texts to B2 and C1 university-level academic articles, word counts, and adaptive progression.',
  alternates: {
    canonical: '/guides/cefr-reading-levels',
  },
  openGraph: {
    title: 'CEFR Reading Levels (A1 to C1) & Academic Stamina Guide | FluentLoop',
    description:
      'Compare passage word counts, lexical density, sentence structure, and comprehension tasks across CEFR A1, A2, B1, B2, and C1 reading levels.',
    url: '/guides/cefr-reading-levels',
    type: 'article',
  },
};

export default function CefrReadingLevelsGuidePage() {
  const levels = [
    {
      level: 'A1',
      name: 'Beginner Foundation',
      wordRange: '150–250 words',
      sampleSlug: 'a1-sci-solar-lamps',
      focus:
        'Concrete everyday and introductory science topics using clear subject-verb-object sentences, high-frequency verbs, and essential foundational expressions.',
    },
    {
      level: 'A2',
      name: 'Elementary Academic',
      wordRange: '250–400 words',
      sampleSlug: 'a2-sci-desalination-plants',
      focus:
        'Factual historical and scientific descriptions introducing cause-and-effect connectors, common collocations, and multi-paragraph organization.',
    },
    {
      level: 'B1',
      name: 'Intermediate Academic',
      wordRange: '500–700 words',
      sampleSlug: 'b1-sci-sodium-batteries',
      focus:
        'Structured multi-paragraph articles developing reading stamina, contrasting viewpoints, and core academic vocabulary across architecture, ecology, and psychology.',
    },
    {
      level: 'B2',
      name: 'Upper-Intermediate IELTS',
      wordRange: '800–900 words',
      sampleSlug: 'b2-sci-bioluminescence-tech',
      focus:
        'Substantial academic articles featuring nuanced arguments, technical terminology explained in context, and full IELTS Academic question sets.',
    },
    {
      level: 'C1',
      name: 'Advanced Scholarly Synthesis',
      wordRange: '900–1,000 words',
      sampleSlug: 'c1-01-neuromorphic-computing',
      focus:
        'Dense scholarly texts requiring synthesis of competing hypotheses, subtle writer stance evaluation, and idiomatic academic discourse.',
    },
    {
      level: 'C2',
      name: 'Mastery & Proficiency',
      wordRange: '1,050–1,250 words',
      sampleSlug: 'c2-01-quantum-decoherence-topological',
      focus:
        'Long-form critical essays and cross-disciplinary monographs demanding nuanced rhetorical critique, epistemological evaluation, and mastery of implicit argumentation.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F1] text-[#171615] flex flex-col">
      <PublicGuideHeader />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 sm:px-8 py-10 space-y-10">
        <header className="space-y-4 border-b border-[#E3D7C3] pb-8">
          <div className="font-mono-code text-xs font-bold uppercase tracking-widest text-[#A63816]">
            CEFR A1–C2 Curriculum · Reading Stamina & Progression
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold leading-tight text-[#171615]">
            English Reading Levels Explained: From CEFR A1 Foundation to C2 Academic Mastery
          </h1>
          <p className="text-base sm:text-lg text-[#76675B] leading-relaxed">
            Building academic reading fluency requires gradual exposure to longer passages, denser
            syntax, and more abstract vocabulary—without overwhelming your working memory.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-[#171615]">
            Target Passage Lengths & Lexical Demands by CEFR Level
          </h2>
          <div className="space-y-4">
            {levels.map((item) => (
              <article
                key={item.level}
                className="rounded-xl border border-[#E3D7C3] bg-[#FFFDFA] p-6 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="rounded-lg bg-[#A63816] px-3 py-1 font-mono-code text-sm font-bold text-white">
                      {item.level}
                    </span>
                    <h3 className="font-display text-xl font-bold text-[#171615]">{item.name}</h3>
                  </div>
                  <span className="font-mono-code text-xs font-semibold text-[#76675B]">
                    Target Length: {item.wordRange}
                  </span>
                </div>
                <p className="text-sm text-[#76675B] leading-relaxed">{item.focus}</p>
                <div>
                  <Link
                    href={`/sample-lessons/${item.sampleSlug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#A63816] hover:underline"
                  >
                    Read {item.level} Public Sample Passage →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <AdSenseSlotReserve slotId="guide-cefr-mid" format="in-article" />

        <section className="rounded-2xl border border-[#E3D7C3] bg-[#F2EDE3] p-6 sm:p-8 space-y-3">
          <h2 className="font-display text-2xl font-bold text-[#171615]">
            How Adaptive Progression Works in FluentLoop
          </h2>
          <p className="text-sm text-[#76675B] leading-relaxed">
            When you choose a comfortable starting level, FluentLoop selects unseen passages that
            match your current reading comfort. As you complete first-time assessments with strong
            comprehension accuracy, the system gradually introduces more demanding passages within
            your CEFR band before advancing you to the next CEFR level.
          </p>
          <p className="text-sm text-[#76675B] leading-relaxed">
            Reviewing completed lessons or practicing a passage a second time is always encouraged
            and never penalizes your adaptive standing.
          </p>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
