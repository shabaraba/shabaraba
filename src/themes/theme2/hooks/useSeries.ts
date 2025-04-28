import { useState, useEffect } from 'react';

// シリーズデータの型
interface SeriesData {
  name: string;
  count: number;
}

interface UseSeriesReturn {
  seriesList: SeriesData[];
  isLoading: boolean;
  error: Error | null;
}

/**
 * シリーズ一覧を取得するカスタムフック
 * APIルートを使用して取得します
 * @returns {UseSeriesReturn} シリーズ一覧、ローディング状態、エラー情報
 */
export function useSeries(): UseSeriesReturn {
  const [seriesList, setSeriesList] = useState<SeriesData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchSeries() {
      try {
        const response = await fetch('/api/series');
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched series from API:', data);
        setSeriesList(data);
      } catch (err) {
        console.error('Error fetching series:', err);
        setError(err instanceof Error ? err : new Error('シリーズの取得に失敗しました'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchSeries();
  }, []);

  return { seriesList, isLoading, error };
}
