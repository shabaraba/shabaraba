import { Container, Heading } from '@chakra-ui/react'
import PostListItem from './PostListItem'

import type {
  NotionPostHead,
} from '../../entities/notion_entities';

export default function PostList({data}: any){
  return (
   <Container maxW={'7xl'} p="12">
      {data.map((postHead: NotionPostHead) =>
        <PostListItem
          key={postHead.id}
          post = {postHead}
        />
      )}
    </Container>
  )
}

