import { useState, useEffect } from 'react';

// タグデータの型
interface TagData {
  id: number;
  name: string;
  count: number;
  size: string;
  color: string;
}

interface UseTagsReturn {
  tags: TagData[];
  isLoading: boolean;
  error: Error | null;
}

/**
 * タグ一覧を取得するカスタムフック
 * APIルートを使用して取得します
 * @returns {UseTagsReturn} タグ一覧、ローディング状態、エラー情報
 */
export function useTags(): UseTagsReturn {
  const [tags, setTags] = useState<TagData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchTags() {
      try {
        const response = await fetch('/api/tags');
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched tags from API:', data);
        setTags(data);
      } catch (err) {
        console.error('Error fetching tags:', err);
        setError(err instanceof Error ? err : new Error('タグの取得に失敗しました'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchTags();
  }, []);

  return { tags, isLoading, error };
}
