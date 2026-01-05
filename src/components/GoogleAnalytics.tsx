'use client';

import { Suspense, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { GA_TRACKING_ID, pageview } from '../lib/gtag';

function GoogleAnalyticsInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_TRACKING_ID) return;

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    pageview(url);
  }, [pathname, searchParams]);

  return null;
}

export function GoogleAnalytics() {
  if (!GA_TRACKING_ID) {
    return null;
  }

  return (
    <>
      <Suspense fallback={null}>
        <GoogleAnalyticsInner />
      </Suspense>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
      >
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_TRACKING_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}
