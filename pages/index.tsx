import React from 'react'
import AuthorBox from '../components/common/AuthorBox'
import { useBreakpointValue, Text, Container, Box, VStack, Icon, Image, Link, Skeleton, Tooltip } from '@chakra-ui/react'
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
      leftside={<AuthorBox />}
    >
      <Head>
        <title>{siteTitle}</title>
      </Head>
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
