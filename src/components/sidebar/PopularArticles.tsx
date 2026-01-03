'use client';

import React from 'react';
import Link from 'next/link';
import styles from './PopularArticles.module.css';
import { IPageHead } from 'core/types/NotionPageApiResponses';

interface PopularArticlesProps {
  trendingPosts?: IPageHead[];
}

export default function PopularArticles({ trendingPosts = [] }: PopularArticlesProps) {
  if (trendingPosts.length === 0) {
    return <div className={styles.noArticles}>人気記事はありません</div>;
  }

  return (
    <div className={styles.popularArticles}>
      <ul className={styles.articleList}>
        {trendingPosts.map((article) => (
          <li key={article.id} className={styles.articleItem}>
            <Link href={`/blog/posts/${article.slug}`} className={styles.articleLink}>
              {article.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
