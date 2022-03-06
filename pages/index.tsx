import { Text } from '@chakra-ui/react'
import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import PostList from '../components/posts/PostList'
import Notion from '../lib/backend/notions'
import { InferGetStaticPropsType } from 'next'

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export default function Home({allPostsData}: Props){
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <PostList
        data = {allPostsData}
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
