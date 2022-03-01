import { Box, Grid, GridItem, Divider } from '@chakra-ui/react'
import Layout from '../../components/layout';
import Block from '../../components/posts/Block';
import Date from '../../components/date'
import Head from 'next/head';
import {v4 as uuidv4} from 'uuid';

import * as NotionBlock from '../../entities/notion/blocks';
import { NotionPostHead } from '../../entities/notion_entities'

import FrontendNotion from '../../lib/frontend/notions'
import BackendNotion from '../../lib/backend/notions'
import { InferGetStaticPropsType, GetStaticPaths } from 'next'

import Sticky from 'react-sticky-el'

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const LeftSideArea = ({post, titleBlock}: {post: NotionPostHead, titleBlock: NotionBlock.Heading1}) => {
  return (
    <Box>
      <Box>
        <Sticky>
          <Block entity={titleBlock}/>
          <Box textAlign={['right']}>
            <Date dateString={post.updatedAt}/>
          </Box>
        </Sticky>
      </Box>
    </Box>
  )
}

const RightSideArea = () => {
  return (
    <></>
  )
}

const MainArea = ({post, postBlockList, titleBlock}: {post: NotionPostHead, postBlockList: NotionBlock.BlockList, titleBlock: NotionBlock.Heading1}) => {
  return (
    <Box as='article'>
      {postBlockList.data.map((block: NotionBlock.Block) =>
        <Block
          key = {uuidv4()}
          entity={block} />
      )}
    </Box>
  )
}

export default function Post({post, pageJson, postBlockJson}: Props) {
 
  const postBlockList = NotionBlock.BlockList.deserialize(postBlockJson.results)
  const titleBlock: NotionBlock.Heading1 = FrontendNotion.convertPageResponseToNotionHeading1Block(pageJson)
  const postHead: NotionPostHead = post

  return (
    <Layout>
      <Head>
        <title>{post.title}</title>
      </Head>
      <Grid
        // templateRows='repeat(2, 1fr)'
        templateColumns='repeat(12, 1fr)'
        gap={4}
        w='100%'
      >
        <GridItem
          colSpan={3}
        >
          <LeftSideArea post={postHead} titleBlock={titleBlock}/>
        </GridItem>
        <GridItem
          colSpan={9}
          p={5}
        >
          <MainArea post={postHead} postBlockList={postBlockList} titleBlock={titleBlock}/>
        </GridItem>
      </Grid>
    </Layout>
  )
}

// server側で呼ばれる
export const getStaticPaths: GetStaticPaths = async () => {
  const token: string = process.env.NOTION_TOKEN;
  const databaseId: string = process.env.NOTION_BLOG_DATABASE;
  const notion = new BackendNotion(token, databaseId);
  const allPostsData = await notion.getPostList();
  const pathList = allPostsData.map(post => {
    return {
      params: {id: post.slug}
    }
  });
  return {
    paths: pathList,
    fallback: false
  }
}

// server側で呼ばれる
export const getStaticProps = async ({params}) => {
  const slug = params.id;
  // console.log("START-------[id]");
  // console.log(params);
  // console.log(slug);
  const token: string = process.env.NOTION_TOKEN;
  const databaseId: string = process.env.NOTION_BLOG_DATABASE;
  const notion: BackendNotion = new BackendNotion(token, databaseId);
  const postId: string = await notion.getPostIdBySlug(slug);
  // console.log(postId);
  const [post, pageJson]: [NotionPostHead, any] = await notion.getPostById(postId);
  const postBlockList = await notion.getPostBlockListById(postId);
  const postBlockListWithOGP = await BackendNotion.setOGPToBookmarkBlocks(postBlockList)
  // console.log("---------------------------------------------[id]");
  // console.log(JSON.stringify(postBlockListWithOGP, null, " "))
  // console.log("END---------[id]");

  return {
    props: {
      post: post,
      pageJson: pageJson,
      postBlockJson: postBlockListWithOGP,
    },
    revalidate: 1 * 60
  }
}
