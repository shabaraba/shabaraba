import React from "react"
import { ListItem, UnorderedList } from '@chakra-ui/react'
import type { BulletedList as BulletedListEntity, BulletedListItem as BulletedListItemEntity } from '../../../../../entities/notion/blocks';
import { v4 as uuidv4 } from 'uuid';
import { Paragraph } from "../Paragraph";
import Block from "../../../../components/posts/Block";

type Props = {
  entity: BulletedListEntity
}

export const BulletedList: React.FC<Props> = ({ entity }: Props) => {
  const unorderedTypeMap = ['disc', 'circle', 'square']

  return (
    <UnorderedList listStyleType={unorderedTypeMap[entity.nest % 3]}>
      {entity.listItem.map((item: BulletedListItemEntity) =>
        <BulletedListItem entity={item} key={uuidv4()} />
      )}
    </UnorderedList>
  )
}

type ItemProps = {
  entity: BulletedListItemEntity
}

export const BulletedListItem: React.FC<ItemProps> = ({entity}: ItemProps) => {
  return (
    <ListItem>
      <Paragraph entity={entity}/>
      {entity.children?.map((child: any) => {
        return <Block entity={child} key={uuidv4()} />
      })}
    </ListItem>
  )
}

