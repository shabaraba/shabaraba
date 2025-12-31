import dynamic from 'next/dynamic';
import { InferGetStaticPropsType } from 'next';
import { ACTIVE_THEME } from '../../config/themeSelector';
import { CommonDataService } from '../../services/CommonDataService';
import { IPageHead } from '../../core/types/NotionPageApiResponses';

// 動的にテーマのホームページコンポーネントをインポート
const HomePage = dynamic(
  () =>
    import(`../../themes/${ACTIVE_THEME}/pages/HomePage`).then(
      (mod) => mod.default
    ),
  {
    loading: () => null,
    ssr: true,
  }
);

// 1ページあたりの記事数
const POSTS_PER_PAGE = 10;

type Props = InferGetStaticPropsType<typeof getStaticProps>;

/**
 * ブログトップページ（1ページ目）
 * サーバーサイドレンダリング対応
 */
function BlogIndexPage({ articles, sidebarData, pagination }: Props) {
  return <HomePage articles={articles} sidebarData={sidebarData} pagination={pagination} />;
}

export default BlogIndexPage;

/**
 * 1ページ目のデータを取得する関数
 * サーバーサイドレンダリング対応のページネーション
 */
export async function getStaticProps() {
  try {
    console.log('blog/index.tsx - getStaticProps: Fetching data for page 1');

    // 全データを取得
    const commonData = await CommonDataService.getAllData();

    // 1ページ目のデータを計算
    const paginatedArticles = commonData.posts.slice(0, POSTS_PER_PAGE);
    const totalPages = Math.ceil(commonData.posts.length / POSTS_PER_PAGE);

    console.log('blog/index.tsx - getStaticProps: Data fetched successfully');
    console.log(`- Total articles: ${commonData.posts.length}`);
    console.log(`- Page 1 articles: ${paginatedArticles.length}`);
    console.log(`- Total pages: ${totalPages}`);

    return {
      props: {
        articles: paginatedArticles,
        sidebarData: {
          trendingPosts: commonData.trendingPosts,
          tags: commonData.tags,
          series: commonData.series
        },
        pagination: {
          totalItems: commonData.posts.length,
          itemsPerPage: POSTS_PER_PAGE,
          currentPage: 1,
          totalPages: totalPages
        }
      }
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      notFound: true,
    };
  }
}