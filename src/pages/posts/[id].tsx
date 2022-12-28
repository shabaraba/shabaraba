import { SlideFade } from '@chakra-ui/react'
import AuthorBox from '../../userinterface/components/common/AuthorBox'
import Layout from '../../userinterface/components/layout'
import Head from 'next/head'

import * as NotionBlock from '../../entities/notion/blocks'
import * as NotionPageType from '../../interfaces/NotionPageApiResponses';

import Notion from '../../lib/notions'
import { setOGPToBookmarkBlocks } from '../../lib/backend/ogp';

import { InferGetStaticPropsType, GetStaticPaths } from 'next'
import { PostTitle } from '../../userinterface/modules/post/PostTitle';
import { Seo } from '../../userinterface/components/common/Seo';
import { PostDetail } from '../../userinterface/modules/post/PostDetail';


const SideArea = ({ tags, post, titleBlock }: { tags: any[], post: NotionPageType.IPageHead, titleBlock: NotionBlock.Heading1 }) => {
  return (
    <>
      <PostTitle tags={tags} post={post} titleBlock={titleBlock} />
    </>
  )
}

const MainArea = ({ postBlockList }: { postBlockList: NotionBlock.BlockList }) => {
  return (
    <PostDetail blockList={postBlockList} />
  )
}

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export default ({ tags, post, pageJson, postBlockJson }: Props) => {
  const postBlockList = NotionBlock.BlockList.deserialize(postBlockJson.results)
  const titleBlock: NotionBlock.Heading1 = Notion.convertPageResponseToNotionHeading1Block(pageJson)
  const postHead: NotionPageType.IPageHead = post

  const coverImageUrl: string | null = postHead.cover?.file?.url ?? postHead.cover?.external?.url ?? null

  return (
    <Layout leftside={
      <SlideFade in={true} offsetY='20px'>
        <SideArea tags={tags} post={postHead} titleBlock={titleBlock} />
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
  const token: string = process.env.NOTION_TOKEN;
  const databaseId: string = process.env.NOTION_BLOG_DATABASE;
  const notion = new Notion(token, databaseId);
  const allPostsData = await notion.getPostList();
  const pathList = allPostsData.map(post => {
    return {
      params: { id: post.slug }
    }
  });
  return {
    paths: pathList,
    fallback: false
  }
}

// server側で呼ばれる
export const getStaticProps = async ({ params }) => {
  const slug = params.id;
  const token: string = process.env.NOTION_TOKEN;
  const databaseId: string = process.env.NOTION_BLOG_DATABASE;
  const notion: Notion = new Notion(token, databaseId);
  const postId: string = await notion.getPostIdBySlug(slug);

  const [post, pageJson]: [NotionPageType.IPageHead, any] = await notion.getPostById(postId);

  // const tagsWithIcon = post.tags.map((tag) => getTagIcon(tag))
  const tagsWithIcon = post.tags


  const postBlockList = await notion.getPostBlockListById(postId);
  const postBlockListWithOGP = await setOGPToBookmarkBlocks(postBlockList)

  return {
    props: {
      tags: tagsWithIcon,
      post: post,
      pageJson: pageJson,
      postBlockJson: postBlockListWithOGP,
    },
    // revalidate: 1 * 60
  }
}
