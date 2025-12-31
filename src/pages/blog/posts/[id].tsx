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
    return {
      notFound: true,
    };
  }
  return ArticlePageUsecase.getStaticProps({ params });
}