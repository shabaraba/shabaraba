import React from "react";
import { ListItem, OrderedList } from '@chakra-ui/react';
import { v4 as uuidv4 } from 'uuid';
import BlockComponent from "../Block";
import { ParagraphComponent } from "../Paragraph";
import { NumberedListBlockType, NumberedListItemBlockType, ParagraphBlockType } from "core/types/PostBlockType";

type Props = { entity: NumberedListBlockType };

export const NumberedListComponent: React.FC<Props> = ({ entity }: Props) => {
  const orderedTypeMap = ['decimal', 'lower-alpha', 'lower-roman'];

  return (
    <OrderedList listStyleType={orderedTypeMap[entity.nest % 3]}>
      {entity.content.listItem.map((item: NumberedListItemBlockType) =>
        <NumberedListItemComponent entity={item} key={uuidv4()} />
      )}
    </OrderedList>
  );
}

type ItemProps = { entity: NumberedListItemBlockType };

export const NumberedListItemComponent: React.FC<ItemProps> = ({ entity }: ItemProps) => {
  const paragraphBlock: ParagraphBlockType = {
    id: entity.id,
    nest: entity.nest,
    type: 'Paragraph',
    content: entity.content
  };
  return (
    <ListItem>
      <ParagraphComponent entity={paragraphBlock} />
      {entity.content.children?.map((child: any) => {
        return <BlockComponent entity={child} key={uuidv4()} />
      })}
    </ListItem>
  )
}


