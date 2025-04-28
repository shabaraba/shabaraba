import React from 'react';
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
    
    // その他のブロックタイプは必要に応じて追加
    
    default:
      // サポートしていないブロックタイプ
      return (
        <div key={id} className={styles.unsupportedBlock}>
          Unsupported block type: {type}
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
