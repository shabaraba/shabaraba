'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import HomePage from './pages/HomePage';

interface TagPageClientProps {
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
  tagName: string;
}

function TagPageContent(props: TagPageClientProps) {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;

  // ページ番号のバリデーション
  const validatedPage = Math.max(1, Math.min(currentPage, props.pagination.totalPages));

  return <HomePage {...props} pagination={{ ...props.pagination, currentPage: validatedPage }} />;
}

export default function TagPageClient(props: TagPageClientProps) {
  return (
    <Suspense fallback={<HomePage {...props} />}>
      <TagPageContent {...props} />
    </Suspense>
  );
}
