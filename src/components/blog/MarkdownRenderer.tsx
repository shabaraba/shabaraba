import React from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import { visit } from 'unist-util-visit';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import styles from './NotionBlockRenderer.module.css';
import { getFaviconUrl } from '../../lib/ogp-utils';
import type { Node } from 'unist';
import { remarkAutoBookmark } from '../../lib/markdown/plugins/remarkAutoBookmark';

interface MarkdownRendererProps {
  content: string;
  ogpData?: Map<string, {
    title?: string;
    description?: string;
    image?: string;
    siteName?: string;
  }>;
}

/**
 * カスタムディレクティブ（:::callout, :::toggle）を処理するremarkプラグイン
 */
function remarkCustomDirectives() {
  return (tree: Node) => {
    visit(tree, (node: any) => {
      if (
        node.type === 'containerDirective' ||
        node.type === 'leafDirective' ||
        node.type === 'textDirective'
      ) {
        const data = node.data || (node.data = {});
        const hProperties = data.hProperties || (data.hProperties = {});

        // ディレクティブ名をdata属性として保存
        hProperties.dataDirective = node.name;

        // 属性をdata属性として保存
        if (node.attributes) {
          Object.entries(node.attributes).forEach(([key, value]) => {
            hProperties[`data-${key}`] = value;
          });
        }
      }
    });
  };
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  ogpData,
}) => {
  const components: Partial<Components> = {
    // コードブロック
    code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : 'plaintext';

            if (!inline && match) {
              return (
                <div className={styles.codeBlock}>
                  <SyntaxHighlighter
                    language={language}
                    style={tomorrow}
                    className={styles.syntaxHighlighter}
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                </div>
              );
            }

            return (
              <code className={styles.inlineCode} {...props}>
                {children}
              </code>
            );
          },

    // 見出し
    h1: ({ children }: any) => (
      <h1 className={styles.heading1}>{children}</h1>
    ),
    h2: ({ children }: any) => (
      <h2 className={styles.heading2}>{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className={styles.heading3}>{children}</h3>
    ),

    // リスト
    ul: ({ children }: any) => (
      <ul className={styles.bulletedList}>{children}</ul>
    ),
    ol: ({ children }: any) => (
      <ol className={styles.numberedList}>{children}</ol>
    ),

    // 引用
    blockquote: ({ children }: any) => (
      <blockquote className={styles.quote}>{children}</blockquote>
    ),

    // 段落
    p: ({ children }: any) => (
      <div className={styles.paragraph}>{children}</div>
    ),

    // リンク
    a: ({ href, children }: any) => (
      <a
        href={href}
        className={styles.link}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),

    // 水平線
    hr: () => <hr className={styles.divider} />,

    // 強調
    strong: ({ children }: any) => (
      <strong className={styles.bold}>{children}</strong>
    ),
    em: ({ children }: any) => (
      <em className={styles.italic}>{children}</em>
    ),

    // テーブル
    table: ({ children }: any) => (
      <table className={styles.table}>{children}</table>
    ),

    // カスタムディレクティブのレンダリング
    div: ({ node, children, ...props }: any) => {
      const directive = props['data-directive'];
      const className = props.className;

      // Callout
      if (directive === 'callout') {
        const icon = props['data-icon'] || '💡';
        return (
          <CalloutComponent icon={icon}>
            {children}
          </CalloutComponent>
        );
      }

      // Toggle
      if (directive === 'toggle') {
        const summary = props['data-summary'] || '詳細を表示';
        return (
          <ToggleComponent summary={summary}>
            {children}
          </ToggleComponent>
        );
      }

      // Auto Bookmark (リンクのみの段落)
      if (className?.includes('bookmark-auto')) {
        const url = props['data-url'] || '';
        if (url) {
          const ogp = ogpData?.get(url);
          return (
            <BookmarkCard
              url={url}
              ogpData={ogp ? {
                url,
                title: ogp.title,
                description: ogp.description,
                image: ogp.image,
                siteName: ogp.siteName,
              } : undefined}
            />
          );
        }
      }

      return <div {...props}>{children}</div>;
    },
  };

  return (
    <div className={styles.notionContent}>
      <ReactMarkdown
        remarkPlugins={[
          remarkGfm,
          remarkDirective,
          remarkCustomDirectives,
          remarkAutoBookmark,
        ]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

// カスタムコンポーネント

const CalloutComponent: React.FC<{
  icon: string;
  children: React.ReactNode;
}> = ({ icon, children }) => {
  return (
    <div className={styles.callout}>
      <span className={styles.calloutIcon}>{icon}</span>
      <div className={styles.calloutContent}>{children}</div>
    </div>
  );
};

const ToggleComponent: React.FC<{
  summary: string;
  children: React.ReactNode;
}> = ({ summary, children }) => {
  return (
    <details className={styles.toggleBlock}>
      <summary className={styles.toggleHeader}>
        <span className={styles.toggleIcon}>▶</span>
        <span>{summary}</span>
      </summary>
      <div className={styles.toggleContent}>{children}</div>
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

const BookmarkCard: React.FC<{ url: string; ogpData?: BookmarkData }> = ({
  url,
  ogpData,
}) => {
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
      <a
        href={url}
        className={styles.bookmarkContent}
        target="_blank"
        rel="noopener noreferrer"
      >
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
          />
        )}
      </a>
    </div>
  );
};

export default MarkdownRenderer;
