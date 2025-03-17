import 'styles/global.css'
import Head from 'next/head'
import React, { useEffect } from 'react'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { AppProps } from 'next/app'
import { TweetLoader } from '../components/units/TweetLoader'
import { useRouter } from 'next/router'
import { DefaultSeo } from 'next-seo'
import * as gtag from '../lib/gtag'
import SEO from '../../next-seo.config'

export const siteTitle = 'Coffee Break Point'
export const siteDescription = 'コーヒー休憩にちょうどよい技術よみものを目指して'
export const siteUrl = 'https://blog.shaba.dev'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      gtag.pageview(url)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={siteDescription} />
      </Head>
      <DefaultSeo {...SEO} />
      <ChakraProvider theme={extendTheme({})}>
        <TweetLoader />
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  )
}
