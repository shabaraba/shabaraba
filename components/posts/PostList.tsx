import { Container, Heading } from '@chakra-ui/react'
import PostListItem from './PostListItem'

import type {
  NotionPostHead,
} from '../../entities/notion_entities';

export default function PostList({data}: any){
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

