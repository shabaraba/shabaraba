import React from 'react'
import useSWRImmutable from 'swr/immutable'
import { NextSeo } from 'next-seo';
import axios from 'axios'
import { useBreakpointValue, Text, Container, Box, VStack, Icon, Image, Link, Skeleton, Tooltip } from '@chakra-ui/react'
import {SiGithub, SiTwitter, SiQiita} from 'react-icons/si'
import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import PostList from '../components/posts/PostList'
import Notion from '../lib/backend/notions'
import { InferGetStaticPropsType } from 'next'

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export default function Home({allPostsData}: Props){
  const breakPoint = useBreakpointValue({ lg: 'desktop', sm: 'mobile' }, 'lg')
  return (
    <Layout home
      leftside={<Author />}
    >
      <NextSeo
        openGraph={{
          title: 'Coffee Break Point',
          images: [
            { 
              url: 
                'https://og-image-shabaraba.vercel.app/' + 
                '.png?' +
                'md=1&' +
                'fontSize=100px&' +
                'q=85&' +
                'fm=jpg&' +
                'crop=entropy&' +
                'cs=srgb&' +
                'siteTitle=Coffee+Break+Point'
                // 'bg=https%3A%2F%2Fimages.unsplash.com/photo-1514119412350-e174d90d280e?ixlib=rb-1.2.1'
            },
          ],
        }}
      />
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <Text fontSize='xl' mt={10}>Articles</Text>
      <PostList
        data = {allPostsData}
        breakPoint = {breakPoint}
      />
    </Layout>
  )
}

const Author: React.FC = () => {
  const fetcher = async (url:string) => {
    console.log('fetching... -> ' + url)
    const result = await axios.get(url)
    console.log('result... -> ' + JSON.stringify(result))
    return result.data
  }

  const { data: fetchedData } = useSWRImmutable('https://api.github.com/users/shabaraba', fetcher)
  if (!fetchedData) return <Skeleton />

  const avatarUrl = fetchedData.avatar_url
  const iconSize = 6
  return (
    <Container
      p={5}
    >
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
      >
        <Image
          borderRadius='full'
          boxSize='150px'
          alt='shabaraba'
          src={avatarUrl}
        />
        <VStack
          align='center'
          justify='center'
          ml={5}
        >
          <Tooltip hasArrow label='Github' placement='right-start'>
            <Link href="https://github.com/shabaraba">
              <Icon as={SiGithub} w={iconSize} h={iconSize}/>
            </Link>
          </Tooltip>
          <Tooltip hasArrow label='Twitter' placement='right-start'>
            <Link href="https://twitter.com/shaba_raba">
              <Icon as={SiTwitter} w={iconSize} h={iconSize}/>
            </Link>
          </Tooltip>
          <Tooltip hasArrow label='Qiita' placement='right-start'>
            <Link href="https://qiita.com/shabaraba">
              <Icon as={SiQiita} w={iconSize} h={iconSize}/>
            </Link>
          </Tooltip>
        </VStack>
      </Box>
      <Box
        p={5}
      >
        <Text fontSize='lg'>
          Author: しゃば
        </Text>
        <Text fontSize='xs'>
          ロボット好きのPHPエンジニア<br />
          自分でイジれるおもちゃを欲しがち<br />
          時間がなく3年ほど中断している工作機械自作の完成が夢<br />
        </Text>
      </Box>

    </Container>
  )
}

// server側で呼ばれる
export const getStaticProps = async () => {
  const token: string = process.env.NOTION_TOKEN;
  const databaseId: string = process.env.NOTION_BLOG_DATABASE;
  const notion = new Notion(token, databaseId);
  const allPostsData = await notion.getPostList();

  // console.log("START---------getStaticProps---------------")
  // console.log(allPostsData)
  // console.log("END-----------getStaticProps---------------")
  return {
    props: {
      allPostsData: allPostsData,
    },
    revalidate: 1 * 60
  }
}
