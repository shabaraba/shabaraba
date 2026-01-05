'use client';

import ArticlePage from './pages/ArticlePage';

interface ArticlePageClientProps {
  article: any;
  sidebarData: {
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

export default function ArticlePageClient(props: ArticlePageClientProps) {
  return <ArticlePage {...props} />;
}
