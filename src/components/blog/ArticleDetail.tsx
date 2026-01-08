import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Article } from '../../core/interfaces/article/ArticleRepository';
import styles from './ArticleDetail.module.css';
import NotionBlockRenderer from './NotionBlockRenderer';
import MarkdownRenderer from './MarkdownRenderer';
import RelatedArticles from './RelatedArticles';
import { FaFacebook } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { SiHatenabookmark } from 'react-icons/si';

interface ArticleDetailProps {
  article: Article;
  ogpData?: Map<string, {
    title?: string;
    description?: string;
    image?: string;
    siteName?: string;
  }>;
}

const DEFAULT_IMAGE = '/images/covers/default.jpg';

/**
 * 記事詳細コンポーネント
 */
export default function ArticleDetail({ article, ogpData }: ArticleDetailProps) {
  const [coverImageSrc, setCoverImageSrc] = useState(article.coverImage);
  const [hasError, setHasError] = useState(false);

  const handleImageError = () => {
    if (!hasError) {
      setCoverImageSrc(DEFAULT_IMAGE);
      setHasError(true);
    }
  };

  return (
    <article className={styles.article}>
      <header className={styles.header}>
        <h1 className={styles.title}>{article.title}</h1>
        <div className={styles.meta}>
          <time className={styles.date}>
            {new Date(article.publishedAt).toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
          {article.tags && article.tags.length > 0 && (
            <div className={styles.tags}>
              {article.tags.map((tag, index) => (
                <Link href={`/tags/${tag.toLowerCase()}`} key={index} className={styles.tag}>
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </div>
        {article.coverImage && (
          <div className={styles.coverImage}>
            <Image
              src={coverImageSrc || DEFAULT_IMAGE}
              alt={article.title}
              width={1200}
              height={630}
              priority
              className={styles.image}
              onError={handleImageError}
            />
          </div>
        )}
      </header>
      
      <div className={styles.content}>
        {typeof article.content === 'string' ? (
          <MarkdownRenderer content={article.content} ogpData={ogpData} />
        ) : (
          <NotionBlockRenderer blocks={article.content} />
        )}
      </div>
      
      {/* 関連記事セクション */}
      {article.relatedArticles && article.relatedArticles.length > 0 && (
        <RelatedArticles articles={article.relatedArticles} />
      )}
      
      <footer className={styles.footer}>
        <div className={styles.share}>
          <span className={styles.shareLabel}>この記事をシェアする:</span>
          <div className={styles.shareButtons}>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(`https://shaba.dev/blog/posts/${article.slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.shareButton}
              aria-label="X (旧Twitter) でシェア"
            >
              <FaXTwitter size={20} />
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://shaba.dev/blog/posts/${article.slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.shareButton}
              aria-label="Facebook でシェア"
            >
              <FaFacebook size={20} />
            </a>
            <a
              href={`https://b.hatena.ne.jp/entry/s/${encodeURIComponent(`shaba.dev/blog/posts/${article.slug}`).replace(/^https?:\/\//, '')}`}
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.shareButton}
              aria-label="はてなブックマークに追加"
            >
              <SiHatenabookmark size={20} />
            </a>
          </div>
        </div>
        <Link href="/blog" className={styles.backLink}>
          ← ホームへ戻る
        </Link>
      </footer>
    </article>
  );
}
