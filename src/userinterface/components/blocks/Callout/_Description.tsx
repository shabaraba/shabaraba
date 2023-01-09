import React from "react"
import { Callout as CalloutEntity } from "../../../../application/modules/post/objects/entities/blocks/Callout";
import { ParagraphComponent } from '../Paragraph'

export type _Props = {
  entity: CalloutEntity
}

export const _DescriptionComponent: React.FC<_Props> = ({entity}: _Props) => {
  return (
    <ParagraphComponent entity={entity} />
  )
}

