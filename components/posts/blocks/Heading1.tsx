import { Heading } from '@chakra-ui/react'
import type { Heading1 as Heading2Entity, } from '../../../entities/notion/blocks';

export function Heading1({entity}: {entity: Heading2Entity}) {
  return (
    <Heading as='h1' size = '2xl'>
      {entity.texts.map(text =>
        <span>{text.content}</span>
      )}
    </Heading>
  )
}


