import React from 'react'
import { useBreakpointValue, Container, HStack, Text, Icon, Grid, GridItem, Link as ChakraLink } from '@chakra-ui/react'
import {SiNotion, SiNetlify, SiNextdotjs} from 'react-icons/si'
import Sticky from 'react-sticky-el'
import Head from 'next/head'
import styles from './layout.module.css'
import Link from 'next/link'

export const siteTitle = 'Coffee Break Point'
export const siteDescription = 'コーヒー休憩にちょうどよい技術よみものを目指して'

const HeadTag: React.FC = () => {
  return (
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
  )
}

const SiteLogo: React.FC = () => {
  return (
    <header
      style={{
        background: '#FFF5F3'
      }}
    >
      <Link href="/">
        <ChakraLink
          pt={3}
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
  )
}


export default function Layout({
  children,
  leftside,
  home
}: {
  children: React.ReactNode
  leftside?: React.ReactNode
  home?: boolean
}) {
  const isMobile = useBreakpointValue({lg: false, sm: true, base: true})
                    // background: '#e8cfc1'
  return (
    <>
      <HeadTag />
      <Container pr={50} maxW='100%' bg='#FFF5F3'>
        <main>
          <Grid templateColumns={{lg: 'repeat(12, 1fr)', base: '1fr'}} gap={4} w='100%'>
            <GridItem colSpan={{lg: 3, base: 1}} >
              <Sticky disabled={isMobile}>
                <SiteLogo />
                {leftside}
              </Sticky>
            </GridItem>
            <GridItem colSpan={{lg: 8, base: 1}} p={{lg: 5, base: 1}} >
              {children}
            </GridItem>
          </Grid>
        </main>
        {!home && (
          <div className={styles.backToHome}>
            <Link href="/">
              <a>← Back to home</a>
            </Link>
          </div>
        )}
        <Sticky>
          <Footer />
        </Sticky>
      </Container>
    </>
  )
}

const Footer = () => {
  return (
    <Container
      p={5}
      fontSize='sm'
    >
      <Text textAlign='center'>
        ©from-garage 2022 All Rights Reserved.
      </Text>
      <HStack
        align='center'
        justify='center'
      >
        <Text as='span'> powered by</Text>
        <Icon as={SiNextdotjs} />
        <Icon as={SiNetlify} />
        <Icon as={SiNotion} />
      </HStack>
    </Container>
  )
}
