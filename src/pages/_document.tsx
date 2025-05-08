import { Html, Head, Main, NextScript } from 'next/document'
import React from 'react'

import { GA_TRACKING_ID } from '../lib/gtag'

// Fix: Add fallback for GA_TRACKING_ID if not in .env
export const siteTitle = 'Coffee Break Point'
export const siteDescription = 'コーヒー休憩にちょうどよい技術よみものを目指して'

export default function Document() {
  // OGP画像と共通metaタグはアプリケーションレベルで設定
  // _app.tsxか各ページコンポーネントで設定する
  
  return (
    <Html lang="ja">
      <Head>
        {/* フォント関連 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap" rel="stylesheet" />

        <meta name="google-adsense-account" content="ca-pub-1981741527756003" />
        
        {/* Global Site Tag (gtag.js) - Google Analytics */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_TRACKING_ID}', {
            page_path: window.location.pathname,
          });
        `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
