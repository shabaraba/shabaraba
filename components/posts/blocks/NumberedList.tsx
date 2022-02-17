import React from "react"
import { Center, OrderedList, ListItem, Text } from '@chakra-ui/react'
import Block from '../Block';
import type { NumberedList as NumberedListEntity, NumberedListItem as NumberedListItemEntity  } from '../../../entities/notion/blocks';
import { Paragraph } from './Paragraph'

export function NumberedList({entity}: {entity: NumberedListEntity}) {
  return (
    <OrderedList>
      {entity.listItem.map((item: NumberedListItemEntity) => 
        <NumberedListItem entity = {item} />
      )}
    </OrderedList>
  )
}

export function NumberedListItem({entity}: {entity: NumberedListItemEntity}) {
  return (
    <ListItem>
      <Paragraph entity={entity}/>
      {entity.children?.map((child: any) => {
        return <Block entity={child}/>
      })}
    </ListItem>
  )
}


