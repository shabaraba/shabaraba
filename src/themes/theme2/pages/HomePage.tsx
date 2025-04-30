import React from 'react';
import Layout from '../components/layouts/Layout';
import PaginatedArticleList from '../components/blog/PaginatedArticleList';
import styles from './HomePage.module.css';
import { useConfig } from '../../../lib/useConfig';

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
// React.memoでコンポーネントのレンダリングを最適化
const HomePage = React.memo(function HomePage({
  articles,
  sidebarData,
  pagination,
  customTitle,
  customDescription,
  tagName
}: HomePageProps) {
  // SSGのため、サイドバーデータはページコンポーネントでは操作せず
  // _app.tsxのSidebarProviderを通じて提供される

  // 設定から文字列を取得
  const { getSetting } = useConfig();
  
  // デフォルトタイトルと説明
  const title = customTitle || getSetting('home.title', 'Coffee Break Point');
  const description = customDescription || getSetting('home.subtitle', 'プログラミングやデザイン、日々の気づきをお届けするブログです');

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

  // LayoutにsidebarDataを直接渡す
  // タグページのテキスト
  const tagTitlePrefix = getSetting('tag.title_prefix', 'タグ: ');
  const tagSubtitleTemplate = getSetting('tag.subtitle_template', '「%s」に関連する記事一覧');
  
  return (
    <Layout title={title} description={description}>
      <div className={styles.hero}>
        {tagName ? (
          <>
            <h1 className={styles.title}>{tagTitlePrefix}{tagName}</h1>
            <p className={styles.subtitle}>
              {tagSubtitleTemplate.replace('%s', tagName)}
            </p>
          </>
        ) : (
          <>
            <h1 className={styles.title}>{getSetting('home.title', 'Coffee Break Point')}</h1>
            <p className={styles.subtitle}>
              {getSetting('home.subtitle', 'プログラミングやデザイン、日々の気づきをお届けするブログです')}
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
});

// エクスポート
export default HomePage;
