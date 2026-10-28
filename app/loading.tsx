import React from 'react';
import { AnimatedBookLoader } from '@/src/components/AnimatedBookLoader';

export default function RootLoading() {
  return (
    <main className="min-h-screen bg-[#FAF7F1] flex items-center justify-center px-4">
      <AnimatedBookLoader
        fullScreen
        message="Preparing your reading experience"
        subtext="Opening your reading journal and contextual vocabulary tools..."
      />
    </main>
  );
}
