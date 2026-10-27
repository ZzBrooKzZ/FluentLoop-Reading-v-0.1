import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { PublicGuideHeader } from '@/src/components/PublicGuideHeader';
import { PublicFooter } from '@/src/components/PublicFooter';
import { AdSenseSlotReserve } from '@/src/components/AdSenseSlotReserve';

export const metadata: Metadata = {
  title: 'Learning Academic English Vocabulary in Context (English-to-English)',
  description:
    'Learn why contextual English-to-English vocabulary explanations build faster reading comprehension and academic fluency than word-for-word bilingual translation.',
  alternates: {
    canonical: '/guides/vocabulary-in-context',
  },
  openGraph: {
    title: 'Learning Academic English Vocabulary in Context | FluentLoop',
    description:
      'How to master academic vocabulary using contextual English definitions, part-of-speech cues, and sentence-level evidence.',
    url: '/guides/vocabulary-in-context',
    type: 'article',
  },
};

export default function VocabularyInContextGuidePage() {
  return (
    <div className="min-h-screen bg-[#FAF7F1] text-[#171615] flex flex-col">
      <PublicGuideHeader />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 sm:px-8 py-10 space-y-10">
        <header className="space-y-4 border-b border-[#E3D7C3] pb-8">
          <div className="font-mono-code text-xs font-bold uppercase tracking-widest text-[#A63816]">
            Lexical Acquisition · English-to-English Immersion
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold leading-tight text-[#171615]">
            Why Contextual English-to-English Vocabulary Beats Isolated Word Lists
          </h1>
          <p className="text-base sm:text-lg text-[#76675B] leading-relaxed">
            In academic reading, words frequently shift meaning depending on their discipline,
            collocation, and grammatical role. Relying on single-word bilingual translations often
            obscures what an author is actually arguing.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-[#171615]">
            1. General Definition vs. Meaning in Passage Context
          </h2>
          <p className="text-sm sm:text-base text-[#76675B] leading-relaxed">
            Every highlighted vocabulary item in FluentLoop provides two complementary explanations
            in plain English:
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-[#E3D7C3] bg-[#FFFDFA] p-5 space-y-2">
              <h3 className="font-display text-lg font-bold text-[#171615]">
                Simple English Definition
              </h3>
              <p className="text-xs sm:text-sm text-[#76675B] leading-relaxed">
                A clear, learner-friendly definition written using familiar everyday words so you
                can grasp the core concept without needing a second dictionary.
              </p>
            </div>
            <div className="rounded-xl border border-[#E3D7C3] bg-[#FFFDFA] p-5 space-y-2">
              <h3 className="font-display text-lg font-bold text-[#A63816]">
                Meaning in This Specific Passage
              </h3>
              <p className="text-xs sm:text-sm text-[#76675B] leading-relaxed">
                Explains what the word or phrase refers to inside that exact paragraph—connecting
                abstract vocabulary directly to the scientific, historical, or economic argument.
              </p>
            </div>
          </div>
        </section>

        <AdSenseSlotReserve slotId="guide-vocab-mid" format="in-article" />

        <section className="rounded-2xl border border-[#E3D7C3] bg-[#F2EDE3] p-6 sm:p-8 space-y-4">
          <h2 className="font-display text-2xl font-bold text-[#171615]">
            2. Four Steps for Retaining Academic Vocabulary While Reading
          </h2>
          <ol className="list-decimal pl-5 space-y-3 text-sm text-[#171615] leading-relaxed">
            <li>
              <strong>Read the full sentence first:</strong> Before opening a vocabulary popup, use
              surrounding contrast words (<em>however, whereas, consequently</em>) to predict
              whether the word has a positive, negative, or causal role.
            </li>
            <li>
              <strong>Check the Contextual Meaning:</strong> Hover or tap the highlighted word to
              verify both its general meaning and its specific role in the passage.
            </li>
            <li>
              <strong>Save High-Utility Academic Terms:</strong> Add versatile academic verbs,
              nouns, and collocations to your personal Vocabulary Bank.
            </li>
            <li>
              <strong>Review with Original Passage Sentences:</strong> Re-read the original sentence
              in your Vocabulary Bank and mark words as recalled as your mastery stage advances from
              1/5 to 5/5.
            </li>
          </ol>
        </section>

        <section className="rounded-2xl border border-[#E3D7C3] bg-white p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-bold text-[#171615]">
              Explore Contextual Vocabulary in Real Passages
            </h2>
            <p className="text-xs sm:text-sm text-[#76675B]">
              Inspect our public sample lessons across CEFR A1–C1 or open the full interactive
              reading workspace.
            </p>
          </div>
          <Link
            href="/sample-lessons"
            className="rounded-xl bg-[#A63816] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#842B12]"
          >
            Browse Public Sample Passages →
          </Link>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
