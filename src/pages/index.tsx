import React from 'react'
import { useBreakpointValue, Text } from '@chakra-ui/react'
import Head from 'next/head'
import { siteTitle } from './_document'
import Layout from '../userinterface/components/layout'
import { PostHeadList } from '../userinterface/patterns/PostHeadList'
import { InferGetStaticPropsType } from 'next'
import AuthorBox from '../userinterface/components/common/AuthorBox';
import { Seo } from '../userinterface/components/common/Seo';
import { PostHeadService } from 'application/modules/post/services/PostHeadService'

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export default ({ allPostsData }: Props) => {
  // PostListに渡していたが、多分使ってない
  const breakPoint = useBreakpointValue({ lg: 'desktop', sm: 'mobile' }, 'lg')

  return (
    <Layout home
      leftside={<AuthorBox />}
    >
      <Seo title='Coffee+Break+Point' />
      <Head> <title>{siteTitle}</title> </Head>
      <Text fontSize='xl' mt={10}>Articles</Text>
      <PostHeadList data={allPostsData} />
    </Layout>
  )
}

// server側で呼ばれる
export const getStaticProps = async () => {
  const postHeadService = new PostHeadService();
  const allPostsData = await postHeadService.getList();

  return {
    props: {
      allPostsData: allPostsData,
    },
    // revalidate: 1 * 60
  }
}
