import React from 'react';
import type { Metadata } from 'next';
import { Mail, BookOpen, ShieldCheck } from 'lucide-react';
import { PublicGuideHeader } from '@/src/components/PublicGuideHeader';
import { PublicFooter } from '@/src/components/PublicFooter';
import { buildCanonicalUrl } from '@/src/utils/seoUrl';

export const metadata: Metadata = {
  title: 'Contact & Learner Support',
  description:
    'Contact the FluentLoop Reading team for questions about academic reading passages, IELTS question formats, account data, or technical support.',
  alternates: {
    canonical: buildCanonicalUrl('/contact'),
  },
  openGraph: {
    title: 'Contact & Learner Support | FluentLoop Reading',
    description:
      'Contact the FluentLoop Reading team for questions about academic reading passages, IELTS question formats, account data, or technical support.',
    url: buildCanonicalUrl('/contact'),
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact & Learner Support | FluentLoop Reading',
    description:
      'Contact the FluentLoop Reading team for questions about academic reading passages, IELTS question formats, account data, or technical support.',
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
            deletion, or an educational partnership? Review the request categories below and reach
            out to our support team.
          </p>
        </header>

        <section className="grid gap-6 sm:grid-cols-2" aria-label="Support request categories">
          <div className="rounded-xl border border-[#E3D7C3] bg-[#FFFDFA] p-6 space-y-3">
            <div className="inline-flex items-center gap-2 text-[#A63816]">
              <BookOpen className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="font-mono-code text-xs font-bold uppercase tracking-wider">
                Category 1
              </span>
            </div>
            <h2 className="font-display text-lg font-bold text-[#171615]">
              Learner & Technical Support
            </h2>
            <p className="text-xs sm:text-sm text-[#76675B] leading-relaxed">
              Use this category for questions about learning content or platform functionality:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-[#171615]">
              <li>Reading passage content, vocabulary annotations, or CEFR level progression</li>
              <li>IELTS question explanations and semantic grading feedback</li>
              <li>Google Sign-In, cross-device progress sync, or browser issues</li>
            </ul>
          </div>

          <div className="rounded-xl border border-[#E3D7C3] bg-[#FFFDFA] p-6 space-y-3">
            <div className="inline-flex items-center gap-2 text-[#A63816]">
              <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="font-mono-code text-xs font-bold uppercase tracking-wider">
                Category 2
              </span>
            </div>
            <h2 className="font-display text-lg font-bold text-[#171615]">
              Data & Privacy Requests
            </h2>
            <p className="text-xs sm:text-sm text-[#76675B] leading-relaxed">
              Use this category for account records and personal data requests (please write from
              your registered Google account address):
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-[#171615]">
              <li>Permanent deletion of your Firebase account and Firestore study records</li>
              <li>Export of your saved vocabulary list and reading attempt history</li>
              <li>Questions regarding our Privacy Policy or cookie disclosures</li>
            </ul>
          </div>
        </section>

        <section
          aria-labelledby="official-contact-heading"
          className="rounded-xl border border-[#E3D7C3] bg-[#F2EDE3]/70 p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div className="space-y-1.5">
            <div className="font-mono-code text-xs font-bold uppercase tracking-wider text-[#A63816]">
              Official Support & Privacy Inbox
            </div>
            <h2
              id="official-contact-heading"
              className="font-display text-xl font-bold text-[#171615]"
            >
              One Email for All Inquiries
            </h2>
            <p className="text-xs sm:text-sm text-[#76675B] leading-relaxed max-w-xl">
              This single official address handles both <strong>Learner & Technical Support</strong>{' '}
              and <strong>Data & Privacy Requests</strong>. Include your request category in the
              subject line for faster routing.
            </p>
          </div>

          <a
            href="mailto:hello@fluentloop.space"
            className="inline-flex items-center gap-2 self-start sm:self-center rounded-xl border border-[#E3D7C3] bg-[#FFFDFA] px-4 py-3 font-mono-code text-xs sm:text-sm font-bold text-[#A63816] shadow-xs hover:border-[#A63816] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A63816]/40 focus-visible:underline transition-colors shrink-0"
          >
            <Mail className="h-4 w-4 shrink-0 text-[#A63816]" aria-hidden="true" />
            <span>hello@fluentloop.space</span>
          </a>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}

