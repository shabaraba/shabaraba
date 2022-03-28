import { Heading, Text } from '@chakra-ui/react'
import {v4 as uuidv4} from 'uuid';
import type { Heading2 as Heading2Entity, } from '../../../entities/notion/blocks';

export function Heading2({entity}: {entity: Heading2Entity}) {
  return (
    <Heading
      key={entity.id}
      as='h2'
      fontSize={{lg: '24px', base: '18px' }}
      mt={5}
      mb={5}
      pl={5}
      overflowWrap='anywhere'
      borderStyle='solid'
      borderLeftWidth='10px'
      borderColor='#CE6857'
    >
      {entity.texts.map(text =>
        <Text as='span' overflowWrap='anywhere' key={uuidv4()}>{text.content}</Text>
      )}
    </Heading>
  )
}


