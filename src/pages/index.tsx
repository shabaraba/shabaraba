import { ACTIVE_THEME } from '../lib/themeSelector';
import { ArticleServiceFactory } from '../core/factories/ArticleServiceFactory';

// 動的にテーマのホームページコンポーネントをインポート
const HomePage = require(`../themes/${ACTIVE_THEME}/pages/HomePage`).default;

export default HomePage;

// getStaticProps関数でデータを取得
export async function getStaticProps() {
  try {
    const articleService = ArticleServiceFactory.createArticleService();
    const articles = await articleService.getArticleList();
    
    return {
      props: {
        articles,
      },
    };
  } catch (error) {
    console.error('Error fetching articles:', error);
    return {
      props: {
        articles: [],
      },
    };
  }
}
