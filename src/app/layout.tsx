import React from 'react';
import { Metadata, Viewport } from 'next';
import { Providers } from '../components/Providers';
import { GoogleAnalytics } from '../components/GoogleAnalytics';
import '../styles/global.css';

export const metadata: Metadata = {
  title: {
    default: 'Coffee Break Point',
    template: '%s | Coffee Break Point',
  },
  description: 'コーヒー休憩にちょうどよい技術よみものを目指して',
  metadataBase: new URL('https://shaba.dev'),
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://shaba.dev',
    title: 'Coffee Break Point',
    description: 'コーヒー休憩にちょうどよい技術よみものを目指して',
    siteName: 'Coffee Break Point',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Coffee Break Point',
    description: 'コーヒー休憩にちょうどよい技術よみものを目指して',
  },
  other: {
    'google-adsense-account': 'ca-pub-1981741527756003',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        {/* フォント */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <GoogleAnalytics />

        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
