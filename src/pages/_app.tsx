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
      console.log('Loading sidebar data from window.__SIDEBAR_DATA__', window.__SIDEBAR_DATA__);
      setSidebarData(window.__SIDEBAR_DATA__);
    } else {
      console.log('No window.__SIDEBAR_DATA__ found');
    }
  }, [pageProps]);
  
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

  // アクティブテーマの確認
  console.log(`Active theme: ${ACTIVE_THEME}`)
  console.log(`Sidebar data loaded: ${sidebarData.trendingPosts.length} trending posts, ${sidebarData.tags.length} tags, ${sidebarData.series.length} series`);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={siteDescription} />
      </Head>
      <DefaultSeo {...SEO} />
      <SidebarProvider 
        trendingPosts={sidebarData.trendingPosts}
        tags={sidebarData.tags}
        series={sidebarData.series}
      >
        <Component {...pageProps} />
      </SidebarProvider>
    </>
  )
}
