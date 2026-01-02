import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Code,
  UnorderedList,
  OrderedList,
  ListItem,
  Link,
  Image,
  Divider,
  Flex,
  Button,
  Collapse,
  useColorModeValue,
} from '@chakra-ui/react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  vscDarkPlus,
  vs,
} from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { ChevronRightIcon } from '@chakra-ui/icons';

interface MarkdownRendererProps {
  /**
   * Markdown文字列
   */
  content: string;
}

/**
 * Markdownコンテンツをレンダリングするコンポーネント
 *
 * 現在は基本的なMarkdownのみサポート。
 * 今後、カスタムディレクティブ（Callout, Toggle等）のサポートを追加予定。
 */
export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
}) => {
  // 暫定実装: Markdown文字列をHTMLに変換してレンダリング
  // TODO: remark/rehypeを使った本格的な実装に置き換え

  return (
    <Box className="markdown-content">
      <SimpleMarkdownRenderer content={content} />
    </Box>
  );
};

/**
 * シンプルなMarkdownレンダラー（暫定実装）
 * TODO: カスタムディレクティブ対応版に置き換え
 */
const SimpleMarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.split('\n');
  const elements: JSX.Element[] = [];
  let i = 0;

  const codeHighlightTheme = useColorModeValue(vs, vscDarkPlus);

  while (i < lines.length) {
    const line = lines[i];

    // コードブロック
    if (line.startsWith('```')) {
      const lang = line.slice(3).split(':')[0].trim() || 'plaintext';
      const codeLines: string[] = [];
      i++;

      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }

      elements.push(
        <Box key={elements.length} mb={4}>
          <SyntaxHighlighter
            language={lang}
            style={codeHighlightTheme}
            customStyle={{
              borderRadius: '8px',
              padding: '16px',
            }}
          >
            {codeLines.join('\n')}
          </SyntaxHighlighter>
        </Box>
      );
      i++;
      continue;
    }

    // 見出し
    if (line.startsWith('# ')) {
      elements.push(
        <Heading key={elements.length} as="h1" size="2xl" mt={8} mb={4}>
          {line.slice(2)}
        </Heading>
      );
      i++;
      continue;
    }

    if (line.startsWith('## ')) {
      elements.push(
        <Heading key={elements.length} as="h2" size="xl" mt={6} mb={3}>
          {line.slice(3)}
        </Heading>
      );
      i++;
      continue;
    }

    if (line.startsWith('### ')) {
      elements.push(
        <Heading key={elements.length} as="h3" size="lg" mt={4} mb={2}>
          {line.slice(4)}
        </Heading>
      );
      i++;
      continue;
    }

    // 引用
    if (line.startsWith('> ')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith('> ')) {
        quoteLines.push(lines[i].slice(2));
        i++;
      }

      elements.push(
        <Box
          key={elements.length}
          borderLeft="4px solid"
          borderColor="gray.300"
          pl={4}
          py={2}
          my={4}
          fontStyle="italic"
        >
          {quoteLines.map((line, idx) => (
            <Text key={idx}>{line}</Text>
          ))}
        </Box>
      );
      continue;
    }

    // リスト
    if (line.match(/^[\*\-] /)) {
      const listItems: string[] = [];
      while (i < lines.length && lines[i].match(/^[\*\-] /)) {
        listItems.push(lines[i].slice(2));
        i++;
      }

      elements.push(
        <UnorderedList key={elements.length} mb={4} pl={4}>
          {listItems.map((item, idx) => (
            <ListItem key={idx}>{item}</ListItem>
          ))}
        </UnorderedList>
      );
      continue;
    }

    if (line.match(/^\d+\. /)) {
      const listItems: string[] = [];
      while (i < lines.length && lines[i].match(/^\d+\. /)) {
        listItems.push(lines[i].replace(/^\d+\. /, ''));
        i++;
      }

      elements.push(
        <OrderedList key={elements.length} mb={4} pl={4}>
          {listItems.map((item, idx) => (
            <ListItem key={idx}>{item}</ListItem>
          ))}
        </OrderedList>
      );
      continue;
    }

    // 水平線
    if (line.match(/^(---|\*\*\*|___)$/)) {
      elements.push(<Divider key={elements.length} my={6} />);
      i++;
      continue;
    }

    // カスタムディレクティブ: Callout
    if (line.startsWith(':::callout')) {
      const match = line.match(/type="(\w+)".*icon="([^"]+)"/);
      const type = match?.[1] || 'info';
      const icon = match?.[2] || '💡';

      const contentLines: string[] = [];
      i++;

      while (i < lines.length && !lines[i].startsWith(':::')) {
        contentLines.push(lines[i]);
        i++;
      }

      elements.push(
        <CalloutComponent
          key={elements.length}
          type={type as 'info' | 'warning' | 'error' | 'success'}
          icon={icon}
          content={contentLines.join('\n')}
        />
      );
      i++;
      continue;
    }

    // カスタムディレクティブ: Toggle
    if (line.startsWith(':::toggle')) {
      const match = line.match(/summary="([^"]+)"/);
      const summary = match?.[1] || '詳細を表示';

      const contentLines: string[] = [];
      i++;

      while (i < lines.length && !lines[i].startsWith(':::')) {
        contentLines.push(lines[i]);
        i++;
      }

      elements.push(
        <ToggleComponent
          key={elements.length}
          summary={summary}
          content={contentLines.join('\n')}
        />
      );
      i++;
      continue;
    }

    // 空行
    if (line.trim() === '') {
      i++;
      continue;
    }

    // 通常の段落
    elements.push(
      <Text key={elements.length} mb={4} lineHeight="1.8">
        {parseInlineMarkdown(line)}
      </Text>
    );
    i++;
  }

  return <>{elements}</>;
};

