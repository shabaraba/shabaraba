'use client';

import { useSearchParams } from 'next/navigation';
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
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;

  // ページ番号のバリデーション
  const validatedPage = Math.max(1, Math.min(currentPage, props.pagination.totalPages));

  return <HomePage {...props} pagination={{ ...props.pagination, currentPage: validatedPage }} />;
}
