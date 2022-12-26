import { Heading, Text } from '@chakra-ui/react'
import {v4 as uuidv4} from 'uuid';
import type { Heading3 as Heading3Entity, } from '../../../../entities/notion/blocks';

export function Heading3({entity}: {entity: Heading3Entity}) {
  return (
    <Heading
      key={entity.id}
      as='h3'
      size = 'md'
      mt={5}
      mb={5}
      overflowWrap='anywhere'
    >
      {entity.texts.map(text =>
        <Text as='span' overflowWrap='anywhere' key={uuidv4()}>{text.content}</Text>
      )}
    </Heading>
  )
}


