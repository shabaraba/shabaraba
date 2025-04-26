import React, { useEffect } from 'react'
import Head from 'next/head'
import { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { DefaultSeo } from 'next-seo'
import * as gtag from '../lib/gtag'
import SEO from '../../next-seo.config'
import { ACTIVE_THEME } from '../lib/themeSelector'

// グローバルスタイルのインポート
import '../styles/global.css'

export const siteTitle = 'Coffee Break Point'
export const siteDescription = 'コーヒー休憩にちょうどよい技術よみものを目指して'
export const siteUrl = 'https://blog.shaba.dev'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  
  // Google Analyticsのページビュートラッキング
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      gtag.pageview(url)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  // アクティブテーマをコンソールに出力（デバッグ用）
  console.log(`Active theme: ${ACTIVE_THEME}`)

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={siteDescription} />
      </Head>
      <DefaultSeo {...SEO} />
      <Component {...pageProps} />
    </>
  )
}
