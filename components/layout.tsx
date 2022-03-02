import { Container, Image as ChakraImage, Box, List, ListItem, ListIcon } from '@chakra-ui/react'
import Head from 'next/head'
import Image from 'next/image'
import styles from './layout.module.css'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'

const siteTitle = 'Coffee Break Point'
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

      </Head>
      <header 
        className={styles.header}
        style={{background: '#e8cfc1'}}
      >
        {home ? (
          <>
            <h1 className={utilStyles.heading2Xl}>{siteTitle}</h1>
          </>
        ) : (
          <>
            <Link href="/">
              <a className={utilStyles.colorInherit}>
                <ChakraImage
                  h='100'
                  objectFit='cover'
                  src="/images/CoffeeBreakPoint.png"
                  alt={siteTitle}
                />
              </a>
            </Link>
          </>
        )}
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
