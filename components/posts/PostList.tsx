import { Container, Heading } from '@chakra-ui/react'
import PostListItem from './PostListItem'

import type { IPageHead } from '../../interfaces/NotionPageApiResponses'

export default function PostList({data, breakPoint}: {data: IPageHead[], breakPoint: string}){
  return (
   <Container maxW={'5xl'} p="2">
      {data.map((postHead: IPageHead) =>
        <PostListItem
          key={postHead.id}
          postHead = {postHead}
          breakPoint = {breakPoint}
        />
      )}
    </Container>
  )
}

