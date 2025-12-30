import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { ACTIVE_THEME } from '../../config/themeSelector';
import { CommonDataService } from '../../services/CommonDataService';

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

// クライアントサイドでページネーションを行うラッパーコンポーネント
function BlogPageWrapper(props) {
  const router = useRouter();
  
  // URLからページ番号を取得（デフォルトは1ページ目）
  const page = router.query.page ? parseInt(router.query.page as string, 10) : 1;
  
  // 表示すべき記事を計算
  const startIndex = (page - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const paginatedArticles = props.articles.slice(startIndex, endIndex);
  
  // 総ページ数を計算
  const totalPages = Math.ceil(props.articles.length / POSTS_PER_PAGE);
  
  // ページネーション情報を追加
  const enhancedProps = {
    ...props,
    articles: paginatedArticles,
    pagination: {
      totalItems: props.articles.length,
      itemsPerPage: POSTS_PER_PAGE,
      currentPage: page,
      totalPages: totalPages
    }
  };
  return <HomePage {...enhancedProps} />;
}

export default BlogPageWrapper;

/**
 * 全記事データを一度に取得する関数
 * クライアントサイドでのページネーションのため、全データを取得
 */
export async function getStaticProps() {
  try {
    console.log('blog/index.tsx - getStaticProps: Fetching all data for client-side pagination');
    
    // 全データを一度に取得
    const commonData = await CommonDataService.getAllData();
    
    console.log('blog/index.tsx - getStaticProps: Data fetched successfully');
    console.log(`- Total articles: ${commonData.posts.length}`);
    
    return {
      props: {
        articles: commonData.posts,
        sidebarData: {
          trendingPosts: commonData.trendingPosts,
          tags: commonData.tags,
          series: commonData.series
        }
      }
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      props: {
        articles: [],
        sidebarData: {
          trendingPosts: [],
          tags: [],
          series: []
        }
      }
    };
  }
}