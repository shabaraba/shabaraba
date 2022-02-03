import { useState, useEffect } from 'react'
import useSWR from 'swr'
import { Container, Heading } from '@chakra-ui/react'
import { getSortedPostsData } from '../../lib/posts'
import PostListItem from './PostListItem'

import type {
  NotionPostHead,
} from '../../entities/notion_entities';

export default function PostList(){
  // useSWRはキャッシュもしてくれる
	const { data, error } = useSWR('/api/user', getSortedPostsData)

	if (error)return <div>failed to load</div>
	if (!data)return <div>loading...</div>

  return (
   <Container maxW={'7xl'} p="12">
      <Heading as="h1">Stories by Chakra Templates</Heading>
      {data.map((postHead: NotionPostHead) =>
        <PostListItem
          key={postHead.id}
          post = {postHead}
        />
      )}
    </Container>
  )
}

