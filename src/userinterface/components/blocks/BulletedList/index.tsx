import React from "react"
import { ListItem, UnorderedList } from '@chakra-ui/react'
import { BulletedList as BulletedListEntity, BulletedListItem as BulletedListItemEntity } from "../../../../application/modules/post/objects/entities/blocks/BulletedList";
import { v4 as uuidv4 } from 'uuid';
import { ParagraphComponent } from "../Paragraph";
import Block from "../Block";
import { BulletedListBlockType, BulletedListItemBlockType } from "core/types/PostBlockType";

type Props = {
  entity: BulletedListBlockType
}

export const BulletedListComponent: React.FC<Props> = ({ entity }: Props) => {
  const unorderedTypeMap = ['disc', 'circle', 'square']

  return (
    <UnorderedList listStyleType={unorderedTypeMap[entity.nest % 3]}>
      {entity.listItem.map((item: BulletedListItemBlockType) =>
        <BulletedListItemComponent entity={item} key={uuidv4()} />
      )}
    </UnorderedList>
  )
}

type ItemProps = {
  entity: BulletedListItemBlockType
}

export const BulletedListItemComponent: React.FC<ItemProps> = ({entity}: ItemProps) => {
  return (
    <ListItem>
      <ParagraphComponent entity={entity}/>
      {entity.children?.map((child: any) => {
        return <Block entity={child} key={uuidv4()} />
      })}
    </ListItem>
  )
}

