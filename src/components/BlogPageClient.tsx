'use client';

import HomePage from './pages/HomePage';

interface BlogPageClientProps {
  articles: any[];
  sidebarData: {
    trendingPosts: any[];
    tags: any[];
    series: any[];
  };
  pagination: {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    totalPages: number;
  };
}

export default function BlogPageClient(props: BlogPageClientProps) {
  return <HomePage {...props} />;
}
