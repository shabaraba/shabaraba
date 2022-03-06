import { Icon, Box, Grid, GridItem, Wrap, WrapItem } from '@chakra-ui/react'
import { useBreakpointValue } from '@chakra-ui/react'
import {MdCreate, MdUpdate, MdArrowRightAlt } from 'react-icons/md'
import Layout from '../../components/layout'
import Block from '../../components/posts/Block'
import Date from '../../components/date'
import Head from 'next/head'
import {v4 as uuidv4} from 'uuid'

import * as NotionBlock from '../../entities/notion/blocks'
import Tag from '../../components/posts/Tag'
import { NotionPostHead } from '../../entities/notion_entities'

import FrontendNotion from '../../lib/frontend/notions'
import BackendNotion from '../../lib/backend/notions'
// import { getTagIcon } from '../../lib/backend/icons'

import useLocation from '../../components/hooks/useLocation'

import { InferGetStaticPropsType, GetStaticPaths } from 'next'

import Sticky from 'react-sticky-el'
import {
  TwitterIcon,
  TwitterShareButton,
  LineShareButton,
  LineIcon,
  HatenaShareButton,
  HatenaIcon,
  FacebookIcon,
  FacebookShareButton
} from "react-share"

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const PostTitle = ({tags, post, titleBlock}: {tags: any[], post: NotionPostHead, titleBlock: NotionBlock.Heading1}) => {
  const url = useLocation()
  console.log(url.href)

  return (
    <>
      <Block entity={titleBlock}/>
      <Wrap>
        {tags.map((tag) => (
          <WrapItem key={uuidv4()}>
            <Tag entity={tag} />
          </WrapItem>
        ))}
      </Wrap>
      <Box fontSize='sm' textAlign={['right']}>
        <Wrap justify='right'>
          <WrapItem>
            <Icon as={MdCreate} />
            <Date dateString={post.createdAt}/>
          </WrapItem>
          <WrapItem>
            <Icon as={MdArrowRightAlt} />
          </WrapItem>
          <WrapItem>
            <Icon as={MdUpdate} />
            <Date dateString={post.updatedAt}/>
          </WrapItem>
        </Wrap>
        <Wrap justify='right'>
          <WrapItem>
            <TwitterShareButton url={url.href} title={post.title}>
              <TwitterIcon size={32} round={true}/>
            </TwitterShareButton>
          </WrapItem>
          <WrapItem>
            <LineShareButton url={url.href} title={post.title}>
              <LineIcon size={32} round={true}/>
            </LineShareButton>
          </WrapItem>
          <WrapItem>
            <HatenaShareButton url={url.href} title={post.title}>
              <HatenaIcon size={32} round={true}/>
            </HatenaShareButton>
          </WrapItem>
          <WrapItem>
            <FacebookShareButton url={url.href} title={post.title}>
              <FacebookIcon size={32} round={true}/>
            </FacebookShareButton>
          </WrapItem>
        </Wrap>
      </Box>
    </>
  )
}

const LeftSideArea = ({tags, post, titleBlock, isSideColumn}: {tags: any[], post: NotionPostHead, titleBlock: NotionBlock.Heading1, isSideColumn: boolean}) => {

  return (
    <>
      {isSideColumn ? (
        <Sticky>
          <PostTitle tags={tags} post={post} titleBlock={titleBlock} />
        </Sticky>
        ) : (
          <PostTitle tags={tags} post={post} titleBlock={titleBlock} />
        )
      }
    </>
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

const TwoColumnLayout = ({tags, postHead, postBlockList, titleBlock}: {tags: any[], postHead: NotionPostHead, postBlockList: NotionBlock.BlockList, titleBlock: NotionBlock.Heading1}) => {
  return (
    <Grid
      templateColumns='repeat(12, 1fr)'
      gap={4}
      w='100%'
    >
      <GridItem
        colSpan={3}
      >
        <LeftSideArea tags={tags} post={postHead} titleBlock={titleBlock} isSideColumn={true}/>
      </GridItem>
      <GridItem
        colSpan={7}
        p={5}
      >
        <MainArea post={postHead} postBlockList={postBlockList} titleBlock={titleBlock}/>
      </GridItem>
    </Grid>
  )
}

const OneColumnLayout = ({tags, postHead, postBlockList, titleBlock}: {tags: any[], postHead: NotionPostHead, postBlockList: NotionBlock.BlockList, titleBlock: NotionBlock.Heading1}) => {
  return (
    <>
      <LeftSideArea tags={tags} post={postHead} titleBlock={titleBlock} isSideColumn={false}/>
      <MainArea post={postHead} postBlockList={postBlockList} titleBlock={titleBlock}/>
    </>
  )
}

export default function Post({tags, post, pageJson, postBlockJson}: Props) {
  const isTwoColumns = useBreakpointValue({ lg: true })
  console.log("isTwoColumns: " + isTwoColumns)
  console.log("tags: " + JSON.stringify(tags))
 
  const postBlockList = NotionBlock.BlockList.deserialize(postBlockJson.results)
  const titleBlock: NotionBlock.Heading1 = FrontendNotion.convertPageResponseToNotionHeading1Block(pageJson)
  const postHead: NotionPostHead = post

  return (
    <Layout>
      <Head>
        <title>{post.title}</title>
      </Head>
      <article>
        {isTwoColumns ?
          <TwoColumnLayout tags={tags} postHead={postHead} postBlockList={postBlockList} titleBlock={titleBlock} />
          :
          <OneColumnLayout tags={tags} postHead={postHead} postBlockList={postBlockList} titleBlock={titleBlock} />
        }
      </article>
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
  const token: string = process.env.NOTION_TOKEN;
  const databaseId: string = process.env.NOTION_BLOG_DATABASE;
  const notion: BackendNotion = new BackendNotion(token, databaseId);
  const postId: string = await notion.getPostIdBySlug(slug);

  const [post, pageJson]: [NotionPostHead, any] = await notion.getPostById(postId);

  // const tagsWithIcon = post.tags.map((tag) => getTagIcon(tag))
  const tagsWithIcon = post.tags
  console.log("withIcon: " + JSON.stringify(tagsWithIcon))

  const postBlockList = await notion.getPostBlockListById(postId);
  const postBlockListWithOGP = await BackendNotion.setOGPToBookmarkBlocks(postBlockList)

  return {
    props: {
      tags: tagsWithIcon,
      post: post,
      pageJson: pageJson,
      postBlockJson: postBlockListWithOGP,
    },
    revalidate: 1 * 60
  }
}
