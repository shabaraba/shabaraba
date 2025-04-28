import React from 'react';
import Link from 'next/link';
import styles from './SeriesList.module.css';
import { useSeries } from 'themes/theme2/hooks/useSeries';

/**
 * シリーズ一覧コンポーネント
 * Notionから取得したシリーズの一覧を表示します
 */
export default function SeriesList() {
  const { seriesList, isLoading, error } = useSeries();
  
  if (error) {
    console.error('Error in SeriesList:', error);
  }

  if (isLoading) {
    return <div className={styles.loading}>読み込み中...</div>;
  }
  
  if (seriesList.length === 0) {
    return <div className={styles.noSeries}>シリーズはありません</div>;
  }

  return (
    <div className={styles.seriesList}>
      <ul className={styles.list}>
        {seriesList.map((series) => (
          <li key={series.name} className={styles.item}>
            <Link href={`/series/${encodeURIComponent(series.name.toLowerCase())}`} className={styles.link}>
              <span className={styles.name}>{series.name}</span>
              <span className={styles.count}>{series.count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
