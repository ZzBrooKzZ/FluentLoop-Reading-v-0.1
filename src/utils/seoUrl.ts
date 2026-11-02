export const OFFICIAL_SITE_URL = 'https://fluentloop.space';

const NON_PRODUCTION_HOST_PATTERNS = [
  /\.run\.app$/i,
  /\.hosted\.app$/i,
  /^localhost(?::\d+)?$/i,
  /^127\.0\.0\.1(?::\d+)?$/i,
  /^0\.0\.0\.0(?::\d+)?$/i,
];

function isPreviewOrLocalHost(hostname: string): boolean {
  const normalized = hostname.trim().toLowerCase();
  return NON_PRODUCTION_HOST_PATTERNS.some((pattern) => pattern.test(normalized));
}

/**
 * Resolves the canonical production site URL for SEO metadata, OpenGraph,
 * Twitter cards, JSON-LD structured data, sitemap.xml, and robots.txt.
 *
 * Ephemeral preview or local development origins (such as Cloud Run *.run.app,
 * Firebase *.hosted.app, or localhost injected via APP_URL) are ignored so
 * production SEO output consistently uses https://fluentloop.space.
 */
export function resolveCanonicalSiteUrl(
  env: Record<string, string | undefined> = process.env
): string {
  const candidates = [env.NEXT_PUBLIC_SITE_URL, env.APP_URL];

  for (const rawCandidate of candidates) {
    if (!rawCandidate || !rawCandidate.trim()) continue;
    const trimmed = rawCandidate.trim().replace(/\/+$/, '');
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    try {
      const parsed = new URL(withProtocol);
      if (!isPreviewOrLocalHost(parsed.host) && !isPreviewOrLocalHost(parsed.hostname)) {
        return `${parsed.protocol}//${parsed.host}`;
      }
    } catch {
      continue;
    }
  }

  return OFFICIAL_SITE_URL;
}

/**
 * Builds an absolute canonical URL on the official production domain.
 */
export function buildCanonicalUrl(
  pathname: string = '/',
  baseUrl: string = resolveCanonicalSiteUrl()
): string {
  const normalizedBase = baseUrl.replace(/\/+$/, '');
  if (!pathname || pathname === '/') {
    return `${normalizedBase}/`;
  }
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${normalizedBase}${normalizedPath}`;
}
