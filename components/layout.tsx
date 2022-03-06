import { Container, Text, Link as ChakraLink } from '@chakra-ui/react'
import Head from 'next/head'
import styles from './layout.module.css'
import Link from 'next/link'

export const siteTitle = 'Coffee Break Point'
export const siteDescription = 'コーヒー休憩にちょうどよい技術よみものを目指して'

export default function Layout({
  children,
  home
}: {
  children: React.ReactNode
  home?: boolean
}) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content={siteDescription}
        />
        <meta
          property="og:image"
          content={`https://og-image.vercel.app/${encodeURI(
            siteDescription
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteDescription} />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@shaba_raba" />
        <meta name="twitter:title" content={siteTitle} />
        <meta name="twitter:description" content={siteDescription} />
        <meta name="twitter:image" content={`https://og-image.vercel.app/${encodeURI(
            siteDescription
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin={'crossOrigin'} />
        <link href="https://fonts.googleapis.com/css2?family=Caveat&display=swap" rel="stylesheet" />
      </Head>
      <header
        style={{
          background: '#e8cfc1'
        }}
      >
        <Link href="/">
          <ChakraLink
            fontSize='4xl'
            position='relative'
            display='inline-block'
            textDecoration='none'
            style={{
              fontFamily: "'Caveat', cursive",
              transform: "rotate(-5deg)"
            }}
            _hover={{
              textDecoration: 'underline',
              transition: 'transform .3s',
            }}
          >
            {siteTitle}
          </ChakraLink>
        </Link>
      </header>
      <Container
        pr={50}
        maxW='100%'
        bg='#FFF5F3'
      >
        <main>{children}</main>
        {!home && (
          <div className={styles.backToHome}>
            <Link href="/">
              <a>← Back to home</a>
            </Link>
          </div>
        )}
      </Container>
    </>
  )
}
