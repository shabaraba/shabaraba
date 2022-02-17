import React from "react"
import { Center, UnorderedList, ListItem, Text } from '@chakra-ui/react'
import Block from '../Block';
import type { BulletedList as BulletedListEntity, BulletedListItem as BulletedListItemEntity  } from '../../../entities/notion/blocks';
import { Paragraph } from './Paragraph'

export function BulletedList({entity}: {entity: BulletedListEntity}) {
  return (
    <UnorderedList>
      {entity.listItem.map((item: BulletedListItemEntity) => 
        <BulletedListItem entity = {item} />
      )}
    </UnorderedList>
  )
}

export function BulletedListItem({entity}: {entity: BulletedListItemEntity}) {
  return (
    <ListItem>
      <Paragraph entity={entity}/>
      {entity.children?.map((child: any) => {
        return <Block entity={child}/>
      })}
    </ListItem>
  )
}

