import React from "react";
import { ListItem, OrderedList } from '@chakra-ui/react';
import { NumberedList as NumberedListEntity, NumberedListItem as NumberedListItemEntity } from "../../../../application/modules/post/objects/entities/blocks/NumberedList";
import { v4 as uuidv4 } from 'uuid';
import Block from "../Block";
import { ParagraphComponent } from "../Paragraph";

type Props = { entity: NumberedListEntity };

export const NumberedListComponent: React.FC<Props> = ({ entity }: Props) => {
  const orderedTypeMap = ['decimal', 'lower-alpha', 'lower-roman'];

  return (
    <OrderedList listStyleType={orderedTypeMap[entity.nest % 3]}>
      {entity.listItem.map((item: NumberedListItemEntity) =>
        <NumberedListItemComponent entity={item} key={uuidv4()} />
      )}
    </OrderedList>
  );
}

type ItemProps = { entity: NumberedListItemEntity };

export const NumberedListItemComponent: React.FC<ItemProps> = ({ entity }: ItemProps) => {
  return (
    <ListItem>
      <ParagraphComponent entity={entity} />
      {entity.children?.map((child: any) => {
        return <Block entity={child} key={uuidv4()} />
      })}
    </ListItem>
  )
}


