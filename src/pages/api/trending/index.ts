import type { NextApiRequest, NextApiResponse } from 'next';
import { PostLogicNotionImpl } from 'application/modules/post/logic/PostLogicNotionImpl';
import { IPageHead } from 'core/types/NotionPageApiResponses';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IPageHead[] | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const postLogic = new PostLogicNotionImpl();
    const posts = await postLogic.getTrendingPosts();
    
    // デバッグログ
    console.log('API: Trending posts fetched:', posts.length);
    
    return res.status(200).json(posts);
  } catch (error) {
    console.error('API: Error fetching trending posts:', error);
    return res.status(500).json({ error: 'Failed to fetch trending posts' });
  }
}
