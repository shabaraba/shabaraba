// import SyntaxHighlighter from "react-syntax-highlighter";
import { CodeBlock, ocean } from "react-code-blocks";
import { Box } from '@chakra-ui/react'
import { CodeBlockType } from "core/types/PostBlockType";

type Props = {
  entity: CodeBlockType
}

export const CodeComponent: React.FC<Props> = ({entity}: Props) => {
  const text = entity.content.texts.reduce((prev, cur) => {
    return prev === '' ? cur.content : prev + cur.content
  }, '');

  const codeBlockStyle = {
    text: text, 
    language: entity.content.language, 
    showLineNumbers: true, 
    theme: ocean, 
    customStyle: { 
      borderRadius: 5, 
      width: '100%', 
      maxWidth: '90vw', 
      overflow: 'auto'
    }
  }

  return (
    <Box mt={15} mb={15} fontSize='sm' >
      <CodeBlock {...codeBlockStyle} />
    </Box>
  )
}
