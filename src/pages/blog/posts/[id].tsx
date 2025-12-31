import { ArticlePageUsecase } from '../../../application/usecases/ArticlePageUsecase';
import ArticlePage from '../../../themes/theme2/pages/ArticlePage';

// ページコンポーネントをエクスポート
export default ArticlePage;

// 静的パスを生成するための関数
export async function getStaticPaths() {
  return ArticlePageUsecase.getStaticPaths();
}

// 静的ページ生成のためのデータ取得関数
export async function getStaticProps({ params }) {
  if (!params?.id) {
    // 静的エクスポートではnotFoundは使用不可
    return {
      props: {
        article: null,
        sidebarData: { trendingPosts: [], tags: [], series: [] }
      }
    };
  }
  return ArticlePageUsecase.getStaticProps({ params });
}