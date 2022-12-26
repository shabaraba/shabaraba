import { Box, Heading } from '@chakra-ui/react'
import PostListItem from './PostListItem'

import type { IPageHead } from '../../../interfaces/NotionPageApiResponses'

export default function PostList({data, breakPoint}: {data: IPageHead[], breakPoint: string}){
  return (
   <Box p="2" w='100%'>
      {data.map((postHead: IPageHead) =>
        <PostListItem
          key={postHead.id}
          postHead = {postHead}
          breakPoint = {breakPoint}
        />
      )}
    </Box>
  )
}

