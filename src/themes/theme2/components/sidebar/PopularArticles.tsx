import React from 'react';
import Link from 'next/link';
import styles from './PopularArticles.module.css';
import { IPageHead } from 'core/types/NotionPageApiResponses';
import { usePostList } from 'themes/theme2/hooks/usePostList';

/**
 * 人気記事一覧コンポーネント
 * Notionからtrend属性がtrueの記事を表示します
 */
export default function PopularArticles() {
  const { posts, isLoading } = usePostList();
  
  // トレンド記事のみをフィルタリング
  const trendingPosts: IPageHead[] = posts.filter(post => post.trend === true);
  console.log('PopularArticles - posts:', posts);
  console.log('PopularArticles - trendingPosts:', trendingPosts);

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
