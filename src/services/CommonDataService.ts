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

// ページネーション用の型定義
export interface PaginatedData {
  items: IPageHead[];
  totalItems: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  sidebarData?: {
    trendingPosts: IPageHead[];
    tags: any[];
    series: any[];
  }
}

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
    
    // 記事データにcoverImageプロパティを追加
    const processedPosts = posts.map(post => {
      // コンソールにカバー情報をログ
      console.log(`Processing post ${post.title}, cover:`, post.cover);
      
      // post.coverからcoverImageプロパティを生成
      let coverImage = null;
      if (post.cover) {
        if (post.cover.type === 'external') {
          coverImage = post.cover.external.url;
        } else if (post.cover.type === 'file') {
          coverImage = post.cover.file.url;
        }
      }
      
      // 元のポストにcoverImageプロパティを追加（タイプ互換性のため）
      return {
        ...post,
        coverImage: coverImage || null
      };
    });
    
    // 人気記事の取得
    let trendingPosts = await postLogic.getTrendingPosts();
    console.log(`[CommonDataService] Fetched ${trendingPosts.length} trending posts from Notion`);
    
    // もしトレンド記事が0件の場合、代替として最新の記事を表示する
    if (trendingPosts.length === 0) {
      console.log('[CommonDataService] No trending posts found, using recent posts as fallback');
      // 最新の記事を最大5件取得（既に日付順でソート済み）
      trendingPosts = processedPosts.slice(0, 5);
    }
    
    // 人気記事にもcoverImageプロパティを追加
    const processedTrendingPosts = trendingPosts.map(post => {
      let coverImage = null;
      if (post.cover) {
        if (post.cover.type === 'external') {
          coverImage = post.cover.external.url;
        } else if (post.cover.type === 'file') {
          coverImage = post.cover.file.url;
        }
      }
      
      return {
        ...post,
        coverImage: coverImage || null
      };
    });
    
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
      posts: processedPosts,
      trendingPosts: processedTrendingPosts,
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

  /**
   * ページネーション付きの記事一覧を取得（SSG対応）
   * @param page ページ番号（1から開始）
   * @param pageSize 1ページあたりの記事数
   * @returns ページネーション情報を含む記事データ
   */
  public static async getPaginatedArticles(page: number = 1, pageSize: number = 10): Promise<PaginatedData> {
    // キャッシュから全記事データを取得
    const data = await this.getAllData();
    
    // 全記事数の取得
    const totalItems = data.posts.length;
    
    // 合計ページ数の計算
    const totalPages = Math.ceil(totalItems / pageSize);
    
    // 開始と終了インデックスの計算（0から始まるインデックスに調整）
    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalItems);
    
    // ページに該当する記事を抽出
    const paginatedItems = data.posts.slice(startIndex, endIndex);
    
    // ページネーション情報を含むレスポンスを生成
    return {
      items: paginatedItems,
      totalItems,
      pageSize,
      currentPage: page,
      totalPages,
      sidebarData: {
        trendingPosts: data.trendingPosts,
        tags: data.tags,
        series: data.series
      }
    };
  }

  /**
   * 特定のタグに関連する記事をページネーション付きで取得（SSG対応）
   * @param tagName タグ名
   * @param page ページ番号（1から開始）
   * @param pageSize 1ページあたりの記事数
   * @returns ページネーション情報を含む記事データ
   */
  public static async getPaginatedArticlesByTag(tagName: string, page: number = 1, pageSize: number = 10): Promise<PaginatedData> {
    // タグに一致する全記事を取得
    const filteredPosts = await this.getArticlesByTag(tagName);
    
    // 全記事数の取得
    const totalItems = filteredPosts.length;
    
    // 合計ページ数の計算
    const totalPages = Math.ceil(totalItems / pageSize);
    
    // 開始と終了インデックスの計算（0から始まるインデックスに調整）
    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalItems);
    
    // ページに該当する記事を抽出
    const paginatedItems = filteredPosts.slice(startIndex, endIndex);
    
    // サイドバーデータを取得
    const sidebarData = await this.getSidebarData();
    
    // ページネーション情報を含むレスポンスを生成
    return {
      items: paginatedItems,
      totalItems,
      pageSize,
      currentPage: page,
      totalPages,
      sidebarData
    };
  }

  /**
   * 最新記事を指定件数取得（ポートフォリオサイト用）
   * @param limit 取得件数（デフォルト5件）
   * @returns 最新記事の配列
   */
  public static async getLatestArticles(limit: number = 5) {
    const data = await this.getAllData();
    return data.posts.slice(0, limit);
  }
}