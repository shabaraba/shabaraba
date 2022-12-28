import React from "react";
import { ListItem, OrderedList } from '@chakra-ui/react';
import type { NumberedList as NumberedListEntity, NumberedListItem as NumberedListItemEntity } from '../../../../../entities/notion/blocks';
import { v4 as uuidv4 } from 'uuid';
import Block from "../Block";
import { Paragraph } from "../Paragraph";

type Props = { entity: NumberedListEntity };

export const NumberedList: React.FC<Props> = ({ entity }: Props) => {
  const orderedTypeMap = ['decimal', 'lower-alpha', 'lower-roman'];

  return (
    <OrderedList listStyleType={orderedTypeMap[entity.nest % 3]}>
      {entity.listItem.map((item: NumberedListItemEntity) =>
        <NumberedListItem entity={item} key={uuidv4()} />
      )}
    </OrderedList>
  );
}

type ItemProps = { entity: NumberedListItemEntity };

export const NumberedListItem: React.FC<ItemProps> = ({ entity }: ItemProps) => {
  return (
    <ListItem>
      <Paragraph entity={entity} />
      {entity.children?.map((child: any) => {
        return <Block entity={child} key={uuidv4()} />
      })}
    </ListItem>
  )
}


