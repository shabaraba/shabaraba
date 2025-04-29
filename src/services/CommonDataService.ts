import { PostLogicNotionImpl } from 'application/modules/post/logic/PostLogicNotionImpl';
import { IPageHead, IPageTag } from 'core/types/NotionPageApiResponses';

// メモリ内キャッシュ
let cachedPostsData: {
  posts: IPageHead[];
  trendingPosts: IPageHead[];
  tags: any[];
  series: any[];
  lastFetched: number;
} | null = null;

// キャッシュ有効期間（ビルド中は長く保持）
const CACHE_TTL = process.env.NODE_ENV === 'production' ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000;

export class CommonDataService {
  /**
   * 全記事データとメタデータを取得（キャッシュ付き）
   */
  public static async getAllData() {
    // キャッシュが有効な場合はキャッシュを返す
    if (cachedPostsData && (Date.now() - cachedPostsData.lastFetched) < CACHE_TTL) {
      console.log('[CommonDataService] Using cached data');
      return cachedPostsData;
    }

    console.log('[CommonDataService] Fetching fresh data');
    const postLogic = new PostLogicNotionImpl();
    
    // 全記事データの取得
    const posts = await postLogic.getList();
    
    // 人気記事の取得
    const trendingPosts = await postLogic.getTrendingPosts();
    
    // タグの集計処理
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

    // サイズ閾値の定義
    const SIZE_THRESHOLDS = {
      large: 5,
      medium: 3,
    };

    // タグデータの整形
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
    }).sort((a, b) => b.count - a.count);
    
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
    const series = Object.entries(seriesGroups)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
    
    // キャッシュの更新
    cachedPostsData = {
      posts,
      trendingPosts,
      tags,
      series,
      lastFetched: Date.now()
    };
    
    return cachedPostsData;
  }
  
  /**
   * 特定のタグに関連する記事を取得
   */
  public static async getArticlesByTag(tagName: string) {
    const data = await this.getAllData();
    
    // タグに一致する記事をフィルタリング
    return data.posts.filter(post => {
      if (!post.tags) return false;
      return post.tags.some(tag => {
        // tagがオブジェクトであることを確認
        if (tag && typeof tag === 'object' && tag.name) {
          return tag.name.toLowerCase() === tagName.toLowerCase();
        }
        return false;
      });
    });
  }
  
  /**
   * サイドバーデータを取得
   */
  public static async getSidebarData() {
    const data = await this.getAllData();
    return {
      trendingPosts: data.trendingPosts,
      tags: data.tags,
      series: data.series
    };
  }
}