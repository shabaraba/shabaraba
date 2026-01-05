'use client';

import React from 'react';
import Layout from '../layouts/Layout';
import ArticleDetail from '../blog/ArticleDetail';
import { Article } from '../../core/interfaces/article/ArticleRepository';

interface ArticlePageProps {
  article: Article;
  sidebarData?: {
    trendingPosts: any[];
    tags: any[];
    series: any[];
  };
  ogpData?: Map<string, {
    title?: string;
    description?: string;
    image?: string;
    siteName?: string;
  }>;
}

export default function ArticlePage({ article, sidebarData, ogpData }: ArticlePageProps) {
  if (!article) {
    return <div>記事が見つかりませんでした。</div>;
  }

  return (
    <Layout showSidebar={true} sidebarData={sidebarData}>
      <ArticleDetail article={article} ogpData={ogpData} />
    </Layout>
  );
}
