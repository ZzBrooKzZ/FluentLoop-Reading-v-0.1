import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { PublicGuideHeader } from '@/src/components/PublicGuideHeader';
import { PublicFooter } from '@/src/components/PublicFooter';
import { AdSenseSlotReserve } from '@/src/components/AdSenseSlotReserve';

export const metadata: Metadata = {
  title: 'IELTS Academic Reading Preparation Guide & Question Formats',
  description:
    'Master all 12 IELTS Academic Reading question types including True/False/Not Given, Yes/No/Not Given, Matching Headings, Summary Completion, and strict word-limit rules.',
  alternates: {
    canonical: '/guides/ielts-academic-reading',
  },
  openGraph: {
    title: 'IELTS Academic Reading Preparation Guide & Question Formats | FluentLoop',
    description:
      'Detailed breakdown of IELTS Academic Reading question formats, strict word-limit conventions, and evidence localization strategies.',
    url: '/guides/ielts-academic-reading',
    type: 'article',
  },
};

export default function IeltsAcademicReadingGuidePage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is the difference between True/False/Not Given and Yes/No/Not Given in IELTS Reading?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'True/False/Not Given tests factual statements that can be verified directly against objective facts in the passage. Yes/No/Not Given tests whether a statement agrees with the writer’s expressed claims, views, or arguments.',
        },
      },
      {
        '@type': 'Question',
        name: 'How are hyphenated words counted in IELTS Reading completion tasks?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Under standard IELTS conventions, hyphenated compounds such as "mass-timber" or "up-to-date" count as a single word toward instructions like ONE WORD ONLY or NO MORE THAN TWO WORDS.',
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#141413] flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <PublicGuideHeader />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 sm:px-8 py-10 space-y-10">
        <header className="space-y-4 border-b border-[#E5DEC9] pb-8">
          <div className="font-mono-code text-xs font-bold uppercase tracking-widest text-[#9A3412]">
            IELTS Academic Preparation · Assessment Methodology
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold leading-tight text-[#141413]">
            IELTS Academic Reading: Complete Guide to Question Formats & Evidence Strategy
          </h1>
          <p className="text-base sm:text-lg text-[#57534E] leading-relaxed">
            The IELTS Academic Reading test evaluates how accurately you can locate factual details,
            follow complex arguments, recognize writer opinion, and synthesize academic prose under
            strict word-count constraints.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-[#141413]">
            1. The 12 Core IELTS Academic Question Types
          </h2>
          <p className="text-sm sm:text-base text-[#57534E] leading-relaxed">
            Rather than testing every format on a single text, academic reading passages naturally
            suit specific assessment tasks. Descriptive engineering and historical passages often
            pair with Note Completion and True/False/Not Given, whereas analytical arguments pair
            with Matching Headings and Yes/No/Not Given.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 pt-2">
            {[
              [
                'True / False / Not Given',
                'Evaluate whether a factual statement agrees with the information in the text (True), directly contradicts it (False), or is neither confirmed nor denied (Not Given).',
              ],
              [
                'Yes / No / Not Given',
                'Evaluate whether a statement agrees with the views or claims of the writer (Yes), contradicts the writer’s view (No), or is not stated (Not Given).',
              ],
              [
                'Note, Summary & Sentence Completion',
                'Fill in missing gaps using exact words from the passage or selections from a provided word bank while respecting strict word limits (e.g., ONE WORD ONLY).',
              ],
              [
                'Matching Headings & Information',
                'Identify the main theme of each paragraph (Matching Headings) or locate which paragraph contains a specific piece of evidence, example, or cause-and-effect claim.',
              ],
              [
                'Matching Features & Sentence Endings',
                'Connect researchers, historical periods, or architectural systems to their specific characteristics, or complete sentence stems accurately based on passage logic.',
              ],
              [
                'Multiple Choice (Single & Choose Two) & Short Answer',
                'Select the single best analytical option, choose exactly two valid conclusions from five choices, or write a concise factual short answer.',
              ],
            ].map(([title, desc]) => (
              <article
                key={title}
                className="rounded-xl border border-[#E5DEC9] bg-[#FFFDF9] p-5 space-y-2"
              >
                <h3 className="font-display text-lg font-bold text-[#9A3412]">{title}</h3>
                <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">{desc}</p>
              </article>
            ))}
          </div>
        </section>

        <AdSenseSlotReserve slotId="guide-ielts-mid" format="in-article" />

        <section className="rounded-2xl border border-[#D8CFC2] bg-[#F3EFE6] p-6 sm:p-8 space-y-4">
          <h2 className="font-display text-2xl font-bold text-[#141413]">
            2. Strict IELTS Word-Limit Rules Explained
          </h2>
          <p className="text-sm sm:text-base text-[#57534E] leading-relaxed">
            One of the most common causes of lost marks in IELTS Academic Reading is exceeding the
            stated word limit on completion and short-answer questions:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-sm text-[#141413] leading-relaxed">
            <li>
              <strong>ONE WORD ONLY:</strong> Writing two words (even adding an unnecessary article
              like <em>&ldquo;the turbine&rdquo;</em> when <em>&ldquo;turbine&rdquo;</em> is
              expected) is marked incorrect under strict instruction rules.
            </li>
            <li>
              <strong>NO MORE THAN TWO WORDS:</strong> Your response may be one word or two words,
              but never three.
            </li>
            <li>
              <strong>Hyphenated Words:</strong> Standard hyphenated compounds such as{' '}
              <code>mass-timber</code> or <code>high-frequency</code> count as a single word.
            </li>
            <li>
              <strong>Passage Fidelity:</strong> For completion tasks without a word bank, the words
              you write must appear directly in the reading passage without altering their
              grammatical form.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-[#141413]">
            3. False vs. Not Given: Avoiding the Classic Inference Trap
          </h2>
          <p className="text-sm sm:text-base text-[#57534E] leading-relaxed">
            Strong academic readers often over-infer when a topic is mentioned in a paragraph. To
            distinguish <strong>False/No</strong> from <strong>Not Given</strong>:
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-[#E5DEC9] bg-white p-5 space-y-2">
              <h3 className="font-mono-code text-xs font-bold uppercase text-[#B91C1C]">
                When to choose FALSE or NO
              </h3>
              <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
                The passage explicitly states the opposite fact or an incompatible quantity,
                direction, or relationship. You can highlight a specific sentence in the passage
                that proves the statement wrong.
              </p>
            </div>
            <div className="rounded-xl border border-[#E5DEC9] bg-white p-5 space-y-2">
              <h3 className="font-mono-code text-xs font-bold uppercase text-[#0369A1]">
                When to choose NOT GIVEN
              </h3>
              <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
                The passage mentions the subject or nouns in the question, but never confirms or
                denies the specific comparison, intention, or outcome claimed in the statement.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-[#E5DEC9] bg-white p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1 max-w-xl">
            <h2 className="font-display text-xl font-bold text-[#141413]">
              Practice with Interactive Passage Evidence Highlighting
            </h2>
            <p className="text-xs sm:text-sm text-[#57534E]">
              Try our curated public sample passages or launch the adaptive reading workspace to
              practice across CEFR A1–C1 levels.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/sample-lessons"
              className="rounded-xl border border-[#D8CFC2] bg-[#FAF7F2] px-4 py-2.5 text-xs font-semibold text-[#141413] hover:bg-[#F3EFE6]"
            >
              View Sample Passages
            </Link>
            <Link
              href="/"
              className="rounded-xl bg-[#9A3412] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#7C2D12]"
            >
              Start Adaptive Practice →
            </Link>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
