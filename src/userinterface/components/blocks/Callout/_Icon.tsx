import React from "react"
import { Text } from '@chakra-ui/react'
import { CalloutType } from "core/types/PostBlockType";

export type _Props = {
  entity: CalloutType
}

export const _IconComponent: React.FC<_Props> = ({entity}: _Props) => {
  return (
    <Text fontSize={36} color='yellow.500' fontWeight='bold' >
      {entity.icon}
    </Text>
  )
}

