import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { PublicGuideHeader } from '@/src/components/PublicGuideHeader';
import { PublicFooter } from '@/src/components/PublicFooter';

export const metadata: Metadata = {
  title: 'About FluentLoop Reading — Academic English & IELTS Practice',
  description:
    'Learn how FluentLoop Reading helps English learners build academic reading stamina, contextual vocabulary, and IELTS comprehension skills across CEFR A1–C1.',
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F1] text-[#171615] flex flex-col">
      <PublicGuideHeader />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 sm:px-8 py-10 space-y-8">
        <header className="space-y-3 border-b border-[#E3D7C3] pb-6">
          <div className="font-mono-code text-xs font-bold uppercase tracking-widest text-[#A63816]">
            Platform Mission & Methodology
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#171615]">
            About FluentLoop Reading
          </h1>
          <p className="text-base sm:text-lg text-[#76675B] leading-relaxed">
            FluentLoop Reading is an academic English reading and vocabulary platform designed to
            help learners transition from foundational reading comprehension (CEFR A1–A2) to
            university-level and IELTS Academic texts (CEFR B1–C1).
          </p>
        </header>

        <section className="space-y-4 text-sm sm:text-base text-[#76675B] leading-relaxed">
          <h2 className="font-display text-2xl font-bold text-[#171615]">
            Our Educational Approach
          </h2>
          <p>
            Many reading tools either present isolated grammar drills or force learners to rely on
            word-for-word bilingual translation. FluentLoop takes an English-to-English contextual
            approach:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-[#171615]">
            <li>
              <strong>Contextual Vocabulary in Real Time:</strong> Highlighted academic words and
              expressions display both a simple English definition and their specific meaning in the
              passage without disrupting your reading position.
            </li>
            <li>
              <strong>Authentic Academic Formats:</strong> Passages cover engineering, sustainable
              architecture, history, psychology, economics, and natural sciences paired with 12
              IELTS Academic question formats.
            </li>
            <li>
              <strong>Gradual Adaptive Progression:</strong> Learners choose a comfortable starting
              CEFR level without a high-stress placement test, and passages gradually adapt as
              comprehension accuracy improves.
            </li>
          </ul>
        </section>

        <section className="rounded-xl border border-[#E3D7C3] bg-[#FFFDFA] p-6 space-y-3">
          <h2 className="font-display text-xl font-bold text-[#171615]">
            Questions or Feedback?
          </h2>
          <p className="text-xs sm:text-sm text-[#76675B]">
            Visit our <Link href="/contact" className="font-semibold text-[#A63816] underline">Contact & Support</Link> page or review our{' '}
            <Link href="/privacy" className="font-semibold text-[#A63816] underline">Privacy Policy</Link>.
          </p>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
