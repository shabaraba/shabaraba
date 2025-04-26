import React from 'react';
import Link from 'next/link';
import styles from './PopularArticles.module.css';

/**
 * 人気記事一覧コンポーネント
 * 注: 実際の実装では、データは動的に取得します
 */
export default function PopularArticles() {
  // 仮のデータ - 実際の実装では記事データを取得する
  const popularArticles = [
    { id: 1, title: 'Notion APIを使ったブログの作り方', slug: 'build-blog-using-notion-api-1' },
    { id: 2, title: '効率的な開発環境の構築方法', slug: 'setup-develop-environment' },
    { id: 3, title: 'ipadだけでのコーディング環境構築', slug: 'coding-with-ipad' },
    { id: 4, title: '長距離通勤をしてみて思ったこと', slug: 'long-distance-commutation' },
    { id: 5, title: '自分のリンク集を公開してみた', slug: 'publish-my-links' },
  ];

  return (
    <div className={styles.popularArticles}>
      <ul className={styles.articleList}>
        {popularArticles.map((article) => (
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
