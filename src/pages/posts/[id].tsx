import { SlideFade } from '@chakra-ui/react'
import AuthorBox from '../../userinterface/components/common/AuthorBox'
import Layout from '../../userinterface/components/layout'
import Head from 'next/head'

import * as NotionBlock from '../../entities/notion/blocks'
import * as NotionPageType from '../../interfaces/NotionPageApiResponses';

import { InferGetStaticPropsType, GetStaticPaths } from 'next'
import { PostTitle } from '../../userinterface/modules/post/PostTitle';
import { Seo } from '../../userinterface/components/common/Seo';
import { PostDetail } from '../../userinterface/modules/post/PostDetail';
import { PostHeadService } from 'application/modules/post/services/PostHeadService'
import { PostDetailService } from 'application/modules/post/services/PostDetailService'
import { TagService } from 'application/modules/post/services/TagService'


const SideArea = ({ tags, post, title }: { tags: any[], post: NotionPageType.IPageHead, title: string }) => {
  return (
    <>
      <PostTitle tags={tags} post={post} title={title} />
    </>
  )
}

const MainArea = ({ postBlockList }: { postBlockList: NotionBlock.BlockList }) => {
  return (
    <PostDetail blockList={postBlockList} />
  )
}

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export default ({ tags, post, title, postBlockJson }: Props) => {
  const postBlockList = NotionBlock.BlockList.deserialize(postBlockJson.results)
  const postHead: NotionPageType.IPageHead = post

  // TODO: PostHeadEntityに持たせる（pages用のentity）
  const coverImageUrl: string | null = postHead.cover?.file?.url ?? postHead.cover?.external?.url ?? null

  return (
    <Layout leftside={
      <SlideFade in={true} offsetY='20px'>
        <SideArea tags={tags} post={postHead} title={title} />
      </SlideFade>
    } >
      <Seo title={post.title} coverImageUrl={coverImageUrl} />
      <Head> <title>{post.title}</title> </Head>
      <SlideFade in={true} offsetY='20px'>
        <MainArea postBlockList={postBlockList} />
      </SlideFade>
      <AuthorBox />
    </Layout>
  )
}

// server側で呼ばれる
export const getStaticPaths: GetStaticPaths = async () => {
  const postHeadService = new PostHeadService();
  const pathParams = await postHeadService.getPathParams();
  return {
    paths: pathParams,
    fallback: false
  }
}

// server側で呼ばれる
export const getStaticProps = async ({ params }) => {
  const slug = params.id;

  const postHeadService = new PostHeadService();
  const postHead = await postHeadService.getBySlug(slug);
  const postDetailService = new PostDetailService();
  const post = await postDetailService.get(postHead.id);

  const tagService = new TagService();
  const tags = await tagService.getListByPost(postHead);

  return {
    props: {
      tags: tags,
      post: postHead,
      postBlockJson: post,
      title: postHead.title
    },
    // revalidate: 1 * 60
  }
}
