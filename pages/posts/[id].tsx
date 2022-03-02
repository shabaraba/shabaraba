import { Icon, Box, Grid, GridItem, Wrap, WrapItem } from '@chakra-ui/react'
import { useMediaQuery } from '@chakra-ui/react'
import * as ReactMdIcon from 'react-icons/md'
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

import BackButton from '../../components/common/BackButton'
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

const PostTitle = ({post, titleBlock}: {post: NotionPostHead, titleBlock: NotionBlock.Heading1}) => {
  const url = useLocation()
  console.log(url.href)

  return (
    <>
      <Block entity={titleBlock}/>
      <Wrap>
        {post.tags.map((tag) => (
          <WrapItem key={uuidv4()}>
            <Tag entity={tag} />
          </WrapItem>
        ))}
      </Wrap>
      <Box fontSize='sm' textAlign={['right']}>
        <Wrap justify='right'>
          <WrapItem>
            <Icon as={ReactMdIcon.MdCreate} />
            <Date dateString={post.createdAt}/>
          </WrapItem>
          <WrapItem>
            <Icon as={ReactMdIcon.MdArrowRightAlt} />
          </WrapItem>
          <WrapItem>
            <Icon as={ReactMdIcon.MdUpdate} />
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

const LeftSideArea = ({post, titleBlock, isSideColumn}: {post: NotionPostHead, titleBlock: NotionBlock.Heading1, isSideColumn: boolean}) => {

  return (
    <Box>
      {isSideColumn ? (
        <Sticky>
          <PostTitle post={post} titleBlock={titleBlock} />
        </Sticky>
        ) : (
          <PostTitle post={post} titleBlock={titleBlock} />
        )
      }
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
  const [isTwoColumns] = useMediaQuery('(min-width: 1024px)')
  console.log("isTwoColumns: " + isTwoColumns)
 
  const postBlockList = NotionBlock.BlockList.deserialize(postBlockJson.results)
  const titleBlock: NotionBlock.Heading1 = FrontendNotion.convertPageResponseToNotionHeading1Block(pageJson)
  const postHead: NotionPostHead = post

  const TwoColumnLayout = ({postHead, postBlockList, titleBlock}: {postHead: NotionPostHead, postBlockList: NotionBlock.BlockList, titleBlock: NotionBlock.Heading1}) => {
    return (
      <Grid
        templateColumns='repeat(12, 1fr)'
        gap={4}
        w='100%'
      >
        <GridItem
          colSpan={3}
        >
          <LeftSideArea post={postHead} titleBlock={titleBlock} isSideColumn={true}/>
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

  const OneColumnLayout = ({postHead, postBlockList, titleBlock}: {postHead: NotionPostHead, postBlockList: NotionBlock.BlockList, titleBlock: NotionBlock.Heading1}) => {
    return (
      <>
        <LeftSideArea post={postHead} titleBlock={titleBlock} isSideColumn={false}/>
        <MainArea post={postHead} postBlockList={postBlockList} titleBlock={titleBlock}/>
      </>
    )
  }

  return (
    <Layout>
      <Head>
        <title>{post.title}</title>
      </Head>
      {isTwoColumns ?
        <TwoColumnLayout postHead={postHead} postBlockList={postBlockList} titleBlock={titleBlock} />
        :
        <OneColumnLayout postHead={postHead} postBlockList={postBlockList} titleBlock={titleBlock} />
      }
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
  // console.log(JSON.stringify(post))
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
