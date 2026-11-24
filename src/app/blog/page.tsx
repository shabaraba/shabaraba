import { Metadata } from 'next';
import { CommonDataService } from '../../services/CommonDataService';
import HomePage from '../../components/pages/HomePage';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Technical blog posts and articles',
  alternates: {
    canonical: '/blog',
  },
};

const POSTS_PER_PAGE = 10;

export default async function BlogPage() {
  const data = await CommonDataService.getPaginatedArticles(1, POSTS_PER_PAGE);

  return (
    <HomePage
      articles={data.items}
      sidebarData={data.sidebarData}
      pagination={{
        totalItems: data.totalItems,
        itemsPerPage: data.pageSize,
        currentPage: 1,
        totalPages: data.totalPages,
      }}
    />
  );
}
