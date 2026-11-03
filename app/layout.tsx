import type { Metadata } from 'next';
import React from 'react';
import {
  Fraunces,
  JetBrains_Mono,
  Plus_Jakarta_Sans,
  Source_Serif_4,
} from 'next/font/google';
import '@/src/index.css';
import { buildCanonicalUrl, resolveCanonicalSiteUrl } from '@/src/utils/seoUrl';
import { FluentLoopAnalytics } from '@/src/components/FluentLoopAnalytics';
import { resolveGaMeasurementId } from '@/src/utils/analytics';

const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fraunces',
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
});

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-source-serif',
  weight: ['400', '600'],
  style: ['normal', 'italic'],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
  weight: ['400', '500', '600', '700'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
  weight: ['400', '500', '600'],
});

const CANONICAL_BASE_URL = resolveCanonicalSiteUrl();
const GA_MEASUREMENT_ID = resolveGaMeasurementId();

export const metadata: Metadata = {
  metadataBase: new URL(CANONICAL_BASE_URL),
  title: {
    default: 'FluentLoop Reading — Academic & IELTS Reading Platform',
    template: '%s | FluentLoop Reading',
  },
  description:
    'Interactive academic English reading comprehension, contextual English-to-English vocabulary explanations, adaptive CEFR progression, and IELTS Academic Reading preparation.',
  alternates: {
    canonical: buildCanonicalUrl('/'),
  },
  icons: {
    icon: [
      {
        url: buildCanonicalUrl('/favicon-144x144.png'),
        sizes: '144x144',
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: buildCanonicalUrl('/apple-touch-icon.png'),
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
  openGraph: {
    type: 'website',
    siteName: 'FluentLoop Reading',
    title: 'FluentLoop Reading — Academic & IELTS Reading Platform',
    description:
      'Interactive academic English reading comprehension, contextual English-to-English vocabulary explanations, adaptive CEFR progression, and IELTS Academic Reading preparation.',
    url: buildCanonicalUrl('/'),
    images: [
      {
        url: '/assets/aistudio/FluentLoop_Open_Book_Infinity_Logo_3809769a.png',
        width: 1200,
        height: 675,
        alt: 'FluentLoop Academic English Reading Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FluentLoop Reading — Academic & IELTS Reading Platform',
    description:
      'Interactive academic English reading comprehension, contextual English-to-English vocabulary explanations, adaptive CEFR progression, and IELTS Academic Reading preparation.',
    images: ['/assets/aistudio/FluentLoop_Open_Book_Infinity_Logo_3809769a.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'FluentLoop Reading',
    url: CANONICAL_BASE_URL,
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'All',
    description:
      'Interactive academic English reading comprehension, contextual English-to-English vocabulary explanations, adaptive CEFR A1–C2 progression, and IELTS Academic Reading preparation.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${sourceSerif.variable} ${plusJakarta.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
        />
      </head>
      <body>
        {children}
        <FluentLoopAnalytics gaId={GA_MEASUREMENT_ID} />
      </body>
    </html>
  );
}
