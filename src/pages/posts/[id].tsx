import { ACTIVE_THEME } from '../../lib/themeSelector';
import { ArticleServiceFactory } from '../../core/factories/ArticleServiceFactory';
import { ArticlePageUsecase } from 'application/usecases/ArticlePageUsecase';

// 動的にテーマの記事詳細ページコンポーネントをインポート
const ArticlePage = require(`../../themes/${ACTIVE_THEME}/pages/ArticlePage`).default;

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
