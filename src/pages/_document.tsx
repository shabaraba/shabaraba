import NextDocument, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'
import React from 'react'

import { GA_TRACKING_ID } from '../lib/gtag'
import { getSidebarData } from '../lib/sidebarData'

type Props = {}
// Fix: Add fallback for GA_TRACKING_ID if not in .env
export const siteTitle = 'Coffee Break Point'
export const siteDescription = 'コーヒー休憩にちょうどよい技術よみものを目指して'

export default class Document extends NextDocument {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await NextDocument.getInitialProps(ctx);
    // サイドバーデータをビルド時に取得
    const sidebarData = await getSidebarData();
    
    // サーバーサイドでdataプロパティを定義して、クライアント側でwindow.__SIDEBAR_DATA__として使用
    return { 
      ...initialProps,
      sidebarData 
    };
  }

  render() {
    // @ts-ignore - sidebarDataプロパティをDocumentに追加
    const { sidebarData } = this.props;
    
    return (
      <Html lang="ja">
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap" rel="stylesheet" />
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
          {/* サイドバーデータをグローバル変数として埋め込む */}
          {sidebarData && (
            <script
              dangerouslySetInnerHTML={{
                __html: `window.__SIDEBAR_DATA__ = ${JSON.stringify(sidebarData)};`,
              }}
            />
          )}
          <NextScript />
        </body>
      </Html>
    )
  }
}