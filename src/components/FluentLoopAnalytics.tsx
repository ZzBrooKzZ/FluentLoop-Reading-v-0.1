'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { GoogleAnalytics } from '@next/third-parties/google';
import {
  ANALYTICS_CONSENT_STORAGE_KEY,
  type AnalyticsConsentState,
  getAnalyticsConsentState,
  resolveGaMeasurementId,
  setAnalyticsConsentState,
} from '@/src/utils/analytics';

interface FluentLoopAnalyticsProps {
  gaId?: string | null;
}

/**
 * Opt-in Google Analytics 4 integration & compact editorial consent bar.
 *
 * - Single source of truth: Only activates when a valid `NEXT_PUBLIC_GA_MEASUREMENT_ID`
 *   is configured.
 * - Default-denied opt-in: When a new visitor has no saved preference (`'unset'`),
 *   `analytics_storage` defaults to `'denied'` and `<GoogleAnalytics>` is NOT loaded
 *   until the visitor explicitly clicks "Accept Analytics".
 * - Choice & revocability: Visitors can equally accept or reject analytics from the
 *   non-intrusive bottom bar, and can reopen the banner at any time via the
 *   "Cookie & Analytics Preferences" control in the footer or Privacy Policy page.
 */
export const FluentLoopAnalytics: React.FC<FluentLoopAnalyticsProps> = ({
  gaId = resolveGaMeasurementId(),
}) => {
  const [hydrated, setHydrated] = useState(false);
  const [consentState, setConsentState] = useState<AnalyticsConsentState>('unset');
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  useEffect(() => {
    const syncConsent = () => {
      const current = getAnalyticsConsentState();
      if (gaId) {
        (window as unknown as Record<string, unknown>)[`ga-disable-${gaId}`] =
          current !== 'granted';
      }
      setConsentState(current);
      setHydrated(true);
    };

    syncConsent();

    const handleStorage = (event: StorageEvent) => {
      if (!event.key || event.key === ANALYTICS_CONSENT_STORAGE_KEY) {
        syncConsent();
      }
    };

    const handleOpenPreferences = () => {
      setPreferencesOpen(true);
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('fluentloop:analytics-consent-change', syncConsent);
    window.addEventListener('fluentloop:open-analytics-preferences', handleOpenPreferences);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('fluentloop:analytics-consent-change', syncConsent);
      window.removeEventListener('fluentloop:open-analytics-preferences', handleOpenPreferences);
    };
  }, [gaId]);

  const handleDecision = (decision: 'granted' | 'denied') => {
    setAnalyticsConsentState(decision, gaId);
    setConsentState(decision);
    setPreferencesOpen(false);
  };

  const showBanner = hydrated && (preferencesOpen || (Boolean(gaId) && consentState === 'unset'));
  const shouldLoadGa = hydrated && Boolean(gaId) && consentState === 'granted';

  const consentInitScript = gaId
    ? `
    (function() {
      var gaId = ${JSON.stringify(gaId)};
      window['ga-disable-' + gaId] = false;
      window.dataLayer = window.dataLayer || [];
      function gtag(){window.dataLayer.push(arguments);}
      window.gtag = window.gtag || gtag;
      gtag('consent', 'default', {
        analytics_storage: 'granted',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied'
      });
      gtag('set', {
        allow_google_signals: false,
        allow_ad_personalization_signals: false
      });
    })();
  `
    : '';

  return (
    <>
      {shouldLoadGa && gaId && (
        <>
          <Script
            id="_next-ga-consent-defaults"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: consentInitScript }}
          />
          <GoogleAnalytics gaId={gaId} />
        </>
      )}

      {showBanner && (
        <aside
          role="region"
          aria-label="Cookie and analytics consent preferences"
          className="fixed inset-x-0 bottom-0 z-50 border-t border-[#E3D7C3] bg-[#FFFDFA]/98 px-4 py-3.5 shadow-lg backdrop-blur-xs"
        >
          <div className="mx-auto flex max-w-[1440px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-0.5 text-xs leading-relaxed text-[#5C4E43]">
              <p className="font-semibold text-[#171615]">
                Analytics & Cookie Preferences
                {consentState !== 'unset' && (
                  <span className="ml-2 font-mono-code text-[11px] font-normal text-[#76675B]">
                    (Current: {consentState === 'granted' ? 'Accepted' : 'Rejected'})
                  </span>
                )}
              </p>
              <p>
                With your permission, FluentLoop uses Google Analytics 4 to measure aggregate page
                views. We never send personal identity, emails, or reading answers, and advertising
                storage is disabled. Read our{' '}
                <Link
                  href="/privacy"
                  className="font-semibold text-[#A63816] underline hover:text-[#842B12]"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-2">
              {preferencesOpen && consentState !== 'unset' && (
                <button
                  type="button"
                  onClick={() => setPreferencesOpen(false)}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-[#76675B] hover:bg-[#F2EDE3] hover:text-[#171615] transition-colors"
                >
                  Close
                </button>
              )}
              <button
                type="button"
                onClick={() => handleDecision('denied')}
                className="rounded-lg border border-[#E3D7C3] bg-[#FAF7F1] px-3.5 py-1.5 text-xs font-semibold text-[#171615] hover:bg-[#F2EDE3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A63816]/40 transition-colors"
              >
                Reject Analytics
              </button>
              <button
                type="button"
                onClick={() => handleDecision('granted')}
                className="rounded-lg bg-[#A63816] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#842B12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A63816]/40 transition-colors"
              >
                Accept Analytics
              </button>
            </div>
          </div>
        </aside>
      )}
    </>
  );
};
