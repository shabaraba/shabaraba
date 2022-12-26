import React from "react"
import { Box } from '@chakra-ui/react'
import type { Quote as QuoteEntity } from '../../../../entities/notion/blocks';
import { Paragraph } from './Paragraph'

interface CalloutMap{
  icon: string,
  name: string,
  color: string
}

export function Quote({entity}: {entity: QuoteEntity}) {


  return (
    <Box
      backgroundColor='gray.50'
      borderLeftWidth={10}
      borderColor='gray.200'
      color='gray.500'
      mt={5}
      mb={5}
      p={5}
    >
      <Paragraph entity={entity} />
    </Box>
  )
}

