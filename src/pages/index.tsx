import { ACTIVE_THEME } from '../lib/themeSelector';
import { ArticleServiceFactory } from '../core/factories/ArticleServiceFactory';
import { PostLogicNotionImpl } from 'application/modules/post/logic/PostLogicNotionImpl';
import { IPageTag } from 'core/types/NotionPageApiResponses';

// 動的にテーマのホームページコンポーネントをインポート
const HomePage = require(`../themes/${ACTIVE_THEME}/pages/HomePage`).default;

export default HomePage;

// getStaticProps関数でデータを取得
export async function getStaticProps() {
  try {
    const articleService = ArticleServiceFactory.createArticleService();
    const articles = await articleService.getArticleList();
    
    // サイドバーデータの取得（PostLogicNotionImplを使用）
    const postLogic = new PostLogicNotionImpl();
    
    // 人気記事の取得
    const trendingPosts = await postLogic.getTrendingPosts();
    console.log('getStaticProps - Trending posts:', trendingPosts.length);
    
    // タグの集計処理
    const posts = await postLogic.getList();
    const tagCounts: { [key: string]: { count: number, tag: IPageTag } } = {};
    
    posts.forEach(post => {
      if (post.tags) {
        post.tags.forEach(tag => {
          if (!tagCounts[tag.name]) {
            tagCounts[tag.name] = { count: 0, tag };
          }
          tagCounts[tag.name].count += 1;
        });
      }
    });

    // タグのサイズ判定用閾値
    const SIZE_THRESHOLDS = {
      large: 5,  // 5回以上使われているタグは大きく表示
      medium: 3, // 3-4回使われているタグは中くらいに表示
    };

    // 表示用のタグデータに変換
    const tags = Object.values(tagCounts).map(({ count, tag }) => {
      let size = 'small';
      if (count >= SIZE_THRESHOLDS.large) {
        size = 'large';
      } else if (count >= SIZE_THRESHOLDS.medium) {
        size = 'medium';
      }
      
      return {
        id: tag.id,
        name: tag.name,
        count,
        size,
        color: tag.color
      };
    }).sort((a, b) => b.count - a.count); // 使用頻度順にソート
    
    console.log('getStaticProps - Tags:', tags.length);
    
    // シリーズの集計
    const seriesGroups: { [key: string]: number } = {};
    
    posts.forEach(post => {
      if (post.series) {
        if (!seriesGroups[post.series]) {
          seriesGroups[post.series] = 0;
        }
        seriesGroups[post.series] += 1;
      }
    });

    // 表示用のシリーズデータに変換
    const series = Object.entries(seriesGroups)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count); // 記事数の多い順にソート
    
    console.log('getStaticProps - Series:', series.length);
    
    return {
      props: {
        articles,
        sidebarData: {
          trendingPosts,
          tags,
          series
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
