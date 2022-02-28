import '../styles/global.css'
import { ChakraProvider } from '@chakra-ui/react'
import { AppProps } from 'next/app'
import { TweetLoader } from '../components/TweetLoader'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
        <TweetLoader />
        <Component {...pageProps} />
    </ChakraProvider>
  )
}
