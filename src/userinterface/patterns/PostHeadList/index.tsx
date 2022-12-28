import { FC } from 'react';
import { Box } from '@chakra-ui/react'
import { PostHead } from '../../modules/post/PostHead'

import type { IPageHead } from '../../../interfaces/NotionPageApiResponses'

type Props = { data: IPageHead[] };

export const PostHeadList: FC<Props> = ({ data }) => {
  return (
    <Box p="2" w='100%'>
      {data.map((postHead: IPageHead) =>
        <PostHead key={postHead.id} postHead={postHead} />
      )}
    </Box>
  )
}

