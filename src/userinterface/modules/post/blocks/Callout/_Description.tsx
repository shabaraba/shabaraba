import React from "react"
import { Callout as CalloutEntity } from "../../../../../application/modules/post/objects/entities/blocks/Callout";
import { Paragraph } from '../Paragraph'

export type _Props = {
  entity: CalloutEntity
}

export const _DescriptionComponent: React.FC<_Props> = ({entity}: _Props) => {
  return (
    <Paragraph entity={entity} />
  )
}

