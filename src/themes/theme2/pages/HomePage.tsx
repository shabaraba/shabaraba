import React from 'react';
import Layout from '../components/layouts/Layout';
import ArticleList from '../components/blog/ArticleList';
import { ArticleServiceFactory } from '../../../core/factories/ArticleServiceFactory';
import styles from './HomePage.module.css';

// getStaticProps関数でデータを取得する場合の型定義
interface HomePageProps {
  articles: any[];
  sidebarData?: {
    trendingPosts: any[];
    tags: any[];
    series: any[];
  };
  customTitle?: string;
  customDescription?: string;
  tagName?: string;
}

/**
 * ホームページコンポーネント
 * タグページとしても利用可能
 */
export default function HomePage({
  articles,
  sidebarData,
  customTitle,
  customDescription,
  tagName
}: HomePageProps) {
  // サイドバーデータをグローバル変数に設定
  if (typeof window !== 'undefined' && sidebarData) {
    window.__SIDEBAR_DATA__ = sidebarData;
  }

  // デフォルトタイトルと説明
  const title = customTitle || 'Coffee Break Point';
  const description = customDescription || 'プログラミングやデザイン、日々の気づきをお届けするブログです';

  return (
    <Layout title={title} description={description}>
      <div className={styles.hero}>
        {tagName ? (
          <>
            <h1 className={styles.title}>タグ: {tagName}</h1>
            <p className={styles.subtitle}>
              「{tagName}」に関連する記事一覧
            </p>
          </>
        ) : (
          <>
            <h1 className={styles.title}>Coffee Break Point</h1>
            <p className={styles.subtitle}>
              プログラミングやデザイン、日々の気づきをお届けするブログです
            </p>
          </>
        )}
      </div>
      <ArticleList articles={articles} />
    </Layout>
  );
}