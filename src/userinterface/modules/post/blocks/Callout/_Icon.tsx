import React from "react"
import { Text } from '@chakra-ui/react'
import { Callout as CalloutEntity } from "../../../../../application/modules/post/objects/entities/blocks/Callout";

export type _Props = {
  entity: CalloutEntity
}

export const _IconComponent: React.FC<_Props> = ({entity}: _Props) => {
  return (
    <Text fontSize={36} color='yellow.500' fontWeight='bold' >
      {entity.icon}
    </Text>
  )
}

