import React from 'react'
import useSWRImmutable from 'swr/immutable'
import { NextSeo } from 'next-seo';
import axios from 'axios'
import { useBreakpointValue, Text, Container, Box, VStack, Icon, Image, Link, Skeleton, Tooltip } from '@chakra-ui/react'
import {SiGithub, SiTwitter, SiQiita} from 'react-icons/si'
import Head from 'next/head'
import { siteTitle } from '../pages/_document'
import Layout from '../userinterface/components/layout'
import PostList from '../userinterface/components/posts/PostList'
import Notion from '../lib/notions'
import { InferGetStaticPropsType } from 'next'
import AuthorBox from '../userinterface/components/common/AuthorBox';

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export default function Home({allPostsData}: Props){
  const breakPoint = useBreakpointValue({ lg: 'desktop', sm: 'mobile' }, 'lg')
  return (
    <Layout home
      leftside={<AuthorBox />}
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

// server側で呼ばれる
export const getStaticProps = async () => {
  const token: string = process.env.NOTION_TOKEN;
  const databaseId: string = process.env.NOTION_BLOG_DATABASE;
  const notion = new Notion(token, databaseId);
  const allPostsData = await notion.getPostList();




  return {
    props: {
      allPostsData: allPostsData,
    },
    revalidate: 1 * 60
  }
}
