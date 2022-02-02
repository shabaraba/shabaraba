import { Button, Box, List, ListItem, ListIcon } from '@chakra-ui/react'
import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'
import PostList from '../components/posts/PostList'
import { GetStaticProps } from 'next'

// export default function Home({
//   allPostsData
// }: {
//   allPostsData: {
//     date: string
//     title: string
//     id: string
//   }[]
// }) {
export default function Home(){
  const onClick = async () => {
    // return await test();
  }

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
      <PostList />
      <Button onClick={onClick}>test</Button>
    </Layout>
  )
}

// export const getStaticProps: GetStaticProps = async () => {
//   const allPostsData = await getSortedPostsData()
//   return {
//     props: {
//       allPostsData
//     }
//   }
// }
