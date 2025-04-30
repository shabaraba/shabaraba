import React from 'react';
import Link from 'next/link';
import styles from './SeriesList.module.css';
import { useSidebarData } from 'contexts/SidebarContext';

/**
 * シリーズ一覧コンポーネント
 * SidebarContextからシリーズデータを表示します
 */
export default function SeriesList() {
  const { series, isLoading } = useSidebarData();
  
  if (isLoading) {
    return <div className={styles.loading}>読み込み中...</div>;
  }
  
  if (series.length === 0) {
    return <div className={styles.noSeries}>シリーズはありません</div>;
  }

  return (
    <div className={styles.seriesList}>
      <ul className={styles.list}>
        {series.map((item) => (
          <li key={item.name} className={styles.item}>
            <Link href={`/series/${encodeURIComponent(item.name.toLowerCase())}`} className={styles.link}>
              <span className={styles.name}>{item.name}</span>
              <span className={styles.count}>{item.count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
