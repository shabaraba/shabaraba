import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import styles from './NotionBlockRenderer.module.css';

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
export default function NotionBlockRenderer({ blocks }: NotionBlockRendererProps) {
  // ブロックがない場合は何も表示しない
  if (!blocks || blocks.length === 0) {
    return null;
  }

  return (
    <div className={styles.notionContent}>
      {blocks.map((block) => renderBlock(block))}
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
      return (
        <ul key={id} className={styles.bulletedList}>
          <li>{block.bulleted_list_item && renderRichText(block.bulleted_list_item.rich_text)}</li>
          {block.has_children && block.children && Array.isArray(block.children.results) && 
            <div className={styles.nestedList}>
              {block.children.results.map((child: NotionBlock) => renderBlock(child))}
            </div>
          }
        </ul>
      );
    
    case 'numbered_list_item':
      return (
        <ol key={id} className={styles.numberedList}>
          <li>{block.numbered_list_item && renderRichText(block.numbered_list_item.rich_text)}</li>
          {block.has_children && block.children && Array.isArray(block.children.results) && 
            <div className={styles.nestedList}>
              {block.children.results.map((child: NotionBlock) => renderBlock(child))}
            </div>
          }
        </ol>
      );
    
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
              alt={caption || 'Image'}
              width={800}
              height={500}
              layout="responsive"
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
      
      // YouTubeの埋め込み処理
      const embedUrl = block.embed.url;
      const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)(?:\?.*)?/;
      const youtubeMatch = embedUrl.match(youtubeRegex);
      
      // Vimeoの埋め込み処理
      const vimeoRegex = /(?:https?:\/\/)?(?:www\.)?(?:vimeo\.com\/)([0-9]+)(?:\?.*)?/;
      const vimeoMatch = embedUrl.match(vimeoRegex);
      
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
            height="450"
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
            height="450"
            data-testid="embed-iframe"
          />
        );
      } else {
        // その他のURL：iframeで表示
        embedContent = (
          <div className={styles.unsupportedBlock}>
            <p>外部コンテンツの埋め込み:</p>
            <Link href={embedUrl} target="_blank" rel="noopener noreferrer" className={styles.link}>
              {embedUrl}
            </Link>
          </div>
        );
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
      
      const bookmarkUrl = block.bookmark.url;
      const hostname = (() => {
        try {
          return new URL(bookmarkUrl).hostname;
        } catch (e) {
          return bookmarkUrl;
        }
      })();
      
      // Notion APIのbookmarkブロックにはtitleとdescriptionが含まれていない可能性がある
      // そのため、ホスト名をデフォルトのタイトルとして使用し、説明はない場合は表示しない
      const bookmarkTitle = block.bookmark.title || hostname;
      const bookmarkDescription = block.bookmark.description || '';
      
      // キャプションの処理
      const bookmarkCaption = block.bookmark.caption && Array.isArray(block.bookmark.caption) && block.bookmark.caption.length > 0
        ? renderRichText(block.bookmark.caption)
        : null;
      
      return (
        <div key={id} className={styles.bookmarkBlock}>
          <a href={bookmarkUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.bookmarkContent}
            data-testid="bookmark-link">
            <div className={styles.bookmarkInfo}>
              <div className={styles.bookmarkTitle}>
                {bookmarkTitle}
              </div>
              {bookmarkDescription && (
                <div className={styles.bookmarkDescription}>
                  {bookmarkDescription}
                </div>
              )}
              <div className={styles.bookmarkUrl}>
                {hostname}
              </div>
            </div>
            {block.bookmark.thumbnail && (
              <div 
                className={styles.bookmarkThumbnail} 
                style={{ backgroundImage: `url(${block.bookmark.thumbnail})` }}
              />
            )}
          </a>
          {bookmarkCaption && <div className={styles.bookmarkCaption}>{bookmarkCaption}</div>}
        </div>
      );
    
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
                {block.children.results.map((child: NotionBlock) => renderBlock(child))}
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
    
    const plain_text = text.plain_text || '';
    const href = text.href;

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
