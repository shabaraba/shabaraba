import { Metadata } from 'next';
import { CommonDataService } from '../../../../services/CommonDataService';
import HomePage from '../../../../components/pages/HomePage';

const POSTS_PER_PAGE = 10;

interface BlogPageProps {
  params: Promise<{ page: string }>;
}

export async function generateStaticParams() {
  const data = await CommonDataService.getAllData();
  const totalPages = Math.ceil(data.posts.length / POSTS_PER_PAGE);

  return Array.from({ length: totalPages }, (_, index) => ({
    page: String(index + 1),
  }));
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { page } = await params;
  const canonical = page === '1' ? '/blog' : `/blog/page/${page}`;

  return {
    title: page === '1' ? 'Blog' : `Blog - ${page}ページ目`,
    description: 'Technical blog posts and articles',
    alternates: {
      canonical,
    },
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { page } = await params;
  const currentPage = parseInt(page, 10);

  const data = await CommonDataService.getPaginatedArticles(currentPage, POSTS_PER_PAGE);

  return (
    <HomePage
      articles={data.items}
      sidebarData={data.sidebarData}
      pagination={{
        totalItems: data.totalItems,
        itemsPerPage: data.pageSize,
        currentPage,
        totalPages: data.totalPages,
      }}
    />
  );
}
