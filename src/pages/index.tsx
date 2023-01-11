import React from 'react'
import { useBreakpointValue, Text } from '@chakra-ui/react'
import Head from 'next/head'
import { InferGetStaticPropsType } from 'next';
import AuthorBox from 'components/units/common/AuthorBox';
import { Seo } from 'components/units/common/Seo';
import Layout from 'components/units/layout';
import { PostHeadList } from 'components/patterns/PostHeadList';
import { siteTitle } from './_app';
import { PostHeadEntity } from '../core/entities/PostHeadEntity';
import { ArticleListPageUsecase } from 'application/usecases/ArticleListPageUsecase';
import { PostHeadType } from 'core/types/PostHeadType';

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export default ({ allPostsData }: Props) => {
  // PostListに渡していたが、多分使ってない
  const breakPoint = useBreakpointValue({ lg: 'desktop', sm: 'mobile' }, 'lg')
  const data: PostHeadEntity[] = allPostsData.map((postHead: PostHeadType) => new PostHeadEntity(postHead));

  return (
    <Layout home
      leftside={<AuthorBox />}
    >
      <Seo title='Coffee+Break+Point' />
      <Head> <title>{siteTitle}</title> </Head>
      <Text fontSize='xl' mt={10}>Articles</Text>
      <PostHeadList data={data} />
    </Layout>
  )
}

// server側で呼ばれる
export const getStaticProps = async () => ArticleListPageUsecase.getStaticProps();