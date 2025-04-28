import { useState, useEffect } from 'react';
import { IPageHead } from 'core/types/NotionPageApiResponses';
import { PostLogicNotionImpl } from 'application/modules/post/logic/PostLogicNotionImpl';

interface UsePostListReturn {
  posts: IPageHead[];
  isLoading: boolean;
  error: Error | null;
}

/**
 * 記事一覧を取得するカスタムフック
 * @returns {UsePostListReturn} 記事一覧、ローディング状態、エラー情報
 */
export function usePostList(): UsePostListReturn {
  const [posts, setPosts] = useState<IPageHead[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const postLogic = new PostLogicNotionImpl();
        const postList = await postLogic.getList();
        console.log('Fetched posts:', postList);
        
        // トレンド記事とシリーズの確認
        const trendingPosts = postList.filter(post => post.trend === true);
        console.log('Trending posts:', trendingPosts);
        
        const postsWithSeries = postList.filter(post => post.series);
        console.log('Posts with series:', postsWithSeries);
        
        // タグのログ
        const allTags = [];
        postList.forEach(post => {
          if (post.tags) {
            allTags.push(...post.tags);
          }
        });
        console.log('All tags:', allTags);
        
        setPosts(postList);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError(err instanceof Error ? err : new Error('記事の取得に失敗しました'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchPosts();
  }, []);

  return { posts, isLoading, error };
}
