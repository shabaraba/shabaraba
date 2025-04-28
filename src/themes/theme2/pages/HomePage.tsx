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
}

/**
 * ホームページコンポーネント
 */
export default function HomePage({ articles, sidebarData }: HomePageProps) {
  // サイドバーデータをグローバル変数に設定
  if (typeof window !== 'undefined' && sidebarData) {
    window.__SIDEBAR_DATA__ = sidebarData;
  }

  return (
    <Layout>
      <div className={styles.hero}>
        <h1 className={styles.title}>Coffee Break Point</h1>
        <p className={styles.subtitle}>
          プログラミングやデザイン、日々の気づきをお届けするブログです
        </p>
      </div>
      <ArticleList articles={articles} />
    </Layout>
  );
}