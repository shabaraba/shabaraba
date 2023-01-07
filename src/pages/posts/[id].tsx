import { SlideFade } from '@chakra-ui/react'
import AuthorBox from '../../userinterface/components/common/AuthorBox'
import Layout from '../../userinterface/components/layout'
import Head from 'next/head'

import { InferGetStaticPropsType } from 'next'
import { PostTitle } from '../../userinterface/modules/post/PostTitle';
import { Seo } from '../../userinterface/components/common/Seo';
import { PostDetail } from '../../userinterface/modules/post/PostDetail';
import { PostDetailEntity } from 'core/entities/PostDetailEntity'
import { PostHeadEntity } from 'core/entities/PostHeadEntity';
import { ArticlePageUsecase } from 'application/usecases/ArticlePageUsecase'


const SideArea = ({ tags, post, title }: { tags: any[], post: PostHeadEntity, title: string }) => {
  return (
    <>
      <PostTitle tags={tags} post={post} title={title} />
    </>
  )
}

const MainArea = ({ postDetail }: { postDetail: PostDetailEntity }) => {
  return (
    <PostDetail postDetail={postDetail} />
  )
}

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export default ({ tags, postHead, title, postDetail }: Props) => {
  const postHeadEntity:PostHeadEntity = new PostHeadEntity(postHead);

  return (
    <Layout leftside={
      <SlideFade in={true} offsetY='20px'>
        <SideArea tags={tags} post={postHeadEntity} title={title} />
      </SlideFade>
    } >
      <Seo title={postHeadEntity.title} coverImageUrl={postHeadEntity.coverImageUrl} />
      <Head> <title>{postHeadEntity.title}</title> </Head>
      <SlideFade in={true} offsetY='20px'>
        <MainArea postDetail={postDetail} />
      </SlideFade>
      <AuthorBox />
    </Layout>
  )
}

// server側で呼ばれる
export const getStaticPaths = async () => ArticlePageUsecase.getStaticPaths();

// server側で呼ばれる
export const getStaticProps = async ({ params }) => ArticlePageUsecase.getStaticProps({params});