import React from "react"
import { ListItem, UnorderedList } from '@chakra-ui/react'
import { v4 as uuidv4 } from 'uuid';
import { ParagraphComponent } from "../Paragraph";
import BlockComponent from "../Block";
import { BulletedListBlockType, BulletedListItemBlockType, ParagraphBlockType } from "core/types/PostBlockType";

type Props = {
  entity: BulletedListBlockType
}

export const BulletedListComponent: React.FC<Props> = ({ entity }: Props) => {
  const unorderedTypeMap = ['disc', 'circle', 'square']

  console.log(entity);
  return (
    <UnorderedList listStyleType={unorderedTypeMap[entity.nest % 3]}>
      {entity.content.listItem.map((item: BulletedListItemBlockType) =>
        <BulletedListItemComponent entity={item} key={uuidv4()} />
      )}
    </UnorderedList>
  )
}

type ItemProps = {
  entity: BulletedListItemBlockType
}

export const BulletedListItemComponent: React.FC<ItemProps> = ({entity}: ItemProps) => {
  console.log(entity)
  const paragraphBlock: ParagraphBlockType = {
    id: entity.id,
    nest: entity.nest,
    type: 'Paragraph',
    content: entity.content
  };
  return (
    <ListItem>
      <ParagraphComponent entity={paragraphBlock}/>
      {paragraphBlock.content.children?.map((child: any) => {
        return <BlockComponent entity={child} key={uuidv4()} />
      })}
    </ListItem>
  )
}

