import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './ArticleList.module.css';
import { ArticleListItem } from '../../core/interfaces/article/ArticleRepository';

interface ArticleListProps {
  articles: ArticleListItem[];
}

const DEFAULT_IMAGE = '/images/covers/default.jpg';

/**
 * 記事一覧の各記事カードコンポーネント
 */
function ArticleThumbnail({ article }: { article: ArticleListItem }) {
  const [imgSrc, setImgSrc] = useState(article.coverImage);
  const [hasError, setHasError] = useState(false);

  const handleImageError = () => {
    if (!hasError) {
      setImgSrc(DEFAULT_IMAGE);
      setHasError(true);
    }
  };

  // coverImageがある場合は画像を表示
  if (article.coverImage) {
    return (
      <div className={styles.articleImage}>
        <Link href={`/blog/posts/${article.slug}`}>
          <Image
            src={imgSrc || DEFAULT_IMAGE}
            alt={article.title}
            width={800}
            height={420}
            className={styles.image}
            onError={handleImageError}
          />
        </Link>
      </div>
    );
  }

  // coverImageがなくiconがある場合はアイコンを表示
  if (article.icon) {
    return (
      <div className={styles.articleIcon}>
        <Link href={`/blog/posts/${article.slug}`}>
          <span className={styles.iconText}>{article.icon}</span>
        </Link>
      </div>
    );
  }

  // どちらもない場合は何も表示しない
  return null;
}

/**
 * 記事一覧コンポーネント
 */
export default function ArticleList({ articles }: ArticleListProps) {
  return (
    <div className={styles.articleList}>
      {articles.map((article) => (
        <article key={article.id} className={styles.articleCard}>
          <ArticleThumbnail article={article} />
          <div className={styles.articleContent}>
            <h2 className={styles.articleTitle}>
              <Link href={`/blog/posts/${article.slug}`} className={styles.titleLink}>
                {article.title}
              </Link>
            </h2>
            <div className={styles.articleMeta}>
              <time className={styles.articleDate}>
                {new Date(article.publishedAt).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              {article.tags && article.tags.length > 0 && (
                <div className={styles.articleTags}>
                  {article.tags.map((tag, index) => {
                    // タグがオブジェクトか文字列かをチェック
                    const tagName = typeof tag === 'string' ? tag : (tag.name || '');
                    return (
                      <Link href={`/tags/${tagName.toLowerCase()}`} key={index} className={styles.tagLink}>
                        {tagName}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
            {article.excerpt && (
              <p className={styles.articleExcerpt}>{article.excerpt}</p>
            )}
            <Link href={`/blog/posts/${article.slug}`} className={styles.readMore}>
              続きを読む →
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
