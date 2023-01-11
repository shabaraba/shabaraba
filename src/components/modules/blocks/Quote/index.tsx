import React from "react"
import { Box } from '@chakra-ui/react'
import { ParagraphComponent } from '../Paragraph'
import { ParagraphBlockType, QuoteBlockType } from "core/types/PostBlockType";

type Props = { entity: QuoteBlockType };
export const QuoteComponent: React.FC<Props> = ({ entity }: Props) => {
  const paragraphBlock: ParagraphBlockType = {
    id: entity.id,
    nest: entity.nest,
    type: 'Paragraph',
    content: entity.content
  };
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
      <ParagraphComponent entity={paragraphBlock} />
    </Box>
  )
}

