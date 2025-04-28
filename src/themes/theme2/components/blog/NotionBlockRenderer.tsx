import React, { useState, Fragment } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import styles from './NotionBlockRenderer.module.css';
import { OgpFetchStatus, getFaviconUrl } from '../../../../lib/ogp';

// Notionブロックの型定義（実際はより複雑です）
interface NotionBlock {
  type: string;
  id: string;
  has_children?: boolean;
  [key: string]: any;
}

interface NotionBlockRendererProps {
  blocks: NotionBlock[];
}

/**
 * Notionブロックをレンダリングするコンポーネント
 */
/**
 * ネストされたリストをレンダリングする関数
 * @param blocks ブロックのリスト
 * @param parentType 親リストのタイプ（リストのネスト時に使用）
 * @returns JSX要素の配列
 */
function renderNestedList(blocks: NotionBlock[], parentType?: string) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  // リストアイテムをグループ化
  const result: JSX.Element[] = [];
  let currentListType: string | null = null;
  let currentListItems: JSX.Element[] = [];

  blocks.forEach((block, index) => {
    if (block.type === 'bulleted_list_item' || block.type === 'numbered_list_item') {
      // 新しいリストタイプが始まった場合
      if (currentListType !== block.type) {
        // 前のリストがあれば追加
        if (currentListItems.length > 0) {
          // 親リストのタイプがあれば、それを継承する
          const actualListType = parentType || currentListType;
          const ListTag = actualListType === 'bulleted_list_item' ? 'ul' : 'ol';
          result.push(
            <ListTag key={`nested-list-${index}`} className={actualListType === 'bulleted_list_item' ? styles.nestedList : styles.nestedList}>
              {currentListItems}
            </ListTag>
          );
          currentListItems = [];
        }
        currentListType = block.type;
      }

      // 現在のリストにアイテムを追加（親リストのタイプを渡す）
      currentListItems.push(renderListItem(block, parentType || currentListType));
    } else {
      // リストアイテムでない場合は、現在のリストがあれば追加
      if (currentListItems.length > 0) {
        const actualListType = parentType || currentListType;
        const ListTag = actualListType === 'bulleted_list_item' ? 'ul' : 'ol';
        result.push(
          <ListTag key={`nested-list-${index}`} className={actualListType === 'bulleted_list_item' ? styles.nestedList : styles.nestedList}>
            {currentListItems}
          </ListTag>
        );
        currentListItems = [];
        currentListType = null;
      }

      // 通常のブロックを追加
      result.push(renderBlock(block));
    }
  });

  // 最後のリストがあれば追加
  if (currentListItems.length > 0) {
    const actualListType = parentType || currentListType;
    const ListTag = actualListType === 'bulleted_list_item' ? 'ul' : 'ol';
    result.push(
      <ListTag key="nested-list-end" className={actualListType === 'bulleted_list_item' ? styles.nestedList : styles.nestedList}>
        {currentListItems}
      </ListTag>
    );
  }

  return result;
}

/**
 * リストアイテムをレンダリングする特別な関数
 * @param block リストアイテムブロック
 * @param parentType 親リストのタイプ
 * @returns JSX要素
 */
function renderListItem(block: NotionBlock, parentType: string | null) {
  const { id, type } = block;
  
  // リストアイテムの内容を取得
  const content = type === 'bulleted_list_item' 
    ? block.bulleted_list_item && renderRichText(block.bulleted_list_item.rich_text)
    : block.numbered_list_item && renderRichText(block.numbered_list_item.rich_text);
  
  // 子要素があるかチェック
  const hasChildren = block.has_children && block.children && Array.isArray(block.children.results);
  
  // 子要素があれば再帰的に処理（親のリストタイプを継承）
  const childrenContent = hasChildren ? (
    parentType === 'bulleted_list_item' ? (
      <ul className={styles.nestedList}>
        {renderNestedList(block.children.results, parentType)}
      </ul>
    ) : (
      <ol className={styles.nestedList}>
        {renderNestedList(block.children.results, parentType)}
      </ol>
    )
  ) : null;
  
  return (
    <li key={id}>
      {content}
      {childrenContent}
    </li>
  );
}

