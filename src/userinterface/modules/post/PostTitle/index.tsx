import {FC} from 'react';
import * as NotionPageType from '../../../../interfaces/NotionPageApiResponses';
import * as NotionBlock from '../../../../entities/notion/blocks'
import Block from "../blocks/Block"
import useLocation from '../../../components/hooks/useLocation';
import { TagList } from '../../../patterns/TagList';
import { Box } from '@chakra-ui/react';
import { PublishDate } from '../../../components/PublishDate';
import { ShareButtonList } from '../../../components/ShareButtonList';

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