import { Metadata } from 'next';
import { CommonDataService } from '../../../../../services/CommonDataService';
import HomePage from '../../../../../components/pages/HomePage';

const POSTS_PER_PAGE = 10;

interface TagPageProps {
  params: Promise<{ tag: string; page: string }>;
}

export async function generateStaticParams() {
  const data = await CommonDataService.getAllData();
  const params: { tag: string; page: string }[] = [];

  for (const tag of data.tags) {
    const posts = await CommonDataService.getArticlesByTag(tag.name);
    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

    for (let page = 1; page <= totalPages; page++) {
      params.push({
        tag: tag.name.toLowerCase(),
        page: String(page),
      });
    }
  }

  return params;
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag, page } = await params;
  const decodedTag = decodeURIComponent(tag);
  const encodedTag = encodeURIComponent(decodedTag.toLowerCase());
  const canonical = page === '1'
    ? `/tags/${encodedTag}`
    : `/tags/${encodedTag}/page/${page}`;

  return {
    title: page === '1'
      ? `タグ: ${decodedTag}`
      : `タグ: ${decodedTag} - ${page}ページ目`,
    description: `「${decodedTag}」に関連する記事一覧`,
    alternates: {
      canonical,
    },
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag, page } = await params;
  const decodedTag = decodeURIComponent(tag);
  const currentPage = parseInt(page, 10);

  const data = await CommonDataService.getPaginatedArticlesByTag(
    decodedTag,
    currentPage,
    POSTS_PER_PAGE
  );

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
      tagName={decodedTag}
    />
  );
}