export default function NotionBlockRenderer({ blocks }: NotionBlockRendererProps) {
  // ブロックがない場合は何も表示しない
  if (!blocks || blocks.length === 0) {
    return null;
  }

  // リストアイテムをグループ化する関数
  const renderBlocks = (blocks: NotionBlock[]) => {
    const result: JSX.Element[] = [];
    let currentListType: string | null = null;
    let currentListItems: JSX.Element[] = [];

    blocks.forEach((block, index) => {
      // リストアイテムの場合はグループ化
      if (block.type === 'bulleted_list_item' || block.type === 'numbered_list_item') {
        const isBullet = block.type === 'bulleted_list_item';
        
        // 新しいリストタイプが始まった場合
        if (currentListType !== block.type) {
          // 前のリストがあれば追加
          if (currentListItems.length > 0) {
            const ListTag = currentListType === 'bulleted_list_item' ? 'ul' : 'ol';
            result.push(
              <ListTag key={`list-${index}`} className={currentListType === 'bulleted_list_item' ? styles.bulletedList : styles.numberedList}>
                {currentListItems}
              </ListTag>
            );
            currentListItems = [];
          }
          currentListType = block.type;
        }
        
        // 現在のリストにアイテムを追加（親リストのタイプを渡す）
        currentListItems.push(renderListItem(block, currentListType));
      } else {
        // リストアイテムでない場合は、現在のリストがあれば追加
        if (currentListItems.length > 0) {
          const ListTag = currentListType === 'bulleted_list_item' ? 'ul' : 'ol';
          result.push(
            <ListTag key={`list-${index}`} className={currentListType === 'bulleted_list_item' ? styles.bulletedList : styles.numberedList}>
              {currentListItems}
            </ListTag>
          );
          currentListItems = [];
          currentListType = null;
        }
        
        // 通常のブロックを追加
        result.push(renderBlock(block));
      }
    });
    
    // 最後のリストがあれば追加
    if (currentListItems.length > 0) {
      const ListTag = currentListType === 'bulleted_list_item' ? 'ul' : 'ol';
      result.push(
        <ListTag key={`list-end`} className={currentListType === 'bulleted_list_item' ? styles.bulletedList : styles.numberedList}>
          {currentListItems}
        </ListTag>
      );
    }
    
    return result;
  };

  return (
    <div className={styles.notionContent}>
      {renderBlocks(blocks)}
    </div>
  );
}

/**
 * ブロックタイプに応じたレンダリング関数
 */
