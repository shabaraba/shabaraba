import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import type { Code as CodeEntity, } from '../../../entities/notion/blocks';

export function Code({entity}: {entity: CodeEntity}) {
  return (
    <SyntaxHighlighter language={entity.language} style={atomOneDark}>
      {entity.texts.map(text => text.content)}
    </SyntaxHighlighter>
  )
}


