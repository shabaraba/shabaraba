import '../styles/global.css'
import React, { useEffect } from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { AppProps } from 'next/app'
import { TweetLoader } from '../components/TweetLoader'
import { useRouter } from 'next/router'
import * as gtag from '../lib/gtag'

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
    <ChakraProvider>
        <TweetLoader />
        <Component {...pageProps} />
    </ChakraProvider>
  )
}
