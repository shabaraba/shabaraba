import React from 'react';
import Link from 'next/link';
import styles from './PopularArticles.module.css';
import { useTrendingPosts } from 'themes/theme2/hooks/useTrendingPosts';

/**
 * 人気記事一覧コンポーネント
 * Notionからtrend属性がtrueの記事を表示します
 */
export default function PopularArticles() {
  const { trendingPosts, isLoading, error } = useTrendingPosts();
  
  console.log('PopularArticles - trendingPosts:', trendingPosts);
  
  if (error) {
    console.error('Error in PopularArticles:', error);
  }

  if (isLoading) {
    return <div className={styles.loading}>読み込み中...</div>;
  }

  if (trendingPosts.length === 0) {
    return <div className={styles.noArticles}>人気記事はありません (trend=trueの記事が見つかりません)</div>;
  }

  return (
    <div className={styles.popularArticles}>
      <ul className={styles.articleList}>
        {trendingPosts.map((article) => (
          <li key={article.id} className={styles.articleItem}>
            <Link href={`/posts/${article.slug}`} className={styles.articleLink}>
              {article.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
