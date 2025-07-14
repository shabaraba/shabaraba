import React from 'react';
import { IPageHead } from '../core/types/NotionPageApiResponses';
import styles from '../styles/ArticleCard.module.css';

interface ArticleCardProps {
  article: IPageHead;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getExcerpt = (description?: string) => {
    if (!description) return '';
    return description.length > 120 
      ? description.substring(0, 120) + '...' 
      : description;
  };

  return (
    <article className={styles.card}>
      <a 
        href={`/posts/${article.slug}`}
        className={styles.cardLink}
      >
        {article.coverImage && (
          <div className={styles.imageContainer}>
            <img 
              src={article.coverImage} 
              alt={article.title}
              className={styles.image}
            />
          </div>
        )}
        <div className={styles.content}>
          <h3 className={styles.title}>{article.title}</h3>
          <p className={styles.excerpt}>
            {getExcerpt(article.description)}
          </p>
          <div className={styles.meta}>
            <time className={styles.date}>
              {formatDate(article.published)}
            </time>
            {article.tags && article.tags.length > 0 && (
              <div className={styles.tags}>
                {article.tags.slice(0, 3).map((tag) => (
                  <span key={tag.id} className={styles.tag}>
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </a>
    </article>
  );
};

export default ArticleCard;