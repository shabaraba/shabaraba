// import SyntaxHighlighter from "react-syntax-highlighter";
import { CopyBlock, CodeBlock, dracula } from "react-code-blocks";
import { Box } from '@chakra-ui/react'
import { atomOneDark } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import type { Code as CodeEntity, } from '../../../entities/notion/blocks';

export function Code({entity}: {entity: CodeEntity}) {
  const text = entity.texts.reduce((prev, cur) => {
    if (prev === '') return cur.content
    return prev + '\n' + cur.content
  }, '')
  return (
    <Box
      mt={15}
      mb={15}
      fontSize='sm'
    >
      <CopyBlock
        text={text}
        language={entity.language}
        showLineNumbers={true}
        theme={dracula}
        codeBlock
        customStyle={{
          width: '100%',
          maxWidth: '70vw',
          overflow: 'auto'
        }}
      />
    </Box>
  )

      // <SyntaxHighlighter
      //   language={entity.language}
      //   style={atomOneDark}
      //   wrapLongLines={false}
      //   showLineNumbers={true}
      //   customStyle={{
      //     borderRadius: 5,
      //     filter: 'drop-shadow(3px 3px 10px rgba(0,0,0,0.2))',
      //     fontSize: '14px'
      //   }}
      // >
      //   {entity.texts.map(text => text.content)}
      // </SyntaxHighlighter>
}


