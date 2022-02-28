import React from "react"
import { OrderedList, ListItem } from '@chakra-ui/react'
import Block from '../Block';
import type { NumberedList as NumberedListEntity, NumberedListItem as NumberedListItemEntity  } from '../../../entities/notion/blocks';
import { Paragraph } from './Paragraph'
import {v4 as uuidv4} from 'uuid';

export function NumberedList({entity}: {entity: NumberedListEntity }) {
  const orderedTypeMap = ['decimal', 'lower-alpha', 'lower-roman']

  return (
    <OrderedList listStyleType={orderedTypeMap[entity.nest % 3]}>
      {entity.listItem.map((item: NumberedListItemEntity) => 
        <NumberedListItem entity={item} key={uuidv4()}/>
      )}
    </OrderedList>
  )
}

export function NumberedListItem({entity}: {entity: NumberedListItemEntity}) {
  return (
    <ListItem>
      <Paragraph entity={entity}/>
      {entity.children?.map((child: any) => {
        return <Block entity={child} key={uuidv4()} />
      })}
    </ListItem>
  )
}


