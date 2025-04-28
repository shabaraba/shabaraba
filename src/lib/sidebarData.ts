import { PostLogicNotionImpl } from 'application/modules/post/logic/PostLogicNotionImpl';
import { IPageHead, IPageTag } from 'core/types/NotionPageApiResponses';
import { TagData, SeriesData } from 'contexts/SidebarContext';

// タグのサイズ判定用閾値
const SIZE_THRESHOLDS = {
  large: 5,  // 5回以上使われているタグは大きく表示
  medium: 3, // 3-4回使われているタグは中くらいに表示
  small: 0   // それ以外は小さく表示
};

/**
 * サイドバーデータを取得する関数
 * SSG時に使用します
 */
export async function getSidebarData() {
  try {
    const postLogic = new PostLogicNotionImpl();
    
    // すべての記事を取得
    const allPosts = await postLogic.getList();
    
    // トレンド記事をAPIから直接取得
    const trendingPosts = await postLogic.getTrendingPosts();
    console.log('SSG: Trending posts count:', trendingPosts.length);
    
    // タグを集計
    const tagCounts: { [key: string]: { count: number, tag: IPageTag } } = {};
    allPosts.forEach(post => {
      if (post.tags) {
        post.tags.forEach(tag => {
          if (!tagCounts[tag.name]) {
            tagCounts[tag.name] = { count: 0, tag };
          }
          tagCounts[tag.name].count += 1;
        });
      }
    });
    
    // タグデータに変換
    const tags: TagData[] = Object.values(tagCounts).map(({ count, tag }) => {
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
    console.log('SSG: Tags:', tags.length);
    
    // シリーズを集計
    const seriesGroups: { [key: string]: number } = {};
    allPosts.forEach(post => {
      if (post.series) {
        if (!seriesGroups[post.series]) {
          seriesGroups[post.series] = 0;
        }
        seriesGroups[post.series] += 1;
      }
    });
    
    // シリーズデータに変換
    const series: SeriesData[] = Object.entries(seriesGroups)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
    console.log('SSG: Series:', series.length);
    
    return {
      trendingPosts,
      tags,
      series
    };
  } catch (error) {
    console.error('Error fetching sidebar data:', error);
    return {
      trendingPosts: [],
      tags: [],
      series: []
    };
  }
}
