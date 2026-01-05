'use client';

import React from 'react';
import { IPageHead } from '../core/types/NotionPageApiResponses';
import styles from '../styles/ArticlesSection.module.css';

interface ArticlesSectionProps {
  articles: IPageHead[];
}

const ArticlesSection: React.FC<ArticlesSectionProps> = ({ articles }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getExcerpt = (description?: string) => {
    if (!description) return '';
    return description.length > 100 
      ? description.substring(0, 100) + '...' 
      : description;
  };

  return (
    <>
      <p className={styles.sectionDescription}>
        最新のブログ記事をご紹介します。技術的な知見や日々の学びを共有しています。
      </p>
      <div className={styles.timeline}>
        {articles.map((article) => (
          <div key={article.id} className={styles.articleCard}>
            <div className={styles.articleContent}>
              <a 
                href={`/blog/posts/${article.slug}`}
                className={styles.articleLink}
              >
                <div className={styles.articleInfo}>
                  <div className={styles.articleHeader}>
                    <h3 className={styles.articleTitle}>{article.title}</h3>
                    <time className={styles.articleDate}>
                      {formatDate(article.publishedAt)}
                    </time>
                  </div>
                  <p className={styles.articleExcerpt}>
                    {getExcerpt(article.description)}
                  </p>
                  {article.tags && article.tags.length > 0 && (
                    <div className={styles.articleTags}>
                      {article.tags.slice(0, 3).map((tag, index) => (
                        <span key={tag.id || `${article.id}-tag-${index}`} className={styles.tag}>
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {article.coverImage && (
                  <div className={styles.articleImageContainer}>
                    <img 
                      src={article.coverImage} 
                      alt={article.title}
                      className={styles.articleImage}
                    />
                  </div>
                )}
              </a>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.readMoreContainer}>
        <a href="/blog" className={styles.readMoreButton}>
          すべての記事を見る
          <span className={styles.arrow}>→</span>
        </a>
      </div>
    </>
  );
};

export default ArticlesSection;