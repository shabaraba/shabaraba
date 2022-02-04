import { Heading } from '@chakra-ui/react'
import type { Heading3 as Heading3Entity, } from '../../../entities/notion/blocks';

export function Heading3({entity}: {entity: Heading3Entity}) {
  return (
    <Heading as='h3' size = 'md'>
      {entity.texts.map(text =>
        <span>{text.content}</span>
      )}
    </Heading>
  )
}


