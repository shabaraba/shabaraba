import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Article } from '../../../../core/interfaces/article/ArticleRepository';
import styles from './ArticleDetail.module.css';
import NotionBlockRenderer from './NotionBlockRenderer';

interface ArticleDetailProps {
  article: Article;
}

/**
 * 記事詳細コンポーネント
 */
export default function ArticleDetail({ article }: ArticleDetailProps) {
  console.log(JSON.stringify(article, null, 2));
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
              src={article.coverImage} 
              alt={article.title} 
              width={1200} 
              height={630} 
              priority
              className={styles.image}
            />
          </div>
        )}
      </header>
      
      <div className={styles.content}>
        <NotionBlockRenderer blocks={article.content} />
      </div>
      
      <footer className={styles.footer}>
        <div className={styles.share}>
          <span className={styles.shareLabel}>この記事をシェアする:</span>
          <div className={styles.shareButtons}>
            <a 
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(`https://blog.shaba.dev/posts/${article.slug}`)}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.shareButton}
            >
              Twitter
            </a>
            <a 
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://blog.shaba.dev/posts/${article.slug}`)}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.shareButton}
            >
              Facebook
            </a>
          </div>
        </div>
        <Link href="/" className={styles.backLink}>
          ← ホームへ戻る
        </Link>
      </footer>
    </article>
  );
}
