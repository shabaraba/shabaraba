import dynamic from 'next/dynamic';
import { GetStaticPropsContext, GetStaticPathsResult } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { ACTIVE_THEME } from '../../../config/themeSelector';
import { CommonDataService } from '../../../services/CommonDataService';

// 動的にテーマのホームページコンポーネントをインポート
const HomePage = dynamic(
  () =>
    import(`../../../themes/${ACTIVE_THEME}/pages/HomePage`).then(
      (mod) => mod.default
    ),
  {
    loading: () => null,
    ssr: true,
  }
);

// 1ページあたりの記事数
const POSTS_PER_PAGE = 10;

// ページパラメータの型定義
interface PageParams extends ParsedUrlQuery {
  page: string;
}

// ページプロップスの型定義
interface BlogPageProps {
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

/**
 * ブログページコンポーネント（2ページ目以降）
 * サーバーサイドレンダリング対応のページネーション
 */
function BlogPage({ articles, sidebarData, pagination }: BlogPageProps) {
  return <HomePage articles={articles} sidebarData={sidebarData} pagination={pagination} />;
}

export default BlogPage;

/**
 * 静的パスを生成するための関数
 * 全ページのパスを事前生成
 */
export async function getStaticPaths(): Promise<GetStaticPathsResult<PageParams>> {
  try {
    console.log('blog/page/[page].tsx - getStaticPaths: Generating page paths');

    // 全データを取得してページ数を計算
    const commonData = await CommonDataService.getAllData();
    const totalPages = Math.ceil(commonData.posts.length / POSTS_PER_PAGE);

    // 2ページ目以降のパスを生成（1ページ目は /blog に配置）
    const paths = [];
    for (let page = 2; page <= totalPages; page++) {
      paths.push({
        params: { page: page.toString() }
      });
    }

    console.log(`Generated ${paths.length} blog page paths (pages 2-${totalPages})`);

    return {
      paths,
      fallback: false, // 存在しないパスは404
    };
  } catch (error) {
    console.error('Error generating blog page paths:', error);
    return {
      paths: [],
      fallback: false,
    };
  }
}

/**
 * ページごとのデータを取得する関数
 */
export async function getStaticProps(context: GetStaticPropsContext<PageParams>) {
  const pageNumber = parseInt(context.params?.page ?? '1', 10);

  try {
    console.log(`blog/page/[page].tsx - getStaticProps: Fetching data for page ${pageNumber}`);

    // 全データを取得
    const commonData = await CommonDataService.getAllData();

    // ページネーション計算
    const startIndex = (pageNumber - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    const paginatedArticles = commonData.posts.slice(startIndex, endIndex);
    const totalPages = Math.ceil(commonData.posts.length / POSTS_PER_PAGE);

    // ページ番号の妥当性チェック
    if (pageNumber < 1 || pageNumber > totalPages) {
      return {
        notFound: true,
      };
    }

    console.log(`blog/page/[page].tsx - getStaticProps: Page ${pageNumber} has ${paginatedArticles.length} articles`);

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
          currentPage: pageNumber,
          totalPages: totalPages
        }
      }
    };
  } catch (error) {
    console.error(`Error in getStaticProps for page ${pageNumber}:`, error);
    return {
      props: {
        articles: [],
        sidebarData: {
          trendingPosts: [],
          tags: [],
          series: []
        },
        pagination: {
          totalItems: 0,
          itemsPerPage: POSTS_PER_PAGE,
          currentPage: pageNumber,
          totalPages: 0
        }
      }
    };
  }
}