function renderBlock(block: NotionBlock) {
  const { id, type } = block;

  // ブロックタイプに応じて適切なコンポーネントを返す
  switch (type) {
    case 'paragraph':
      return (
        <p key={id} className={styles.paragraph}>
          {block.paragraph && renderRichText(block.paragraph.rich_text)}
        </p>
      );
    
    case 'heading_1':
      return (
        <h1 key={id} className={styles.heading1}>
          {block.heading_1 && renderRichText(block.heading_1.rich_text)}
        </h1>
      );
    
    case 'heading_2':
      return (
        <h2 key={id} className={styles.heading2}>
          {block.heading_2 && renderRichText(block.heading_2.rich_text)}
        </h2>
      );
    
    case 'heading_3':
      return (
        <h3 key={id} className={styles.heading3}>
          {block.heading_3 && renderRichText(block.heading_3.rich_text)}
        </h3>
      );
    
    case 'bulleted_list_item':
      return renderListItem(block, 'bulleted_list_item');
    
    case 'numbered_list_item':
      return renderListItem(block, 'numbered_list_item');
    
    case 'code':
      if (!block.code) {
        return (
          <div key={id} className={styles.unsupportedBlock}>
            Invalid code block: missing code data
          </div>
        );
      }
      
      return (
        <div key={id} className={styles.codeBlock}>
          <SyntaxHighlighter
            language={((block.code.language || 'text').toLowerCase())}
            style={tomorrow}
            className={styles.syntaxHighlighter}
          >
            {block.code.rich_text && Array.isArray(block.code.rich_text) 
              ? block.code.rich_text.map((text: any) => text.plain_text || '').join('') 
              : ''}
          </SyntaxHighlighter>
          {block.code.caption && Array.isArray(block.code.caption) && block.code.caption.length > 0 && (
            <div className={styles.codeCaption}>
              {renderRichText(block.code.caption)}
            </div>
          )}
        </div>
      );
    
    case 'image':
      if (!block.image) {
        return (
          <div key={id} className={styles.unsupportedBlock}>
            Invalid image block: missing image data
          </div>
        );
      }
      
      let imageSource = '';
      try {
        imageSource = block.image.type === 'external' 
          ? (block.image.external && block.image.external.url ? block.image.external.url : '')
          : (block.image.file && block.image.file.url ? block.image.file.url : '');
      } catch (error) {
        console.error('Error getting image URL:', error);
      }

      if (!imageSource) {
        return (
          <div key={id} className={styles.unsupportedBlock}>
            Invalid image block: missing URL
          </div>
        );
      }
      
      const caption = block.image.caption && block.image.caption.length > 0
        ? renderRichText(block.image.caption)
        : '';
      
      return (
        <figure key={id} className={styles.imageContainer}>
          <div className={styles.image}>
            <Image
              src={imageSource}
              alt={'Image'}
              width={800}
              height={500}
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'contain'
              }}
            />
          </div>
          {caption && <figcaption className={styles.imageCaption}>{caption}</figcaption>}
        </figure>
      );
    
    case 'divider':
      return <hr key={id} className={styles.divider} />;
    
    case 'quote':
      return (
        <blockquote key={id} className={styles.quote}>
          {block.quote && renderRichText(block.quote.rich_text)}
        </blockquote>
      );
    
    case 'callout':
      return (
        <div key={id} className={styles.callout}>
          <div className={styles.calloutIcon}>
            {block.callout && block.callout.icon && block.callout.icon.type === 'emoji' 
              ? block.callout.icon.emoji 
              : '💡'}
          </div>
          <div className={styles.calloutContent}>
            {block.callout && renderRichText(block.callout.rich_text)}
          </div>
        </div>
      );
    
    case 'embed':
      if (!block.embed || !block.embed.url) {
        return (
          <div key={id} className={styles.unsupportedBlock}>
            Invalid embed block: missing URL
          </div>
        );
      }
      
      // 埋め込みURLの処理
      const embedUrl = block.embed.url;
      
      // YouTube埋め込み処理
      const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)(?:\?.*)?/;
      const youtubeMatch = embedUrl.match(youtubeRegex);
      
      // Vimeo埋め込み処理
      const vimeoRegex = /(?:https?:\/\/)?(?:www\.)?(?:vimeo\.com\/)([0-9]+)(?:\?.*)?/;
      const vimeoMatch = embedUrl.match(vimeoRegex);
      
      // Twitter埋め込み処理
      const twitterRegex = /(?:https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/(?:#!\/)?(\w+)\/status(?:es)?\/(\d+)/;
      const twitterMatch = embedUrl.match(twitterRegex);

      // CodePen埋め込み処理
      const codepenRegex = /(?:https?:\/\/)?(?:www\.)?codepen\.io\/([^\/]+)\/(?:pen|embed)\/([^\/]+)/;
      const codepenMatch = embedUrl.match(codepenRegex);
      
      // キャプション処理
      const embedCaption = block.embed.caption && Array.isArray(block.embed.caption) && block.embed.caption.length > 0
        ? renderRichText(block.embed.caption)
        : null;
      
      let embedContent;
      if (youtubeMatch && youtubeMatch[1]) {
        // YouTube埋め込み
        const youtubeId = youtubeMatch[1];
        embedContent = (
          <iframe
            className={styles.embedIframe}
            src={`https://www.youtube.com/embed/${youtubeId}`}
            title="YouTube video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            width="100%"
            height="450"
            frameBorder="0"
            data-testid="embed-iframe"
          />
        );
      } else if (vimeoMatch && vimeoMatch[1]) {
        // Vimeo埋め込み
        const vimeoId = vimeoMatch[1];
        embedContent = (
          <iframe
            className={styles.embedIframe}
            src={`https://player.vimeo.com/video/${vimeoId}`}
            title="Vimeo video"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            width="100%"
            height="450"
            frameBorder="0"
            data-testid="embed-iframe"
          />
        );
      } else if (twitterMatch && twitterMatch[1] && twitterMatch[2]) {
        // Twitter埋め込み
        const username = twitterMatch[1];
        const tweetId = twitterMatch[2];
        embedContent = (
          <div className={styles.twitterEmbed}>
            <blockquote className="twitter-tweet">
              <a 
                href={`https://twitter.com/${username}/status/${tweetId}`}
                target="_blank" 
                rel="noopener noreferrer"
              >
                Loading Tweet...
              </a>
            </blockquote>
            <script async src="https://platform.twitter.com/widgets.js" charSet="utf-8"></script>
          </div>
        );
      } else if (codepenMatch && codepenMatch[1] && codepenMatch[2]) {
        // CodePen埋め込み
        const username = codepenMatch[1];
        const penId = codepenMatch[2];
        embedContent = (
          <iframe
            className={styles.embedIframe}
            src={`https://codepen.io/${username}/embed/${penId}?default-tab=result`}
            title="CodePen Embed"
            allowFullScreen
            width="100%"
            height="450"
            frameBorder="0"
            data-testid="embed-iframe"
          />
        );
      } else {
        // 一般的なiframe埋め込み
        try {
          const url = new URL(embedUrl);
          embedContent = (
            <iframe
              className={styles.embedIframe}
              src={embedUrl}
              title="Embedded content"
              width="100%"
              height="450"
              frameBorder="0"
              data-testid="embed-iframe"
            />
          );
        } catch (e) {
          // URLが無効な場合はリンクとして表示
          embedContent = (
            <div className={styles.unsupportedBlock}>
              <p>外部コンテンツの埋め込み:</p>
              <Link href={embedUrl} target="_blank" rel="noopener noreferrer" className={styles.link}>
                {embedUrl}
              </Link>
            </div>
          );
        }
      }
      
      return (
        <div key={id} className={styles.embedContainer}>
          {embedContent}
          {embedCaption && <div className={styles.embedCaption}>{embedCaption}</div>}
        </div>
      );
    
    case 'bookmark':
      if (!block.bookmark || !block.bookmark.url) {
        return (
          <div key={id} className={styles.unsupportedBlock}>
            Invalid bookmark block: missing URL
          </div>
        );
      }
      
      // Bookmarkコンポーネントを使用
      // ビルド時に取得したOGPデータをcaptionと一緒に渡す
      return <BookmarkBlock key={id} url={block.bookmark.url} caption={block.bookmark.caption || block.bookmark.ogp ? { ...block.bookmark.caption, ogp: block.bookmark.ogp } : undefined} />;
    
    
    case 'toggle':
      if (!block.toggle) {
        return (
          <div key={id} className={styles.unsupportedBlock}>
            Invalid toggle block: missing toggle data
          </div>
        );
      }
      
      // toggleコンポーネントの状態管理
      const ToggleBlock = () => {
        const [isOpen, setIsOpen] = useState(false);
        
        const toggleHeader = block.toggle.rich_text ? renderRichText(block.toggle.rich_text) : 'Toggle';
        const hasChildren = block.has_children && block.children && Array.isArray(block.children.results);
        
        const handleToggle = () => {
          setIsOpen(!isOpen);
        };
        
        return (
          <div className={styles.toggleBlock}>
            <div 
              className={styles.toggleHeader} 
              onClick={handleToggle}
              data-testid="toggle-button"
            >
              <span className={`${styles.toggleIcon} ${isOpen ? styles.toggleIconOpen : ''}`}>
                ▶
              </span>
              <div>{toggleHeader}</div>
            </div>
            {isOpen && hasChildren && (
              <div className={styles.toggleContent}>
                {renderBlocks(block.children.results)}
              </div>
            )}
          </div>
        );
      };
      
      return <ToggleBlock key={id} />;
    
    case 'unsupported':
      // Notionからunsupported blockとして送られてきた場合の処理
      return (
        <div key={id} className={styles.unsupportedBlock}>
          <p><strong>サポートされていないブロック</strong></p>
          <p>このブロックタイプはまだサポートしていません。</p>
        </div>
      );
    
    // その他のブロックタイプは必要に応じて追加
    
    default:
      // サポートしていないブロックタイプ
      return (
        <div key={id} className={styles.unsupportedBlock}>
          <p>Unsupported block type: {type}</p>
        </div>
      );
  }
}

