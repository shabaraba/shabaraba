import { Box } from '@chakra-ui/react'
import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import PostList from '../components/posts/PostList'
import Notion from '../lib/notions'
import { InferGetStaticPropsType } from 'next'

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export default function Home({allPostsData}: Props){
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <Box bg = "red.300">Coffee Break Point</Box>
        <p>
          (This is a sample website - you’ll be building a site like this in{' '}
          <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)
        </p>
      </section>
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
