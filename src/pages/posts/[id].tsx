import { ACTIVE_THEME } from '../../lib/themeSelector';
import { ArticleServiceFactory } from '../../core/factories/ArticleServiceFactory';
import { ArticlePageUsecase } from 'application/usecases/ArticlePageUsecase';
import dynamic from 'next/dynamic';

// 動的にテーマの記事詳細ページコンポーネントをインポート
const ArticlePage = dynamic(() =>
  import(`../../themes/${ACTIVE_THEME}/pages/ArticlePage`).then(mod => mod.default)
);

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
