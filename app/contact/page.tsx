import React from 'react';
import type { Metadata } from 'next';
import { PublicGuideHeader } from '@/src/components/PublicGuideHeader';
import { PublicFooter } from '@/src/components/PublicFooter';

export const metadata: Metadata = {
  title: 'Contact & Learner Support',
  description:
    'Contact the FluentLoop Reading team for questions about academic reading passages, IELTS question formats, account data, or technical support.',
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F1] text-[#171615] flex flex-col">
      <PublicGuideHeader />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 sm:px-8 py-10 space-y-8">
        <header className="space-y-3 border-b border-[#E3D7C3] pb-6">
          <div className="font-mono-code text-xs font-bold uppercase tracking-widest text-[#A63816]">
            Support & Inquiries
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#171615]">
            Contact FluentLoop Reading
          </h1>
          <p className="text-sm sm:text-base text-[#76675B] leading-relaxed">
            Have a question about a reading passage, an answer key explanation, account data
            deletion, or an educational partnership? Reach out using the channels below.
          </p>
        </header>

        <section className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-[#E3D7C3] bg-[#FFFDFA] p-6 space-y-2">
            <h2 className="font-display text-lg font-bold text-[#171615]">
              Learner & Technical Support
            </h2>
            <p className="text-xs sm:text-sm text-[#76675B] leading-relaxed">
              For questions regarding reading passages, comprehension grading, or account
              synchronization:
            </p>
            <p className="font-mono-code text-xs font-semibold text-[#A63816]">
              megritarek19@gmail.com
            </p>
          </div>

          <div className="rounded-xl border border-[#E3D7C3] bg-[#FFFDFA] p-6 space-y-2">
            <h2 className="font-display text-lg font-bold text-[#171615]">
              Data & Privacy Requests
            </h2>
            <p className="text-xs sm:text-sm text-[#76675B] leading-relaxed">
              To request account deletion or export of your saved vocabulary and reading history,
              email us from your registered Google account address.
            </p>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
