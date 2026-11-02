import type { MetadataRoute } from 'next';
import { resolveCanonicalSiteUrl } from '@/src/utils/seoUrl';

const SITE_URL = resolveCanonicalSiteUrl();

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
