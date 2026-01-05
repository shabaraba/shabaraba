import { Metadata } from 'next';
import { CommonDataService } from '../../../services/CommonDataService';
import TagPageClient from '../../../components/TagPageClient';

interface TagPageProps {
  params: Promise<{ tag: string }>;
  searchParams: { [key: string]: string | string[] | undefined };
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
  };
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  // 全データを取得
  const commonData = await CommonDataService.getAllData();

  // タグでフィルタリング
  const filteredArticles = commonData.posts.filter((post: any) =>
    post.tags?.some((tag: any) =>
      (typeof tag === 'string' ? tag : tag.name).toLowerCase() === decodedTag.toLowerCase()
    )
  );

  // ページネーション
  const pageParam = searchParams.page;
  const currentPage = pageParam ? parseInt(Array.isArray(pageParam) ? pageParam[0] : pageParam, 10) : 1;
  const totalPages = Math.ceil(filteredArticles.length / POSTS_PER_PAGE);
  const validatedPage = Math.max(1, Math.min(currentPage, totalPages));

  const enhancedProps = {
    articles: filteredArticles,
    sidebarData: {
      trendingPosts: commonData.trendingPosts,
      tags: commonData.tags,
      series: commonData.series,
    },
    pagination: {
      totalItems: filteredArticles.length,
      itemsPerPage: POSTS_PER_PAGE,
      currentPage: validatedPage,
      totalPages,
    },
    tagName: decodedTag,
  };

  return <TagPageClient {...enhancedProps} />;
}
