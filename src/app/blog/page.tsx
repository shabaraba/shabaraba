import { Metadata } from 'next';
import { CommonDataService } from '../../services/CommonDataService';
import BlogPageClient from '../../components/BlogPageClient';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Technical blog posts and articles',
};

const POSTS_PER_PAGE = 10;

export default async function BlogPage() {
  // 全データを一度に取得
  const commonData = await CommonDataService.getAllData();

  // 最初のページのデータを返し、ページネーションはクライアントサイドで処理
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
      currentPage: 1,
      totalPages: Math.ceil(commonData.posts.length / POSTS_PER_PAGE),
    },
  };

  return <BlogPageClient {...enhancedProps} />;
}
