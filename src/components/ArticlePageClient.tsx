'use client';

import ArticlePage from './pages/ArticlePage';

interface ArticlePageClientProps {
  article: any;
  sidebarData: {
    trendingPosts: any[];
    tags: any[];
    series: any[];
  };
}

export default function ArticlePageClient(props: ArticlePageClientProps) {
  return <ArticlePage {...props} />;
}
