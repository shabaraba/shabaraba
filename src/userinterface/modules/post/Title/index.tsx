import {FC} from 'react';
import { Box } from '@chakra-ui/react';
import { ShareButtonList } from 'userinterface/components/ShareButtonList';
import useLocation from 'userinterface/components/hooks/useLocation';
import { PublishDate } from 'userinterface/components/PublishDate';
import { TagList } from 'userinterface/patterns/TagList';
import Block from '../blocks/Block';

import * as NotionPageType from 'interfaces/NotionPageApiResponses';
import * as NotionBlock from 'entities/notion/blocks'

type Props = {tags: NotionPageType.IPageTag[], post: NotionPageType.IPageHead, titleBlock: NotionBlock.Heading1}

export const PostTitle: FC<Props> = ({tags, post, titleBlock}) => {
  const url = useLocation()

  return (
    <>
      <Block entity={titleBlock}/>
      <TagList tags={tags} />
      <Box fontSize='sm' textAlign={['right']}>
        <PublishDate publishedAt={post.publishedAt} updatedAt={post.updatedAt} />
        <ShareButtonList url={url.href} title={post.title} />
      </Box>
    </>
  )
}