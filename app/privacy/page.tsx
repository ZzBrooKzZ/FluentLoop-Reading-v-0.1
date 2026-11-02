import React from 'react';
import type { Metadata } from 'next';
import { PublicGuideHeader } from '@/src/components/PublicGuideHeader';
import { PublicFooter } from '@/src/components/PublicFooter';
import { buildCanonicalUrl } from '@/src/utils/seoUrl';

export const metadata: Metadata = {
  title: 'Privacy Policy & Cookie Disclosure',
  description:
    'Privacy Policy for FluentLoop Reading covering Firebase Authentication, Cloud Firestore storage, Gemini semantic grading, cookies, and Google AdSense disclosures.',
  alternates: {
    canonical: buildCanonicalUrl('/privacy'),
  },
  openGraph: {
    title: 'Privacy Policy & Cookie Disclosure | FluentLoop Reading',
    description:
      'Privacy Policy for FluentLoop Reading covering Firebase Authentication, Cloud Firestore storage, Gemini semantic grading, cookies, and Google AdSense disclosures.',
    url: buildCanonicalUrl('/privacy'),
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy & Cookie Disclosure | FluentLoop Reading',
    description:
      'Privacy Policy for FluentLoop Reading covering Firebase Authentication, Cloud Firestore storage, Gemini semantic grading, cookies, and Google AdSense disclosures.',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F1] text-[#171615] flex flex-col">
      <PublicGuideHeader />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 sm:px-8 py-10 space-y-8 text-sm sm:text-base text-[#76675B] leading-relaxed">
        <header className="space-y-3 border-b border-[#E3D7C3] pb-6">
          <div className="font-mono-code text-xs font-bold uppercase tracking-widest text-[#A63816]">
            Legal & Data Protection
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#171615]">
            Privacy Policy & Cookie Disclosure
          </h1>
          <p className="text-xs text-[#76675B]">Effective Date: October 25, 2026</p>
        </header>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-[#171615]">
            1. Information We Collect
          </h2>
          <p>
            FluentLoop Reading supports both guest study and optional Google account synchronization:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-[#171615]">
            <li>
              <strong>Guest Mode (Browser Local Storage):</strong> Your selected CEFR level, reading
              attempts, saved vocabulary, and font-size preferences are stored locally in your
              browser using <code>localStorage</code>.
            </li>
            <li>
              <strong>Authenticated Accounts (Firebase Authentication & Cloud Firestore):</strong>{' '}
              When you sign in with Google, we store your Firebase user identifier (UID), display
              name, preferred CEFR level, reading attempt scores, and saved vocabulary items in
              Google Cloud Firestore so you can sync progress across devices.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-[#171615]">
            2. Automated Semantic Answer Evaluation (Google Gemini API)
          </h2>
          <p>
            Objective questions and exact answer-key matches are graded deterministically. When you
            submit an open-ended short-answer paraphrase that does not match our static answer key,
            our server sends only the question prompt, the relevant passage excerpt, and your text
            response to the Google Gemini API to evaluate semantic accuracy. No personal identity or
            email address is included in grading requests.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-[#171615]">
            3. Analytics, Cookies & Third-Party Advertising Disclosures
          </h2>
          <p>
            FluentLoop Reading uses privacy-first analytics and cookies only in accordance with your
            explicit consent preferences:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-[#171615]">
            <li>
              <strong>Google Analytics 4 (Opt-In Only):</strong> Non-essential analytics cookies (
              <code>_ga</code>) and Google Analytics 4 page-view measurement are blocked by default
              until you explicitly click <strong>Accept Analytics</strong> in the consent banner. We
              disable Google Signals and advertising storage (<code>ad_storage: &apos;denied&apos;</code>
              ), and we never transmit your email address, name, Firebase UID, or reading answers to
              Google Analytics. You can review or withdraw your analytics consent at any time using
              the <strong>Cookie &amp; Analytics Preferences</strong> button in the site footer.
            </li>
            <li>
              Third-party vendors, including Google, use cookies (such as the DoubleClick DART
              cookie) to serve ads based on a user’s prior visits to this website or other websites
              on the internet.
            </li>
            <li>
              Google’s use of advertising cookies enables it and its partners to serve ads to users
              based on their visit to FluentLoop Reading and/or other sites on the Internet.
            </li>
            <li>
              Users may opt out of personalized advertising by visiting{' '}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#A63816] underline"
              >
                Google Ads Settings
              </a>{' '}
              or{' '}
              <a
                href="https://www.aboutads.info"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#A63816] underline"
              >
                www.aboutads.info
              </a>
              .
            </li>
            <li>
              For visitors in the European Economic Area (EEA), the United Kingdom, and Switzerland,
              non-essential analytics cookies are blocked until explicit opt-in consent is granted,
              and personalized advertising is only activated through a Google-certified Consent
              Management Platform (CMP) compliant with the IAB TCF v2.2 framework.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-[#171615]">
            4. Data Retention & Deletion
          </h2>
          <p>
            You can clear local browser data at any time by clearing your site storage, or request
            deletion of your synchronized Firebase account and Firestore records by contacting{' '}
            <a
              href="mailto:hello@fluentloop.space"
              className="font-mono-code text-xs font-semibold text-[#A63816] hover:underline focus:outline-none focus:underline"
            >
              hello@fluentloop.space
            </a>
            .
          </p>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
