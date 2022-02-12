import { Box, HStack, Text } from '@chakra-ui/react'
import type { Callout as CalloutEntity } from '../../../entities/notion/blocks';
import { Paragraph } from './Paragraph'

export function Callout({entity}: {entity: CalloutEntity}) {
  return (
    <HStack
      backgroundColor='gray.50'
    >
      <Box>
        <Text>{entity.icon}</Text>
      </Box>
        <Paragraph entity={entity} />
    </HStack>
  )
}

