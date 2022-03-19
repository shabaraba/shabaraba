import { Heading } from '@chakra-ui/react'
import {v4 as uuidv4} from 'uuid';
import type { Heading1 as Heading1Entity, } from '../../../entities/notion/blocks';

export function Heading1({entity}: {entity: Heading1Entity}) {
  return (
    <Heading
      as='h1'
      size='lg'
      mt={6}
      mb={6}
    >
      {entity.texts.map(text =>
        <span key={uuidv4()}>{text.content}</span>
      )}
    </Heading>
  )
}


