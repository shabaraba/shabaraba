import { FC } from 'react';
import { Box } from '@chakra-ui/react'
import { PostHead } from '../../modules/post/PostHead'
import { PostHeadEntity } from 'core/entities/PostHeadEntity';

type Props = { data: PostHeadEntity[] };

export const PostHeadList: FC<Props> = ({ data }) => {
  return (
    <Box p="2" w='100%'>
      {data.map((postHead: PostHeadEntity) =>
        <PostHead key={postHead.id} postHead={postHead} />
      )}
    </Box>
  )
}

