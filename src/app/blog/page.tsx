import { Metadata } from 'next';
import { CommonDataService } from '../../services/CommonDataService';
import BlogPageClient from '../../components/BlogPageClient';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Technical blog posts and articles',
};

const POSTS_PER_PAGE = 10;

interface BlogPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  // 全データを一度に取得
  const commonData = await CommonDataService.getAllData();

  // URLクエリパラメータからページ番号を取得
  const pageParam = searchParams.page;
  const currentPage = pageParam ? parseInt(Array.isArray(pageParam) ? pageParam[0] : pageParam, 10) : 1;

  // ページ番号のバリデーション
  const totalPages = Math.ceil(commonData.posts.length / POSTS_PER_PAGE);
  const validatedPage = Math.max(1, Math.min(currentPage, totalPages));

  const enhancedProps = {
    articles: commonData.posts,
    sidebarData: {
      trendingPosts: commonData.trendingPosts,
      tags: commonData.tags,
      series: commonData.series,
    },
    pagination: {
      totalItems: commonData.posts.length,
      itemsPerPage: POSTS_PER_PAGE,
      currentPage: validatedPage,
      totalPages,
    },
  };

  return <BlogPageClient {...enhancedProps} />;
}
