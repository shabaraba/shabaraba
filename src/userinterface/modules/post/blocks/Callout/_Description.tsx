import React from "react"
import type { Callout as CalloutEntity } from '../../../../../entities/notion/blocks';
import { Paragraph } from '../Paragraph'

export type _Props = {
  entity: CalloutEntity
}

export const _DescriptionComponent: React.FC<_Props> = ({entity}: _Props) => {
  return (
    <Paragraph entity={entity} />
  )
}

