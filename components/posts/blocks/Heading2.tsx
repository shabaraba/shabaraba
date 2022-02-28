import { Heading } from '@chakra-ui/react'
import {v4 as uuidv4} from 'uuid';
import type { Heading2 as Heading2Entity, } from '../../../entities/notion/blocks';

export function Heading2({entity}: {entity: Heading2Entity}) {
  return (
    <Heading
      key={entity.id}
      as='h2'
      size='lg'
      mt={5}
      mb={5}
      pl={5}
      borderStyle='solid'
      borderLeftWidth='10px'
      borderColor='blue.100'
    >
      {entity.texts.map(text =>
        <span key={uuidv4()}>{text.content}</span>
      )}
    </Heading>
  )
}