/**
 * インラインMarkdown（太字、イタリック、コード、リンク等）をパース
 */
function parseInlineMarkdown(text: string): React.ReactNode {
  // 簡易実装: 太字、コード、リンクのみ対応
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  // コードブロック: `code`
  const codeRegex = /`([^`]+)`/g;
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const boldRegex = /\*\*([^*]+)\*\*/g;

  // 一旦そのまま返す（TODO: 正規表現で置換）
  return text;
}

/**
 * Calloutコンポーネント
 */
const CalloutComponent: React.FC<{
  type: 'info' | 'warning' | 'error' | 'success';
  icon: string;
  content: string;
}> = ({ type, icon, content }) => {
  const bgColor = useColorModeValue(
    {
      info: 'blue.50',
      warning: 'yellow.50',
      error: 'red.50',
      success: 'green.50',
    }[type],
    {
      info: 'blue.900',
      warning: 'yellow.900',
      error: 'red.900',
      success: 'green.900',
    }[type]
  );

  const borderColor = {
    info: 'blue.500',
    warning: 'yellow.500',
    error: 'red.500',
    success: 'green.500',
  }[type];

  return (
    <Box
      bg={bgColor}
      borderLeft="4px solid"
      borderColor={borderColor}
      p={4}
      mb={4}
      borderRadius="md"
    >
      <Flex align="start">
        <Text fontSize="2xl" mr={2}>
          {icon}
        </Text>
        <Box flex="1">
          <SimpleMarkdownRenderer content={content} />
        </Box>
      </Flex>
    </Box>
  );
};

/**
 * Toggleコンポーネント
 */
const ToggleComponent: React.FC<{
  summary: string;
  content: string;
}> = ({ summary, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box mb={4}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="ghost"
        leftIcon={
          <ChevronRightIcon
            transform={isOpen ? 'rotate(90deg)' : 'none'}
            transition="transform 0.2s"
          />
        }
        fontWeight="normal"
      >
        {summary}
      </Button>
      <Collapse in={isOpen}>
        <Box pl={6} pt={2}>
          <SimpleMarkdownRenderer content={content} />
        </Box>
      </Collapse>
    </Box>
  );
};

export default MarkdownRenderer;
