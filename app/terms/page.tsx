import React from 'react';
import type { Metadata } from 'next';
import { PublicGuideHeader } from '@/src/components/PublicGuideHeader';
import { PublicFooter } from '@/src/components/PublicFooter';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description:
    'Terms of Use for the FluentLoop Reading academic English reading and IELTS practice platform.',
  alternates: {
    canonical: '/terms',
  },
};

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#141413] flex flex-col">
      <PublicGuideHeader />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 sm:px-8 py-10 space-y-8 text-sm sm:text-base text-[#57534E] leading-relaxed">
        <header className="space-y-3 border-b border-[#E5DEC9] pb-6">
          <div className="font-mono-code text-xs font-bold uppercase tracking-widest text-[#9A3412]">
            Platform Terms
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#141413]">
            Terms of Use
          </h1>
          <p className="text-xs text-[#78716C]">Effective Date: October 25, 2026</p>
        </header>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-[#141413]">
            1. Educational Purpose & Disclaimer
          </h2>
          <p>
            FluentLoop Reading provides original academic English reading passages, contextual
            vocabulary explanations, and IELTS-style comprehension assessments for independent study
            and classroom preparation. FluentLoop Reading is an independent educational platform and
            is not affiliated with or endorsed by Cambridge Assessment English, the British Council,
            or IDP Education.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-[#141413]">
            2. Acceptable Use
          </h2>
          <p>
            Users agree not to scrape private assessment answer keys, abuse automated semantic
            grading endpoints, or submit malicious payloads. Rate limits are enforced on all grading
            endpoints to ensure fair access for learners.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-[#141413]">
            3. Intellectual Property
          </h2>
          <p>
            All reading passages, SVG illustrations, vocabulary annotations, and comprehension
            question sets on FluentLoop Reading are provided for personal educational use and may
            not be republished commercially without written permission.
          </p>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
