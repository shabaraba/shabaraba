import { Metadata } from 'next';
import { CommonDataService } from '../../../services/CommonDataService';
import HomePage from '../../../components/pages/HomePage';

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

const POSTS_PER_PAGE = 10;

// 静的パスを生成
export async function generateStaticParams() {
  try {
    const commonData = await CommonDataService.getAllData();
    return commonData.tags.map((tag) => ({
      tag: tag.name.toLowerCase(),
    }));
  } catch (error) {
    console.error('Error generating static params for tags:', error);
    return [];
  }
}

// メタデータ生成
export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  return {
    title: `タグ: ${decodedTag}`,
    description: `「${decodedTag}」に関連する記事一覧`,
    alternates: {
      canonical: `/tags/${encodeURIComponent(decodedTag.toLowerCase())}`,
    },
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  const data = await CommonDataService.getPaginatedArticlesByTag(
    decodedTag,
    1,
    POSTS_PER_PAGE
  );

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
      tagName={decodedTag}
    />
  );
}
