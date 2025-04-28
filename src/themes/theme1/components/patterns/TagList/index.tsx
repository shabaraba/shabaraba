import { Wrap, WrapItem } from '@chakra-ui/react';
import React from 'react';
import { Tag } from '../../modules/tag';
import { v4 as uuidv4 } from 'uuid'
import { IPageTag } from 'core/types/NotionPageApiResponses';

type Props = { tags: IPageTag[] };

export const TagList: React.FC<Props> = ({ tags }) => {
  return (
    <Wrap>
      {tags.map((tag) => (
        <WrapItem key={uuidv4()}>
          <Tag entity={tag} />
        </WrapItem>
      ))}
    </Wrap>
  )
}