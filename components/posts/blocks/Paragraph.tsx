import { HStack, Text, Code } from '@chakra-ui/react'
import type { Paragraph as ParagraphEntity, } from '../../../entities/notion/blocks';

export function Paragraph({entity}: {entity: ParagraphEntity}) {
  if (entity.texts.length === 0) return <br />
  return (
    <>
      <HStack>
        {entity.texts.map(text => {
          let content = text.content ?? '';
          if (text.annotations.code) {
              return <Code>{content}</Code>
          }
          return <Text>{content}</Text>
        })}
      </HStack>
    </>
  )
}

