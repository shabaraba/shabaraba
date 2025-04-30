import React from 'react';
import Layout from '../components/layouts/Layout';
import PaginatedArticleList from '../components/blog/PaginatedArticleList';
import styles from './HomePage.module.css';

// getStaticProps関数でデータを取得する場合の型定義
interface HomePageProps {
  articles: any[];
  sidebarData?: {
    trendingPosts: any[];
    tags: any[];
    series: any[];
  };
  pagination?: {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
  };
  customTitle?: string;
  customDescription?: string;
  tagName?: string;
}

/**
 * ホームページコンポーネント
 * タグページとしても利用可能
 * ページネーション機能付き（SSG対応）
 */
export default function HomePage({
  articles,
  sidebarData,
  pagination,
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

  // ページネーション設定のデフォルト値
  const paginationDefaults = {
    totalItems: articles.length,
    itemsPerPage: 10,
    currentPage: 1
  };

  // 実際のページネーション設定
  const paginationSettings = pagination || paginationDefaults;
  
  // クエリパラメータ（タグページの場合はタグ名を含める）
  const queryParams = tagName ? { tag: tagName } : {};

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
            <p className={styles.subtitle}>
              プログラミングやデザイン、日々の気づきをお届けするブログです
            </p>
          </>
        )}
      </div>
      
      <PaginatedArticleList 
        articles={articles}
        totalItems={paginationSettings.totalItems}
        itemsPerPage={paginationSettings.itemsPerPage}
        currentPage={paginationSettings.currentPage}
        baseUrl={tagName ? `/tags/${tagName.toLowerCase()}` : '/'}
        queryParams={queryParams}
      />
    </Layout>
  );
}