import '../styles/global.css'
import React, { createContext } from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { AppProps } from 'next/app'
import { TweetLoader } from '../components/TweetLoader'

export const BreakPointValueContext = createContext(null)

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
        <TweetLoader />
        <Component {...pageProps} />
    </ChakraProvider>
  )
}