/**
 * OGPデータを表示するブックマークブロックコンポーネント
 */
interface BookmarkBlockProps {
  url: string;
  caption?: any[];
}

const BookmarkBlock: React.FC<BookmarkBlockProps> = ({ url, caption }) => {
  // ホスト名を取得
  const hostname = (() => {
    try {
      return new URL(url).hostname;
    } catch (e) {
      return url;
    }
  })();
  
  // キャプションの処理
  const bookmarkCaption = caption && Array.isArray(caption) && caption.length > 0
    ? renderRichText(caption)
    : null;
  
  // ビルド時に取得したOGPデータを使用
  const ogp = caption?.ogp;
  
  // OGPデータがない場合はホスト名のみ表示
  if (!ogp) {
    return (
      <div className={styles.bookmarkBlock}>
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className={styles.bookmarkContent}
          data-testid="bookmark-link"
        >
          <div className={styles.bookmarkInfo}>
            <div className={styles.bookmarkTitle}>{hostname}</div>
            <div className={styles.bookmarkUrl}>{url}</div>
          </div>
        </a>
        {bookmarkCaption && <div className={styles.bookmarkCaption}>{bookmarkCaption}</div>}
      </div>
    );
  }
  
  // OGPデータの表示
  const faviconUrl = getFaviconUrl(url);
  
  return (
    <div className={styles.bookmarkBlock}>
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer" 
        className={styles.bookmarkContent}
        data-testid="bookmark-link"
      >
        <div className={styles.bookmarkInfo}>
          <div className={styles.bookmarkTitle}>
            {ogp.pageTitle || ogp.siteTitle || hostname}
          </div>
          {ogp.pageDescription && (
            <div className={styles.bookmarkDescription}>
              {ogp.pageDescription}
            </div>
          )}
          <div className={styles.bookmarkMetadata}>
            <img 
              src={faviconUrl} 
              alt=""
              className={styles.bookmarkFavicon}
            />
            <div className={styles.bookmarkUrl}>
              {hostname}
            </div>
          </div>
        </div>
        {ogp.thumbnailUrl && (
          <Image 
            className={styles.bookmarkThumbnail} 
            src={ogp.thumbnailUrl}
            alt={ogp.title || 'Thumbnail'}
            width={200}
            height={120}
          />
        )}
      </a>
      {bookmarkCaption && <div className={styles.bookmarkCaption}>{bookmarkCaption}</div>}
    </div>
  );
};

