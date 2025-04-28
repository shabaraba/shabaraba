import { useState, useEffect } from 'react';
import { IPageHead } from 'core/types/NotionPageApiResponses';

interface UseTrendingPostsReturn {
  trendingPosts: IPageHead[];
  isLoading: boolean;
  error: Error | null;
}

/**
 * トレンド記事一覧を取得するカスタムフック
 * APIルートを使用して取得します
 * @returns {UseTrendingPostsReturn} トレンド記事一覧、ローディング状態、エラー情報
 */
export function useTrendingPosts(): UseTrendingPostsReturn {
  const [trendingPosts, setTrendingPosts] = useState<IPageHead[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchTrendingPosts() {
      try {
        const response = await fetch('/api/trending');
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched trending posts from API:', data);
        setTrendingPosts(data);
      } catch (err) {
        console.error('Error fetching trending posts:', err);
        setError(err instanceof Error ? err : new Error('トレンド記事の取得に失敗しました'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchTrendingPosts();
  }, []);

  return { trendingPosts, isLoading, error };
}
