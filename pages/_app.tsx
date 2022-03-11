import '../styles/global.css'
import React, { useEffect } from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { AppProps } from 'next/app'
import { TweetLoader } from '../components/TweetLoader'
import { useRouter } from 'next/router'
import { DefaultSeo, NextSeo } from 'next-seo'
import * as gtag from '../lib/gtag'
import SEO from '../next-seo.config'

export const siteTitle = 'Coffee Break Point'
export const siteDescription = 'コーヒー休憩にちょうどよい技術よみものを目指して'
export const siteUrl = 'https://blog.from-garage.com'

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
      <DefaultSeo {...SEO} />
      <ChakraProvider>
        <TweetLoader />
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  )
}
