import React, { useEffect, useState } from "react"
import Head from "next/head"
import { AppProps } from "next/app"
import { useRouter } from "next/router"
import { DefaultSeo } from "next-seo"
import * as gtag from "../lib/gtag"
import SEO from "../../next-seo.config"
import { ACTIVE_THEME } from "../lib/themeSelector"
import { SidebarProvider, TagData, SeriesData } from "../contexts/SidebarContext"

// グローバルスタイルのインポート
import "../styles/global.css"

// グローバル変数の型定義
declare global {
  interface Window {
    __SIDEBAR_DATA__?: {
      trendingPosts: any[];
      tags: TagData[];
      series: SeriesData[];
    };
  }
}

export const siteTitle = "Coffee Break Point"
export const siteDescription = "コーヒー休憩にちょうどよい技術よみものを目指して"
export const siteUrl = "https://blog.shaba.dev"

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [sidebarData, setSidebarData] = useState({
    trendingPosts: [],
    tags: [],
    series: []
  });

  // サイドバーデータを取得
  useEffect(() => {
    if (typeof window !== 'undefined' && window.__SIDEBAR_DATA__) {
      // コンソールログはデバッグ目的で最小限に
      if (process.env.NODE_ENV === 'development') {
        console.log('Loading sidebar data from window.__SIDEBAR_DATA__');
      }
      setSidebarData(window.__SIDEBAR_DATA__);
    }
  }, []);
  
  // Google Analyticsのページビュートラッキング
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      gtag.pageview(url)
    }
    router.events.on("routeChangeComplete", handleRouteChange)
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange)
    }
  }, [router.events])

  // サイドバーデータの最適化
  const memoizedSidebarData = React.useMemo(() => ({
    trendingPosts: sidebarData.trendingPosts,
    tags: sidebarData.tags,
    series: sidebarData.series
  }), [sidebarData.trendingPosts, sidebarData.tags, sidebarData.series]);

  // 開発環境でのみログ出力
  if (process.env.NODE_ENV === 'development') {
    console.log(`Active theme: ${ACTIVE_THEME}`);
    console.log(`Optimized sidebar data prepared with ${memoizedSidebarData.trendingPosts.length} trending posts`);
  }

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={siteDescription} />
      </Head>
      <DefaultSeo {...SEO} />
      <SidebarProvider 
        trendingPosts={memoizedSidebarData.trendingPosts}
        tags={memoizedSidebarData.tags}
        series={memoizedSidebarData.series}
      >
        <Component {...pageProps} />
      </SidebarProvider>
    </>
  )
}
