import { useState, useEffect } from 'react'
import { Container, Heading } from '@chakra-ui/react'
import { getSortedPostsData } from '../../lib/posts'
import PostListItem from './PostListItem'

import type {
  NotionPostHead,
} from '../../entities/notion_entities';

export default function PostList(){
  const [postList, setPostList] = useState([]);
  useEffect(() => {
    const getPostData = async () => {
      const postList = await getSortedPostsData()
      console.log('postList')
      console.log(postList)
      setPostList(postList)
    }
    getPostData()
    }, [])

  const onClick = async () => {
    // return await test();
  }

  return (
   <Container maxW={'7xl'} p="12">
      <Heading as="h1">Stories by Chakra Templates</Heading>
      {postList.map((postHead: NotionPostHead) =>
        <PostListItem
          post = {postHead}
        />
      )}
    </Container>
  )
}

