import { ACTIVE_THEME } from '../../lib/themeSelector';
import { ArticleServiceFactory } from '../../core/factories/ArticleServiceFactory';

// 動的にテーマの記事詳細ページコンポーネントをインポート
const ArticlePage = require(`../../themes/${ACTIVE_THEME}/pages/ArticlePage`).default;

// ページコンポーネントをエクスポート
export default ArticlePage;

// 静的パスを生成するための関数
export async function getStaticPaths() {
  try {
    const articleService = ArticleServiceFactory.createArticleService();
    const slugs = await articleService.getArticleSlugs();
    
    const paths = slugs.map((slug) => ({
      params: { id: slug },
    }));
    
    return {
      paths,
      fallback: false, // blockingから変更。exportモードではfalseのみサポート
    };
  } catch (error) {
    console.error('Error generating static paths:', error);
    return {
      paths: [],
      fallback: false, // blockingから変更
    };
  }
}

// 静的ページ生成のためのデータ取得関数
export async function getStaticProps({ params }) {
  if (!params?.id) {
    return {
      notFound: true,
    };
  }

  try {
    const articleService = ArticleServiceFactory.createArticleService();
    const article = await articleService.getArticleBySlug(params.id);
    
    return {
      props: {
        article,
      },
    };
  } catch (error) {
    console.error(`Error fetching article with slug "${params.id}":`, error);
    return {
      notFound: true,
    };
  }
}