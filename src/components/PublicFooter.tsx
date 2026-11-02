'use client';

import React from 'react';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { openAnalyticsPreferences } from '@/src/utils/analytics';

const FOOTER_LINK_CLASS =
  'inline-block text-[#5C4E43] hover:text-[#A63816] hover:underline focus-visible:text-[#A63816] focus-visible:underline focus-visible:outline-none transition-colors';

const SAMPLE_PASSAGE_LINKS = [
  {
    level: 'A1',
    title: 'Solar Lamps in Remote Villages',
    href: '/sample-lessons/a1-sci-solar-lamps',
  },
  {
    level: 'A2',
    title: 'Ocean Water Desalination',
    href: '/sample-lessons/a2-sci-desalination-plants',
  },
  {
    level: 'B1',
    title: 'Sodium-Ion Salt Batteries',
    href: '/sample-lessons/b1-sci-sodium-batteries',
  },
  {
    level: 'B2',
    title: 'Bioluminescent Medical Imaging',
    href: '/sample-lessons/b2-sci-bioluminescence-tech',
  },
  {
    level: 'C1',
    title: 'Neuromorphic Computing',
    href: '/sample-lessons/c1-01-neuromorphic-computing',
  },
  {
    level: 'C2',
    title: 'Quantum Decoherence',
    href: '/sample-lessons/c2-01-quantum-decoherence-topological',
  },
] as const;

export const PublicFooter: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-[#E3D7C3] bg-[#F2EDE3] text-[#76675B]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 py-10 sm:py-12">
        {/* Four-Column Navigation Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Column 1 — Brand */}
          <div className="space-y-3 lg:col-span-3">
            <Link
              href="/"
              className="inline-flex items-center focus-visible:outline-none focus-visible:underline"
            >
              <BrandLogo variant="compact" subtitle="READ · LEARN · IMPROVE" />
            </Link>
            <p className="max-w-xs text-xs leading-relaxed text-[#76675B]">
              An editorial English reading journal and IELTS Academic practice platform featuring
              level-matched passages, contextual English-to-English vocabulary, and adaptive CEFR
              A1–C2 progression.
            </p>
          </div>

          {/* Column 2 — Learning Resources */}
          <div className="space-y-3 lg:col-span-3">
            <h2 className="font-mono-code text-xs font-bold uppercase tracking-wider text-[#171615]">
              Learning Resources
            </h2>
            <ul className="space-y-2 text-xs leading-snug">
              <li>
                <Link href="/guides/ielts-academic-reading" className={FOOTER_LINK_CLASS}>
                  IELTS Academic Reading Guide
                </Link>
              </li>
              <li>
                <Link href="/guides/cefr-reading-levels" className={FOOTER_LINK_CLASS}>
                  CEFR Reading Levels Explained
                </Link>
              </li>
              <li>
                <Link href="/guides/vocabulary-in-context" className={FOOTER_LINK_CLASS}>
                  Contextual English Vocabulary Strategy
                </Link>
              </li>
              <li>
                <Link href="/sample-lessons" className={FOOTER_LINK_CLASS}>
                  Public Sample Reading Passages
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 — Sample Passages */}
          <div className="space-y-3 lg:col-span-3">
            <h2 className="font-mono-code text-xs font-bold uppercase tracking-wider text-[#171615]">
              Sample Passages
            </h2>
            <ul className="space-y-2 text-xs leading-snug">
              {SAMPLE_PASSAGE_LINKS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={`${FOOTER_LINK_CLASS} group`}>
                    <span className="font-mono-code font-bold text-[#A63816]">{item.level}</span>
                    <span className="mx-1.5 text-[#B8A99A]" aria-hidden="true">
                      ·
                    </span>
                    <span className="group-hover:underline">{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — About & Legal */}
          <div className="space-y-3 lg:col-span-3">
            <h2 className="font-mono-code text-xs font-bold uppercase tracking-wider text-[#171615]">
              About & Legal
            </h2>
            <ul className="space-y-2 text-xs leading-snug">
              <li>
                <Link href="/about" className={FOOTER_LINK_CLASS}>
                  About FluentLoop
                </Link>
              </li>
              <li>
                <Link href="/contact" className={FOOTER_LINK_CLASS}>
                  Contact & Learner Support
                </Link>
              </li>
              <li>
                <Link href="/privacy" className={FOOTER_LINK_CLASS}>
                  Privacy Policy & Cookie Disclosure
                </Link>
              </li>
              <li>
                <Link href="/terms" className={FOOTER_LINK_CLASS}>
                  Terms of Use
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={openAnalyticsPreferences}
                  className={`${FOOTER_LINK_CLASS} text-left`}
                >
                  Cookie & Analytics Preferences
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Dedicated Contact Row — Single Deliberate Email Placement */}
        <div className="mt-8 border-t border-[#E3D7C3] pt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
          <div className="inline-flex flex-wrap items-center gap-2 text-[#171615]">
            <Mail className="h-3.5 w-3.5 shrink-0 text-[#A63816]" aria-hidden="true" />
            <span className="font-mono-code font-bold uppercase tracking-wider text-[#171615]">
              Contact us:
            </span>
            <a
              href="mailto:hello@fluentloop.space"
              className="font-mono-code font-semibold text-[#A63816] hover:underline focus-visible:outline-none focus-visible:underline transition-colors"
            >
              hello@fluentloop.space
            </a>
          </div>
          <p className="text-[#76675B]">
            Learner support, passage feedback, and account data inquiries.
          </p>
        </div>

        {/* Copyright & Trademark Attribution */}
        <div className="mt-5 border-t border-[#E3D7C3]/80 pt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-[#76675B]">
          <p>
            © {new Date().getFullYear()} FluentLoop Reading. Educational English Reading &
            Assessment Platform.
          </p>
          <p>
            IELTS is a registered trademark of University of Cambridge ESOL, the British Council,
            and IDP Education Australia.
          </p>
        </div>
      </div>
    </footer>
  );
};

