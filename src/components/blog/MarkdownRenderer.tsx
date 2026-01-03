import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  UnorderedList,
  OrderedList,
  ListItem,
  Link,
  Divider,
} from '@chakra-ui/react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import styles from './NotionBlockRenderer.module.css';
import { getFaviconUrl } from '../../lib/ogp-utils';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
}) => {
  return (
    <Box className={styles.notionContent}>
      <SimpleMarkdownRenderer content={content} />
    </Box>
  );
};

const SimpleMarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.split('\n');
  const elements: JSX.Element[] = [];
  let i = 0;

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
        <div key={elements.length} className={styles.codeBlock}>
          <SyntaxHighlighter
            language={lang}
            style={tomorrow}
            className={styles.syntaxHighlighter}
          >
            {codeLines.join('\n')}
          </SyntaxHighlighter>
        </div>
      );
      i++;
      continue;
    }

    // 見出し
    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={elements.length} className={styles.heading1}>
          {line.slice(2)}
        </h1>
      );
      i++;
      continue;
    }

    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={elements.length} className={styles.heading2}>
          {line.slice(3)}
        </h2>
      );
      i++;
      continue;
    }

    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={elements.length} className={styles.heading3}>
          {line.slice(4)}
        </h3>
      );
      i++;
      continue;
    }

    if (line.startsWith('#### ')) {
      elements.push(
        <Heading key={elements.length} as="h4" size="md" mt={4} mb={2}>
          {line.slice(5)}
        </Heading>
      );
      i++;
      continue;
    }

    if (line.startsWith('##### ')) {
      elements.push(
        <Heading key={elements.length} as="h5" size="sm" mt={3} mb={1}>
          {line.slice(6)}
        </Heading>
      );
      i++;
      continue;
    }

    if (line.startsWith('###### ')) {
      elements.push(
        <Heading key={elements.length} as="h6" size="xs" mt={3} mb={1}>
          {line.slice(7)}
        </Heading>
      );
      i++;
      continue;
    }

    // 引用（空行の引用 `>` のみ、ネスト `>>` にも対応）
    if (line.startsWith('>')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith('>')) {
        const currentLine = lines[i];
        if (currentLine === '>') {
          quoteLines.push('');
        } else if (currentLine.startsWith('> ')) {
          quoteLines.push(currentLine.slice(2));
        } else {
          quoteLines.push(currentLine.slice(1));
        }
        i++;
      }

      elements.push(
        <QuoteBlock key={elements.length} lines={quoteLines} />
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
        <ul key={elements.length} className={styles.bulletedList}>
          {listItems.map((item, idx) => (
            <li key={idx}>{parseInlineMarkdown(item)}</li>
          ))}
        </ul>
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
        <ol key={elements.length} className={styles.numberedList}>
          {listItems.map((item, idx) => (
            <li key={idx}>{parseInlineMarkdown(item)}</li>
          ))}
        </ol>
      );
      continue;
    }

    // 水平線
    if (line.match(/^(---|\*\*\*|___)$/)) {
      elements.push(<hr key={elements.length} className={styles.divider} />);
      i++;
      continue;
    }

    // テーブル
    if (line.startsWith('|') && line.endsWith('|')) {
      const tableRows: string[][] = [];
      let hasHeader = false;

      while (i < lines.length && lines[i].startsWith('|') && lines[i].endsWith('|')) {
        const rowContent = lines[i].slice(1, -1);
        const cells = rowContent.split('|').map(cell => cell.trim());

        if (cells.every(cell => /^[-:]+$/.test(cell))) {
          hasHeader = true;
          i++;
          continue;
        }

        tableRows.push(cells);
        i++;
      }

      if (tableRows.length > 0) {
        const headerRow = hasHeader ? tableRows[0] : null;
        const bodyRows = hasHeader ? tableRows.slice(1) : tableRows;

        elements.push(
          <Box key={elements.length} overflowX="auto" mb={4}>
            <Box
              as="table"
              width="100%"
              borderWidth="1px"
              borderColor="gray.200"
              borderRadius="md"
              sx={{
                borderCollapse: 'collapse',
                '& th, & td': {
                  borderWidth: '1px',
                  borderColor: 'gray.200',
                  padding: '8px 12px',
                  textAlign: 'left',
                },
                '& th': {
                  backgroundColor: 'gray.50',
                  fontWeight: 'bold',
                },
              }}
            >
              {headerRow && (
                <Box as="thead">
                  <Box as="tr">
                    {headerRow.map((cell, cellIdx) => (
                      <Box as="th" key={cellIdx}>
                        {parseInlineMarkdown(cell)}
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
              <Box as="tbody">
                {bodyRows.map((row, rowIdx) => (
                  <Box as="tr" key={rowIdx}>
                    {row.map((cell, cellIdx) => (
                      <Box as="td" key={cellIdx}>
                        {parseInlineMarkdown(cell)}
                      </Box>
                    ))}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        );
      }
      continue;
    }

    // カスタムディレクティブ: Callout
    if (line.startsWith(':::callout')) {
      const match = line.match(/type="(\w+)".*icon="([^"]+)"/);
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

    // カスタムディレクティブ: Bookmark（OGPカード）
    if (line.startsWith(':::bookmark')) {
      const urlMatch = line.match(/url="([^"]+)"/);
      const titleMatch = line.match(/title="([^"]+)"/);
      const descMatch = line.match(/description="([^"]+)"/);
      const imageMatch = line.match(/image="([^"]+)"/);
      const siteMatch = line.match(/site="([^"]+)"/);

      const url = urlMatch?.[1] || '';

      i++;
      while (i < lines.length && !lines[i].startsWith(':::')) {
        i++;
      }
      i++;

      if (url) {
        elements.push(
          <BookmarkCard
            key={elements.length}
            url={url}
            ogpData={{
              url,
              title: titleMatch?.[1],
              description: descMatch?.[1],
              image: imageMatch?.[1],
              siteName: siteMatch?.[1],
            }}
          />
        );
      }
      continue;
    }

    // 空行
    if (line.trim() === '') {
      i++;
      continue;
    }

    // 通常の段落（divを使用してネスト時のhydrationエラーを回避）
    elements.push(
      <div key={elements.length} className={styles.paragraph}>
        {parseInlineMarkdown(line)}
      </div>
    );
    i++;
  }

  return <>{elements}</>;
};

function parseInlineMarkdown(text: string): React.ReactNode {
  const tokens: Array<{ type: string; content: string; href?: string }> = [];
  let remaining = text;

  const patterns = [
    { type: 'code', regex: /`([^`]+)`/ },
    { type: 'boldItalic', regex: /\*\*\*([^*]+)\*\*\*/ },
    { type: 'bold', regex: /\*\*([^*]+)\*\*/ },
    { type: 'italic', regex: /\*([^*]+)\*/ },
    { type: 'link', regex: /\[([^\]]+)\]\(([^)]+)\)/ },
  ];

  while (remaining.length > 0) {
    let earliestMatch: { index: number; match: RegExpMatchArray; type: string } | null = null;

    for (const pattern of patterns) {
      const match = remaining.match(pattern.regex);
      if (match && match.index !== undefined) {
        if (!earliestMatch || match.index < earliestMatch.index) {
          earliestMatch = { index: match.index, match, type: pattern.type };
        }
      }
    }

    if (!earliestMatch) {
      tokens.push({ type: 'text', content: remaining });
      break;
    }

    if (earliestMatch.index > 0) {
      tokens.push({ type: 'text', content: remaining.slice(0, earliestMatch.index) });
    }

    const { match, type } = earliestMatch;
    if (type === 'link') {
      tokens.push({ type: 'link', content: match[1], href: match[2] });
    } else {
      tokens.push({ type, content: match[1] });
    }

    remaining = remaining.slice(earliestMatch.index + match[0].length);
  }

  return tokens.map((token, idx) => {
    switch (token.type) {
      case 'code':
        return (
          <code key={idx} className={styles.inlineCode}>
            {token.content}
          </code>
        );
      case 'bold':
        return <strong key={idx} className={styles.bold}>{token.content}</strong>;
      case 'italic':
        return <em key={idx} className={styles.italic}>{token.content}</em>;
      case 'boldItalic':
        return <strong key={idx} className={styles.bold}><em className={styles.italic}>{token.content}</em></strong>;
      case 'link':
        return (
          <a key={idx} href={token.href} className={styles.link} target="_blank" rel="noopener noreferrer">
            {token.content}
          </a>
        );
      default:
        return <React.Fragment key={idx}>{token.content}</React.Fragment>;
    }
  });
}

const CalloutComponent: React.FC<{
  icon: string;
  content: string;
}> = ({ icon, content }) => {
  return (
    <div className={styles.callout}>
      <span className={styles.calloutIcon}>{icon}</span>
      <div className={styles.calloutContent}>
        <SimpleMarkdownRenderer content={content} />
      </div>
    </div>
  );
};

const QuoteBlock: React.FC<{ lines: string[] }> = ({ lines }) => {
  const renderLines = (linesToRender: string[]) => {
    const elements: JSX.Element[] = [];
    let i = 0;

    while (i < linesToRender.length) {
      const line = linesToRender[i];

      if (line.startsWith('>')) {
        const nestedLines: string[] = [];
        while (i < linesToRender.length && linesToRender[i].startsWith('>')) {
          const currentLine = linesToRender[i];
          if (currentLine === '>') {
            nestedLines.push('');
          } else if (currentLine.startsWith('> ')) {
            nestedLines.push(currentLine.slice(2));
          } else {
            nestedLines.push(currentLine.slice(1));
          }
          i++;
        }
        elements.push(
          <QuoteBlock key={elements.length} lines={nestedLines} />
        );
        continue;
      }

      if (line === '') {
        elements.push(<div key={elements.length} style={{ height: '0.5rem' }} />);
        i++;
        continue;
      }

      elements.push(
        <div key={elements.length} style={{ margin: 0 }}>
          {parseInlineMarkdown(line)}
        </div>
      );
      i++;
    }

    return elements;
  };

  return (
    <blockquote className={styles.quote}>
      {renderLines(lines)}
    </blockquote>
  );
};

const ToggleComponent: React.FC<{
  summary: string;
  content: string;
}> = ({ summary, content }) => {
  return (
    <details className={styles.toggleBlock}>
      <summary className={styles.toggleHeader}>
        <span className={styles.toggleIcon}>▶</span>
        <span>{summary}</span>
      </summary>
      <div className={styles.toggleContent}>
        <SimpleMarkdownRenderer content={content} />
      </div>
    </details>
  );
};

interface BookmarkData {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
}

const BookmarkCard: React.FC<{ url: string; ogpData?: BookmarkData }> = ({ url, ogpData }) => {
  const getDomain = (urlString: string) => {
    try {
      const urlObj = new URL(urlString);
      return urlObj.hostname;
    } catch {
      return urlString;
    }
  };

  const title = ogpData?.title || getDomain(url);
  const description = ogpData?.description;
  const image = ogpData?.image;
  const siteName = ogpData?.siteName || getDomain(url);
  const faviconUrl = getFaviconUrl(url);

  return (
    <div className={styles.bookmarkBlock}>
      <a href={url} className={styles.bookmarkContent} target="_blank" rel="noopener noreferrer">
        <div className={styles.bookmarkInfo}>
          <div className={styles.bookmarkTitle}>{title}</div>
          {description && (
            <div className={styles.bookmarkDescription}>{description}</div>
          )}
          <div className={styles.bookmarkMetadata}>
            {faviconUrl && (
              <img
                src={faviconUrl}
                alt=""
                className={styles.bookmarkFavicon}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
            <span className={styles.bookmarkUrl}>{siteName}</span>
          </div>
        </div>
        {image && (
          <img
            src={image}
            alt=""
            className={styles.bookmarkThumbnail}
            style={{ width: '150px', height: '120px' }}
          />
        )}
      </a>
    </div>
  );
};

export default MarkdownRenderer;
