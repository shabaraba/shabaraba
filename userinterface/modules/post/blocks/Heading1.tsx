import { Heading, Text } from '@chakra-ui/react'
import {v4 as uuidv4} from 'uuid';
import type { Heading1 as Heading1Entity, } from '../../../../entities/notion/blocks';

export function Heading1({entity}: {entity: Heading1Entity}) {
  return (
    <Heading
      as='h1'
      fontSize={{lg: '28px', md: '24px', base: '18px' }}
      mt={6}
      mb={6}
      overflowWrap='anywhere'
    >
      {entity.texts.map(text =>
        <Text as='span' overflowWrap='anywhere' key={uuidv4()}>{text.content}</Text>
      )}
    </Heading>
  )
}


