import React from "react"
import { Box } from '@chakra-ui/react'
import type { Quote as QuoteEntity } from '../../../../../entities/notion/blocks';
import { Paragraph } from '../Paragraph'

type Props = { entity: QuoteEntity };
export const Quote: React.FC<Props> = ({ entity }: Props) => {
  const style = {
    backgroundColor: 'gray.50',
    borderLeftWidth: 10,
    borderColor: 'gray.200',
    color: 'gray.500',
    mt: 5,
    mb: 5,
    p: 5,
  };
  return (
    <Box {...style} >
      <Paragraph entity={entity} />
    </Box>
  )
}

