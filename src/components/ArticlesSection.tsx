import React from 'react';
import { IPageHead } from '../core/types/NotionPageApiResponses';
import ArticleCard from './ArticleCard';
import styles from '../styles/ArticlesSection.module.css';

interface ArticlesSectionProps {
  articles: IPageHead[];
}

const ArticlesSection: React.FC<ArticlesSectionProps> = ({ articles }) => {
  return (
    <section id="articles" className={styles.section}>
      <div className={styles.sectionContent}>
        <h2 className={styles.sectionTitle}>Latest Articles</h2>
        <p className={styles.sectionDescription}>
          技術や開発について書いた記事をご紹介します
        </p>
        
        <div className={styles.articlesGrid}>
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
        
        <div className={styles.readMoreContainer}>
          <a 
            href="/blog" 
            className={styles.readMoreButton}
          >
            すべての記事を見る
            <span className={styles.arrow}>→</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ArticlesSection;