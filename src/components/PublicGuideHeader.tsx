import React from 'react';
import Link from 'next/link';
import { BookOpen, Compass, FileText, ArrowRight } from 'lucide-react';

export const PublicGuideHeader: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 h-16 border-b border-[#E5DEC9] bg-[#FAF7F2]/95 backdrop-blur-xs">
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-4 sm:px-8 gap-4">
        <Link href="/" className="flex items-center gap-2.5 text-left whitespace-nowrap">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#9A3412] text-white font-display font-bold text-lg">
            F
          </div>
          <div>
            <span className="font-display text-lg font-bold tracking-tight text-[#141413]">
              FluentLoop
            </span>
            <span className="hidden sm:inline-block ml-1.5 text-xs font-medium text-[#57534E]">
              Academic Reading
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto" aria-label="Public educational navigation">
          <Link
            href="/guides/ielts-academic-reading"
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-semibold text-[#57534E] hover:bg-[#F3EFE6] hover:text-[#141413] whitespace-nowrap"
          >
            <BookOpen className="h-4 w-4" />
            <span>IELTS Guide</span>
          </Link>
          <Link
            href="/guides/cefr-reading-levels"
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-semibold text-[#57534E] hover:bg-[#F3EFE6] hover:text-[#141413] whitespace-nowrap"
          >
            <Compass className="h-4 w-4" />
            <span>CEFR Levels</span>
          </Link>
          <Link
            href="/guides/vocabulary-in-context"
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-semibold text-[#57534E] hover:bg-[#F3EFE6] hover:text-[#141413] whitespace-nowrap"
          >
            <FileText className="h-4 w-4" />
            <span>Vocabulary Strategy</span>
          </Link>
          <Link
            href="/sample-lessons"
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-semibold text-[#57534E] hover:bg-[#F3EFE6] hover:text-[#141413] whitespace-nowrap"
          >
            <span>Sample Passages</span>
          </Link>
        </nav>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#9A3412] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#7C2D12] whitespace-nowrap"
        >
          <span>Open Reading App</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </header>
  );
};
