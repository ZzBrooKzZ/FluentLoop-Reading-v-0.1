import React from 'react';
import Link from 'next/link';
import { BrandLogo } from './BrandLogo';
import { OliveTerracottaLeafCluster } from './BotanicalIllustrations';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="relative mt-16 overflow-hidden border-t border-[#E3D7C3] bg-[#F2EDE3] text-[#76675B]">
      {/* Subtle decorative corner botanical cluster */}
      <OliveTerracottaLeafCluster className="pointer-events-none absolute -right-3 -top-2 h-20 w-20 opacity-45" />

      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <Link href="/" className="inline-flex items-center">
              <BrandLogo variant="compact" subtitle="READ · LEARN · IMPROVE" />
            </Link>
            <p className="text-xs leading-relaxed text-[#76675B]">
              A calm, editorial English reading journal and IELTS Academic learning platform. Build
              comprehension through level-matched passages, contextual English-to-English vocabulary
              explanations, and adaptive CEFR A1–C1 progression.
            </p>
          </div>

          <div className="space-y-2.5">
            <h2 className="font-mono-code text-xs font-bold uppercase tracking-wider text-[#171615]">
              Academic Reading Guides
            </h2>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link
                  href="/guides/ielts-academic-reading"
                  className="hover:text-[#A63816] hover:underline transition-colors"
                >
                  IELTS Academic Reading Guide
                </Link>
              </li>
              <li>
                <Link
                  href="/guides/cefr-reading-levels"
                  className="hover:text-[#A63816] hover:underline transition-colors"
                >
                  CEFR A1–C1 Reading Levels Explained
                </Link>
              </li>
              <li>
                <Link
                  href="/guides/vocabulary-in-context"
                  className="hover:text-[#A63816] hover:underline transition-colors"
                >
                  Contextual English Vocabulary Strategy
                </Link>
              </li>
              <li>
                <Link
                  href="/sample-lessons"
                  className="hover:text-[#A63816] hover:underline transition-colors"
                >
                  Public Sample Reading Passages
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <h2 className="font-mono-code text-xs font-bold uppercase tracking-wider text-[#171615]">
              Sample CEFR Passages
            </h2>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link
                  href="/sample-lessons/a1-sci-solar-lamps"
                  className="hover:text-[#A63816] hover:underline transition-colors"
                >
                  A1 Sample — Solar Lamps in Remote Villages
                </Link>
              </li>
              <li>
                <Link
                  href="/sample-lessons/a2-sci-desalination-plants"
                  className="hover:text-[#A63816] hover:underline transition-colors"
                >
                  A2 Sample — Ocean Water Desalination
                </Link>
              </li>
              <li>
                <Link
                  href="/sample-lessons/b1-sci-sodium-batteries"
                  className="hover:text-[#A63816] hover:underline transition-colors"
                >
                  B1 Sample — Sodium-Ion Salt Batteries
                </Link>
              </li>
              <li>
                <Link
                  href="/sample-lessons/b2-sci-bioluminescence-tech"
                  className="hover:text-[#A63816] hover:underline transition-colors"
                >
                  B2 Sample — Bioluminescent Medical Imaging
                </Link>
              </li>
              <li>
                <Link
                  href="/sample-lessons/c1-01-neuromorphic-computing"
                  className="hover:text-[#A63816] hover:underline transition-colors"
                >
                  C1 Sample — Neuromorphic Computing
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <h2 className="font-mono-code text-xs font-bold uppercase tracking-wider text-[#171615]">
              About & Legal Policies
            </h2>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link
                  href="/about"
                  className="hover:text-[#A63816] hover:underline transition-colors"
                >
                  About FluentLoop
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-[#A63816] hover:underline transition-colors"
                >
                  Contact & Learner Support
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-[#A63816] hover:underline transition-colors"
                >
                  Privacy Policy & Cookie Disclosure
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-[#A63816] hover:underline transition-colors"
                >
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-[#E3D7C3] pt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-[#76675B]">
          <p>© {new Date().getFullYear()} FluentLoop Reading. Educational English Reading & Assessment Platform.</p>
          <p>IELTS is a registered trademark of University of Cambridge ESOL, the British Council, and IDP Education Australia.</p>
        </div>
      </div>
    </footer>
  );
};
