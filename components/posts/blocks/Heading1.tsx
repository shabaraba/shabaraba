import { Heading } from '@chakra-ui/react'
import type { Heading1 as Heading1Entity, } from '../../../entities/notion/blocks';

export function Heading1({entity}: {entity: Heading1Entity}) {
  return (
    <Heading as='h1' size = '2xl' m={6}>
      {entity.texts.map(text =>
        <span>{text.content}</span>
      )}
    </Heading>
  )
}


