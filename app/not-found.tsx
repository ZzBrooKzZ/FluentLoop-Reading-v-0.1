import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { PublicGuideHeader } from '@/src/components/PublicGuideHeader';
import { PublicFooter } from '@/src/components/PublicFooter';

export const metadata: Metadata = {
  title: 'Page Not Found (404)',
  description: 'The requested page or reading resource could not be found on FluentLoop Reading.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#141413] flex flex-col">
      <PublicGuideHeader />
      <main className="mx-auto flex-1 max-w-3xl px-4 sm:px-8 py-16 text-center space-y-6">
        <span className="inline-block rounded-full border border-[#D8CFC2] bg-[#F3EFE6] px-3 py-1 font-mono-code text-xs font-bold uppercase tracking-widest text-[#9A3412]">
          HTTP 404 · Page Not Found
        </span>
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#141413]">
          We couldn’t find that reading resource.
        </h1>
        <p className="text-sm sm:text-base text-[#57534E] leading-relaxed max-w-xl mx-auto">
          The URL you requested may have moved or does not exist. Explore our adaptive English
          reading library or browse our public IELTS and CEFR study guides below.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="rounded-xl bg-[#9A3412] px-5 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-[#7C2D12]"
          >
            Return to FluentLoop Reading
          </Link>
          <Link
            href="/guides/ielts-academic-reading"
            className="rounded-xl border border-[#D8CFC2] bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#141413] hover:bg-[#F3EFE6]"
          >
            IELTS Reading Guide
          </Link>
          <Link
            href="/sample-lessons"
            className="rounded-xl border border-[#D8CFC2] bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#141413] hover:bg-[#F3EFE6]"
          >
            Browse Sample Passages
          </Link>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
