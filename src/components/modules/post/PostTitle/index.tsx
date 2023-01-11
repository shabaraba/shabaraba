import { Box } from '@chakra-ui/react';
import { PostHeadEntity } from 'core/entities/PostHeadEntity';
import { IPageTag } from 'core/types/NotionPageApiResponses';
import { Heading1BlockType } from 'core/types/PostBlockType';
import { FC } from 'react';
import BlockComponent from 'components/modules/blocks/Block';
import useLocation from 'components/units/hooks/useLocation';
import { PublishDate } from 'components/units/PublishDate';
import { ShareButtonList } from 'components/units/ShareButtonList';
import { TagList } from 'components/patterns/TagList';

const createHeading1Entity = (title: string): Heading1BlockType => {
  return {
    id: '',
    type: "Heading1",
    nest: 0,
    content: {
      texts: [
        {
          href: '',
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: "default"
          },
          content: title,
        },
      ]
    }
  };
}

type Props = { tags: IPageTag[], post: PostHeadEntity, title: string }

export const PostTitle: FC<Props> = ({ tags, post, title }) => {
  const url = useLocation()
  const heading1Entity: Heading1BlockType = createHeading1Entity(title);

  return (
    <>
      <BlockComponent entity={heading1Entity} />
      <TagList tags={tags} />
      <Box fontSize='sm' textAlign={['right']}>
        <PublishDate publishedAt={post.publishedAt} updatedAt={post.updatedAt} />
        <ShareButtonList url={url.href} title={post.title} />
      </Box>
    </>
  )
}
