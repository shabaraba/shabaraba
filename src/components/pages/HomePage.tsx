'use client';

import React from 'react';
import Layout from '../layouts/Layout';
import PaginatedArticleList from '../blog/PaginatedArticleList';
import styles from './HomePage.module.css';
import { useConfig } from '../../config/useConfig';

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
    totalPages?: number;
  };
  customTitle?: string;
  customDescription?: string;
  tagName?: string;
}

const HomePage = React.memo(function HomePage({
  articles,
  sidebarData,
  pagination,
  tagName
}: HomePageProps) {
  const { getSetting } = useConfig();

  const paginationDefaults = {
    totalItems: articles.length,
    itemsPerPage: 10,
    currentPage: 1
  };
  const paginationSettings = pagination || paginationDefaults;
  const queryParams = tagName ? { tag: tagName } : {};
  const tagTitlePrefix = getSetting('tag.title_prefix', 'タグ: ');
  const tagSubtitleTemplate = getSetting('tag.subtitle_template', '「%s」に関連する記事一覧');

  return (
    <Layout sidebarData={sidebarData}>
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
        baseUrl={tagName ? `/tags/${tagName.toLowerCase()}` : '/blog'}
        queryParams={queryParams}
      />
    </Layout>
  );
});

export default HomePage;
