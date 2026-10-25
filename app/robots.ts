import type { MetadataRoute } from 'next';

const SITE_URL = (
  process.env.APP_URL ||
  'https://ais-pre-m5smnqvfyxyrlvrkl76egf-965456113659.europe-west2.run.app'
).replace(/\/+$/, '');

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/guides/',
          '/sample-lessons/',
          '/about',
          '/contact',
          '/privacy',
          '/terms',
        ],
        disallow: ['/api/', '/admin', '/placement'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
