import NextDocument, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'
import React from 'react'

import { GA_TRACKING_ID } from '../lib/gtag'

type Props = {
  slug?: string | null;
}
// Fix: Add fallback for GA_TRACKING_ID if not in .env
export const siteTitle = 'Coffee Break Point'
export const siteDescription = 'コーヒー休憩にちょうどよい技術よみものを目指して'

export default class Document extends NextDocument {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await NextDocument.getInitialProps(ctx);
    // サイドバーデータはgetStaticPropsから提供するため、ここでは取得しない
    
    // 現在のパスを取得
    const { pathname, asPath } = ctx;
    
    // スラッグを取得（存在する場合）
    let slug = null;
    
    // パスが/posts/[slug]の形式かどうかをチェック
    const postPathMatch = asPath.match(/\/posts\/([^\/]+)$/);
    if (postPathMatch && postPathMatch[1]) {
      slug = postPathMatch[1];
    }
    
    return { 
      ...initialProps,
      slug
    };
  }

  render() {
    const { slug } = this.props as Props;
    
    // OGP画像のURL生成（document.tsxでのみ使用）
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.shaba.dev';
    const ogImageUrl = slug 
      ? `${baseUrl}/og-images/${slug}.png` 
      : `${baseUrl}/og-images/default.png`;
    
    // 現在のページのURL
    const pageUrl = slug 
      ? `${baseUrl}/posts/${slug}` 
      : baseUrl;

    // 画像のサイズ設定
    const imageWidth = 1200;
    const imageHeight = 630;
    
    return (
      <Html lang="ja">
        <Head>
          {/* フォント関連 */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap" rel="stylesheet" />
          
          {/* OGP画像設定 - 記事ページの場合のみ */}
          {slug && (
            <>
              <meta property="og:image" content={ogImageUrl} />
              <meta property="og:image:width" content={String(imageWidth)} />
              <meta property="og:image:height" content={String(imageHeight)} />
              <meta property="og:type" content="article" />
              <meta property="og:url" content={pageUrl} />
              <meta name="twitter:image" content={ogImageUrl} />
              <meta name="twitter:card" content="summary_large_image" />
            </>
          )}
          
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
}