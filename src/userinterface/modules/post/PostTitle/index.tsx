import { FC } from 'react';
import * as NotionPageType from '../../../../interfaces/NotionPageApiResponses';
import * as NotionBlock from '../../../../entities/notion/blocks'
import Block from "../blocks/Block"
import useLocation from '../../../components/hooks/useLocation';
import { TagList } from '../../../patterns/TagList';
import { Box } from '@chakra-ui/react';
import { PublishDate } from '../../../components/PublishDate';
import { ShareButtonList } from '../../../components/ShareButtonList';
import { IHeading1Block } from 'interfaces/NotionApiResponses';
import { PostHeadService } from 'application/modules/post/services/PostHeadService';

const createHeading1Entity = (title: string): IHeading1Block => {
  return {
    object: 'block',
    id: '',
    created_time: '',
    last_edited_time: '',
    has_children: false,
    archived: false,
    type: "heading_1",
    heading_1: {
      text: [
        {
          plain_text: title,
          href: '',
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: "default"
          },
          type: "text",
          text: {
            content: title,
          }
        },
      ]
    }
  };
}

type Props = { tags: NotionPageType.IPageTag[], post: NotionPageType.IPageHead, title: string }

export const PostTitle: FC<Props> = ({ tags, post, title }) => {
  const url = useLocation()
  // TODO: IxxxBlockはNotion側の関心事なので、component用のentityに作り変えるdxoを作成する
  const heading1Entity: IHeading1Block = createHeading1Entity(title);
  const heading1Block: NotionBlock.Heading1 = new NotionBlock.Heading1(heading1Entity);

  return (
    <>
      <Block entity={heading1Block} />
      <TagList tags={tags} />
      <Box fontSize='sm' textAlign={['right']}>
        <PublishDate publishedAt={post.publishedAt} updatedAt={post.updatedAt} />
        <ShareButtonList url={url.href} title={post.title} />
      </Box>
    </>
  )
}
