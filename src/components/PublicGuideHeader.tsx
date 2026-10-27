'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Compass, FileText, ArrowRight, Menu, X } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export const PublicGuideHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[#E3D7C3] bg-[#FAF7F1]/95 backdrop-blur-xs">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-8 gap-4">
        <Link href="/" className="flex items-center whitespace-nowrap">
          <BrandLogo variant="full" subtitle="READ · LEARN · IMPROVE" />
        </Link>

        <nav
          className="hidden md:flex items-center gap-1 sm:gap-2 overflow-x-auto"
          aria-label="Public educational navigation"
        >
          <Link
            href="/guides/ielts-academic-reading"
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-semibold text-[#76675B] hover:bg-[#F2EDE3] hover:text-[#171615] whitespace-nowrap transition-colors"
          >
            <BookOpen className="h-4 w-4 text-[#A63816]" />
            <span>IELTS Guide</span>
          </Link>
          <Link
            href="/guides/cefr-reading-levels"
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-semibold text-[#76675B] hover:bg-[#F2EDE3] hover:text-[#171615] whitespace-nowrap transition-colors"
          >
            <Compass className="h-4 w-4 text-[#A63816]" />
            <span>CEFR Levels</span>
          </Link>
          <Link
            href="/guides/vocabulary-in-context"
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-semibold text-[#76675B] hover:bg-[#F2EDE3] hover:text-[#171615] whitespace-nowrap transition-colors"
          >
            <FileText className="h-4 w-4 text-[#A63816]" />
            <span>Vocabulary Strategy</span>
          </Link>
          <Link
            href="/sample-lessons"
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-semibold text-[#76675B] hover:bg-[#F2EDE3] hover:text-[#171615] whitespace-nowrap transition-colors"
          >
            <span>Sample Passages</span>
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#A63816] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#842B12] whitespace-nowrap transition-colors shadow-xs"
          >
            <span>Open Reading App</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle public navigation menu"
            className="inline-flex md:hidden h-9 w-9 items-center justify-center rounded-lg border border-[#E3D7C3] bg-[#FFFDFA] text-[#76675B] hover:bg-[#F2EDE3] hover:text-[#171615]"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav
          aria-label="Mobile public navigation"
          className="md:hidden border-t border-[#E3D7C3] bg-[#FAF7F1] px-4 py-3 space-y-1"
        >
          <Link
            href="/guides/ielts-academic-reading"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-[#171615] hover:bg-[#F2EDE3]"
          >
            <BookOpen className="h-4 w-4 text-[#A63816]" />
            <span>IELTS Academic Reading Guide</span>
          </Link>
          <Link
            href="/guides/cefr-reading-levels"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-[#171615] hover:bg-[#F2EDE3]"
          >
            <Compass className="h-4 w-4 text-[#A63816]" />
            <span>CEFR A1–C1 Reading Levels</span>
          </Link>
          <Link
            href="/guides/vocabulary-in-context"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-[#171615] hover:bg-[#F2EDE3]"
          >
            <FileText className="h-4 w-4 text-[#A63816]" />
            <span>Contextual Vocabulary Strategy</span>
          </Link>
          <Link
            href="/sample-lessons"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-[#171615] hover:bg-[#F2EDE3]"
          >
            <span>Public Sample Passages</span>
          </Link>
        </nav>
      )}
    </header>
  );
};
