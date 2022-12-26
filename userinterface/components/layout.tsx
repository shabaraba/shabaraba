import React from 'react'
import { useBreakpointValue, Container, Box, HStack, Text, Icon, Grid, GridItem, Link as ChakraLink } from '@chakra-ui/react'
import {SiNotion, SiNetlify, SiNextdotjs} from 'react-icons/si'
import Sticky from 'react-sticky-el'
import {siteTitle} from '../../pages/_document'
import styles from './layout.module.css'
import Link from 'next/link'

const SiteLogo: React.FC = () => {
  return (
    <header
      style={{
        background: '#FFF5F3'
      }}
    >
      <ChakraLink
        as={Link}
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
      <Box maxW='100vw' bg='#FFF5F3'>
        <main>
          <Grid templateColumns={{lg: 'repeat(12, 1fr)', base: '1fr'}} gap={25} w='100%'>
            <GridItem colSpan={{lg: 3, base: 1}} >
              <Container>
                {/* {!isMobile?
                  <Sticky disabled={isMobile}>
                    <>
                      <SiteLogo />
                      {leftside}
                    </>
                  </Sticky>
                :
                  <>
                    <SiteLogo />
                    {leftside}
                  </>
                } */}
              </Container>
            </GridItem>
            <GridItem 
              colSpan={{lg: 9, base: 1}} 
            >
              <Container maxW='container.lg'>
                {children}
              </Container>
            </GridItem>
          </Grid>
        </main>
        {!home && (
            <div className={styles.backToHome}>
              <Link href="/"> ← Back to home </Link>
          </div>
        )}
        {/* <Sticky>
          <Footer />
        </Sticky> */}
      </Box>
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
