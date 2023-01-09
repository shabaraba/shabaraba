import React from "react"
import { Box } from '@chakra-ui/react'
import { Quote as QuoteEntity } from "../../../../application/modules/post/objects/entities/blocks/Quote";
import { ParagraphComponent } from '../Paragraph'

type Props = { entity: QuoteEntity };
export const QuoteComponent: React.FC<Props> = ({ entity }: Props) => {
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
      <ParagraphComponent entity={entity} />
    </Box>
  )
}

