import { GetStaticPropsContext, GetStaticPathsResult } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { ACTIVE_THEME } from '../lib/themeSelector';
import { CommonDataService } from '../services/CommonDataService';

// 動的にテーマのホームページコンポーネントをインポート
const HomePage = require(`../themes/${ACTIVE_THEME}/pages/HomePage`).default;

// 1ページあたりの記事数
const POSTS_PER_PAGE = 10;

// ページパラメータの型定義
interface PageParams extends ParsedUrlQuery {
  page?: string;
}

export default HomePage;

/**
 * 静的ページ生成時のパスを定義
 * ページネーション用の複数のページパスを生成する
 */
export async function getStaticPaths(): Promise<GetStaticPathsResult<PageParams>> {
  try {
    // CommonDataServiceからデータを取得してページ数を計算
    const commonData = await CommonDataService.getAllData();
    const totalArticles = commonData.posts.length;
    const totalPages = Math.ceil(totalArticles / POSTS_PER_PAGE);
    
    console.log(`index.tsx - getStaticPaths: Creating paths for ${totalPages} pages`);

    // ページ数分のパスを生成（1ページ目は /、2ページ目以降は /page/2, /page/3, ...）
    const paths = [];
    
    // 1ページ目（ルートパス）
    paths.push({
      params: {}  // ルートページなのでパラメータなし
    });
    
    // 2ページ目以降
    for (let page = 2; page <= totalPages; page++) {
      paths.push({
        params: { page: page.toString() }
      });
    }
    
    return {
      paths,
      // fallback: falseの場合、存在しないページは404エラーになる
      fallback: false
    };
  } catch (error) {
    console.error('Error in getStaticPaths:', error);
    // エラーが発生した場合は1ページ目のみ生成
    return {
      paths: [{ params: {} }],
      fallback: false
    };
  }
}

/**
 * 各ページのデータを取得する関数
 * ページごとに異なる記事セットをプリレンダリングする
 */
export async function getStaticProps(context: GetStaticPropsContext<PageParams>) {
  try {
    // URLパラメータからページ番号を取得（デフォルトは1）
    const page = context.params?.page ? parseInt(context.params.page) : 1;
    
    console.log(`index.tsx - getStaticProps: Fetching data for page ${page}`);
    
    // ページネーション対応のデータ取得メソッドを使用
    const paginatedData = await CommonDataService.getPaginatedArticles(page, POSTS_PER_PAGE);
    
    console.log(`index.tsx - getStaticProps: Data fetched successfully for page ${page}`);
    console.log(`- Page articles: ${paginatedData.items.length}`);
    console.log(`- Total articles: ${paginatedData.totalItems}`);
    console.log(`- Total pages: ${paginatedData.totalPages}`);
    
    return {
      props: {
        articles: paginatedData.items,
        sidebarData: paginatedData.sidebarData,
        pagination: {
          totalItems: paginatedData.totalItems,
          itemsPerPage: paginatedData.pageSize,
          currentPage: paginatedData.currentPage,
          totalPages: paginatedData.totalPages
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
        },
        pagination: {
          totalItems: 0,
          itemsPerPage: POSTS_PER_PAGE,
          currentPage: 1,
          totalPages: 0
        }
      }
    };
  }
}
