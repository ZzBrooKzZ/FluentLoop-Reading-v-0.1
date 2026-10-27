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
    <div className="min-h-screen bg-[#FAF7F1] text-[#171615] flex flex-col">
      <PublicGuideHeader />
      <main className="mx-auto flex-1 max-w-3xl px-4 sm:px-8 py-16 text-center space-y-6">
        <span className="inline-block rounded-full border border-[#E3D7C3] bg-[#F2EDE3] px-3 py-1 font-mono-code text-xs font-bold uppercase tracking-widest text-[#A63816]">
          HTTP 404 · Page Not Found
        </span>
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#171615]">
          We couldn’t find that reading resource.
        </h1>
        <p className="text-sm sm:text-base text-[#76675B] leading-relaxed max-w-xl mx-auto">
          The URL you requested may have moved or does not exist. Explore our adaptive English
          reading library or browse our public IELTS and CEFR study guides below.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="rounded-xl bg-[#A63816] px-5 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-[#842B12]"
          >
            Return to FluentLoop Reading
          </Link>
          <Link
            href="/guides/ielts-academic-reading"
            className="rounded-xl border border-[#E3D7C3] bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#171615] hover:bg-[#F2EDE3]"
          >
            IELTS Reading Guide
          </Link>
          <Link
            href="/sample-lessons"
            className="rounded-xl border border-[#E3D7C3] bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#171615] hover:bg-[#F2EDE3]"
          >
            Browse Sample Passages
          </Link>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
