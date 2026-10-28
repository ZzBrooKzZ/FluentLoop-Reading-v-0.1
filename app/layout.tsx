import type { Metadata } from 'next';
import React from 'react';
import '@/src/index.css';

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.APP_URL ||
  'https://ais-pre-m5smnqvfyxyrlvrkl76egf-965456113659.europe-west2.run.app'
).replace(/\/+$/, '');

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL.startsWith('http') ? SITE_URL : `https://${SITE_URL}`),
  title: {
    default: 'FluentLoop Reading — Academic & IELTS Reading Platform',
    template: '%s | FluentLoop Reading',
  },
  description:
    'Interactive academic English reading comprehension, contextual English-to-English vocabulary explanations, adaptive CEFR progression, and IELTS Academic Reading preparation.',
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/assets/aistudio/FluentLoop_Open_Book_Infinity_Logo_3809769a.png',
    shortcut: '/assets/aistudio/FluentLoop_Open_Book_Infinity_Logo_3809769a.png',
    apple: '/assets/aistudio/FluentLoop_Open_Book_Infinity_Logo_3809769a.png',
  },
  openGraph: {
    type: 'website',
    siteName: 'FluentLoop Reading',
    title: 'FluentLoop Reading — Academic & IELTS Reading Platform',
    description:
      'Interactive academic English reading comprehension, contextual English-to-English vocabulary explanations, adaptive CEFR progression, and IELTS Academic Reading preparation.',
    url: '/',
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
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'All',
    description:
      'Interactive academic English reading comprehension, contextual English-to-English vocabulary explanations, adaptive CEFR A1–C1 progression, and IELTS Academic Reading preparation.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..600&family=JetBrains+Mono:wght@400;500;600&family=Newsreader:ital,opsz,wght@0,6..72,400..700;1,6..72,400..600&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Source+Serif+4:ital,opsz,wght@0,8..60,400..600;1,8..60,400..600&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
