import type { NextApiRequest, NextApiResponse } from 'next';
import { PostLogicNotionImpl } from 'application/modules/post/logic/PostLogicNotionImpl';

// シリーズデータの型
interface SeriesData {
  name: string;
  count: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SeriesData[] | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const postLogic = new PostLogicNotionImpl();
    const posts = await postLogic.getList();
    
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
    const seriesData = Object.entries(seriesGroups)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count); // 記事数の多い順にソート
    
    console.log('API: Series fetched:', seriesData.length);
    
    return res.status(200).json(seriesData);
  } catch (error) {
    console.error('API: Error fetching series:', error);
    return res.status(500).json({ error: 'Failed to fetch series' });
  }
}
