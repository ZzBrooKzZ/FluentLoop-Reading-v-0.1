import React from 'react';
import Link from 'next/link';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-[#E5DEC9] bg-[#F3EFE6] text-[#57534E]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#9A3412] text-white font-display font-bold text-sm">
                F
              </div>
              <span className="font-display text-base font-bold text-[#141413]">
                FluentLoop Reading
              </span>
            </div>
            <p className="text-xs leading-relaxed text-[#57534E]">
              Academic English reading practice, contextual English-to-English vocabulary acquisition,
              and adaptive CEFR A1–C1 progression for university and IELTS Academic learners.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-mono-code text-xs font-bold uppercase tracking-wider text-[#141413]">
              Academic Reading Guides
            </h2>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="/guides/ielts-academic-reading" className="hover:text-[#9A3412] hover:underline">
                  IELTS Academic Reading Guide
                </Link>
              </li>
              <li>
                <Link href="/guides/cefr-reading-levels" className="hover:text-[#9A3412] hover:underline">
                  CEFR A1–C1 Reading Levels Explained
                </Link>
              </li>
              <li>
                <Link href="/guides/vocabulary-in-context" className="hover:text-[#9A3412] hover:underline">
                  Contextual English Vocabulary Strategy
                </Link>
              </li>
              <li>
                <Link href="/sample-lessons" className="hover:text-[#9A3412] hover:underline">
                  Public Sample Reading Passages
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="font-mono-code text-xs font-bold uppercase tracking-wider text-[#141413]">
              Sample CEFR Passages
            </h2>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="/sample-lessons/a1-sci-solar-lamps" className="hover:text-[#9A3412] hover:underline">
                  A1 Sample — Solar Lamps in Remote Villages
                </Link>
              </li>
              <li>
                <Link href="/sample-lessons/a2-sci-desalination-plants" className="hover:text-[#9A3412] hover:underline">
                  A2 Sample — Ocean Water Desalination
                </Link>
              </li>
              <li>
                <Link href="/sample-lessons/b1-sci-sodium-batteries" className="hover:text-[#9A3412] hover:underline">
                  B1 Sample — Sodium-Ion Salt Batteries
                </Link>
              </li>
              <li>
                <Link href="/sample-lessons/b2-sci-bioluminescence-tech" className="hover:text-[#9A3412] hover:underline">
                  B2 Sample — Bioluminescent Medical Imaging
                </Link>
              </li>
              <li>
                <Link href="/sample-lessons/c1-01-neuromorphic-computing" className="hover:text-[#9A3412] hover:underline">
                  C1 Sample — Neuromorphic Computing
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="font-mono-code text-xs font-bold uppercase tracking-wider text-[#141413]">
              About & Legal Policies
            </h2>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="/about" className="hover:text-[#9A3412] hover:underline">
                  About FluentLoop
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#9A3412] hover:underline">
                  Contact & Learner Support
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#9A3412] hover:underline">
                  Privacy Policy & Cookie Disclosure
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#9A3412] hover:underline">
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-[#D8CFC2] pt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-[#78716C]">
          <p>© {new Date().getFullYear()} FluentLoop Reading. Educational English Reading & Assessment Platform.</p>
          <p>IELTS is a registered trademark of University of Cambridge ESOL, the British Council, and IDP Education Australia.</p>
        </div>
      </div>
    </footer>
  );
};
