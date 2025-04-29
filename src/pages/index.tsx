import { ACTIVE_THEME } from '../lib/themeSelector';
import { ArticleServiceFactory } from '../core/factories/ArticleServiceFactory';
import { CommonDataService } from '../services/CommonDataService';

// 動的にテーマのホームページコンポーネントをインポート
const HomePage = require(`../themes/${ACTIVE_THEME}/pages/HomePage`).default;

export default HomePage;

// getStaticProps関数でデータを取得
export async function getStaticProps() {
  try {
    console.log('index.tsx - getStaticProps: Fetching data using CommonDataService');
    
    // CommonDataServiceを使用してデータ取得（キャッシュ機構が有効）
    const commonData = await CommonDataService.getAllData();
    
    console.log('index.tsx - getStaticProps: Data fetched successfully');
    console.log(`- Articles: ${commonData.posts.length}`);
    console.log(`- Trending posts: ${commonData.trendingPosts.length}`);
    console.log(`- Tags: ${commonData.tags.length}`);
    console.log(`- Series: ${commonData.series.length}`);
    
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
