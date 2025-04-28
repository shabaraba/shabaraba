import type { NextApiRequest, NextApiResponse } from 'next';
import { PostLogicNotionImpl } from 'application/modules/post/logic/PostLogicNotionImpl';
import { IPageTag } from 'core/types/NotionPageApiResponses';

// タグデータを集計した結果の型
interface TagData {
  id: number;
  name: string;
  count: number;
  size: string;
  color: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TagData[] | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const postLogic = new PostLogicNotionImpl();
    const posts = await postLogic.getList();
    
    // タグの集計
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
    const tagData = Object.values(tagCounts).map(({ count, tag }) => {
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
    
    console.log('API: Tags fetched:', tagData.length);
    
    return res.status(200).json(tagData);
  } catch (error) {
    console.error('API: Error fetching tags:', error);
    return res.status(500).json({ error: 'Failed to fetch tags' });
  }
}
