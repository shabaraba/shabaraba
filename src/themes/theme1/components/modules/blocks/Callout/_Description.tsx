import { CalloutBlockType, ParagraphBlockType } from "core/types/PostBlockType";
import React from "react"
import { ParagraphComponent } from '../Paragraph'

export type _Props = {
  entity: CalloutBlockType
}

export const _DescriptionComponent: React.FC<_Props> = ({entity}: _Props) => {
  const paragraphBlock: ParagraphBlockType = {
    id: entity.id,
    nest: entity.nest,
    type: 'Paragraph',
    content: entity.content
  };
  return (
    <ParagraphComponent entity={paragraphBlock} />
  )
}