/**
 * Notionのリッチテキストをレンダリングする関数
 */
function renderRichText(richText: any[] = []) {
  if (!richText || !Array.isArray(richText) || richText.length === 0) {
    return null;
  }

  return richText.map((text, index) => {
    if (!text) return null;
    
    const annotations = text.annotations || {};
    const {
      bold = false,
      italic = false,
      strikethrough = false,
      underline = false,
      code = false
    } = annotations;
    
    let plain_text = text.plain_text || '';
    const href = text.href;

    // 改行を処理
    const hasNewlines = plain_text.includes('\n');
    if (hasNewlines) {
      const textParts = plain_text.split('\n');

      // 改行を<br />タグに変換
      return (
        <Fragment key={index}>
          {textParts.map((part, i) => {
            // スタイルをクラス名に変換
            const classNames = [];
            if (bold) classNames.push(styles.bold);
            if (italic) classNames.push(styles.italic);
            if (strikethrough) classNames.push(styles.strikethrough);
            if (underline) classNames.push(styles.underline);
            if (code) classNames.push(styles.inlineCode);

            // クラス名を結合
            const className = classNames.length > 0 ? classNames.join(' ') : undefined;

            // リンクがある場合
            if (href) {
              return (
                <Fragment key={i}>
                  <Link href={href} className={`${styles.link} ${className}`} target="_blank" rel="noopener noreferrer">
                    {part}
                  </Link>
                  {i < textParts.length - 1 && <br />}
                </Fragment>
              );
            }

            // 通常のテキスト
            return (
              <Fragment key={i}>
                <span className={className}>{part}</span>
                {i < textParts.length - 1 && <br />}
              </Fragment>
            );
          })}
        </Fragment>
      );
    }

    // 改行がない場合は通常の処理
    // スタイルをクラス名に変換
    const classNames = [];
    if (bold) classNames.push(styles.bold);
    if (italic) classNames.push(styles.italic);
    if (strikethrough) classNames.push(styles.strikethrough);
    if (underline) classNames.push(styles.underline);
    if (code) classNames.push(styles.inlineCode);

    // クラス名を結合
    const className = classNames.length > 0 ? classNames.join(' ') : undefined;

    // リンクがある場合
    if (href) {
      return (
        <Link href={href} key={index} className={`${styles.link} ${className}`} target="_blank" rel="noopener noreferrer">
          {plain_text}
        </Link>
      );
    }

    // 通常のテキスト
    return (
      <span key={index} className={className}>
        {plain_text}
      </span>
    );
  });
}
