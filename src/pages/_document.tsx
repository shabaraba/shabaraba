import NextDocument, { Html, Head, Main, NextScript } from 'next/document'
import React from 'react'

import { GA_TRACKING_ID } from '../lib/gtag'

type Props = {}
export const siteTitle = 'Coffee Break Point'
export const siteDescription = 'コーヒー休憩にちょうどよい技術よみものを目指して'

export default function Document() {  
  return (
    <Html lang="ja">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin={'crossOrigin'} />
        <link href="https://fonts.googleapis.com/css2?family=Caveat&display=swap" rel="stylesheet" />
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
        {/*google adsense*/}
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1788385520787014" 
          crossOrigin="anonymous"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}