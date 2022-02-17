import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import type { Code as CodeEntity, } from '../../../entities/notion/blocks';

export function Code({entity}: {entity: CodeEntity}) {
  return (
    <SyntaxHighlighter
      language={entity.language}
      style={atomOneDark}
      wrapLongLines={true}
      showLineNumbers={true}
      customStyle={{
        borderRadius: 10,
        filter: 'drop-shadow(10px 10px 10px rgba(0,0,0,0.4))',
      }}
    >
      {entity.texts.map(text => text.content)}
    </SyntaxHighlighter>
  )
}


