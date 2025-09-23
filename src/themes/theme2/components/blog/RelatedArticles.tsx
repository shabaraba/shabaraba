import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArticleListItem } from '../../../../core/interfaces/article/ArticleRepository';
import styles from './RelatedArticles.module.css';

interface RelatedArticlesProps {
  articles: ArticleListItem[];
}

/**
 * 関連記事コンポーネント
 * 記事詳細画面の下部に表示する「合わせて読みたい」セクション
 */
export default function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (!articles || articles.length === 0) {
    return null; // 関連記事がない場合は何も表示しない
  }

  return (
    <div className={styles.relatedArticles}>
      <h2 className={styles.relatedTitle}>合わせて読みたい</h2>
      <div className={styles.relatedList}>
        {articles.map((article) => (
          <Link 
            key={article.id} 
            href={`/blog/posts/${article.slug}`} 
            className={styles.relatedItem}
          >
            <div className={styles.relatedThumbnail}>
              {article.coverImage ? (
                <Image
                  src={article.coverImage}
                  alt={article.title}
                  width={120}
                  height={80}
                  className={styles.relatedImage}
                />
              ) : (
                <div className={styles.noImage} />
              )}
            </div>
            <div className={styles.relatedContent}>
              <h3 className={styles.relatedItemTitle}>{article.title}</h3>
              <time className={styles.relatedDate}>
                {new Date(article.publishedAt).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              {article.tags && article.tags.length > 0 && (
                <div className={styles.relatedTags}>
                  {article.tags.map((tag, idx) => (
                    <span key={idx} className={styles.relatedTag}>{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
