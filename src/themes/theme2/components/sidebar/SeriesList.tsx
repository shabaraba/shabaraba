import React from 'react';
import Link from 'next/link';
import styles from './SeriesList.module.css';
import { usePostList } from 'themes/theme2/hooks/usePostList';

/**
 * シリーズ一覧コンポーネント
 * Notionから取得したシリーズの一覧を表示します
 */
export default function SeriesList() {
  const { posts, isLoading } = usePostList();
  
  // シリーズごとにグループ化
  const seriesGroups: { [key: string]: number } = {};
  
  posts.forEach((post) => {
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

  if (isLoading) {
    return <div className={styles.loading}>読み込み中...</div>;
  }
  
  if (seriesData.length === 0) {
    return <div className={styles.noSeries}>シリーズはありません</div>;
  }

  return (
    <div className={styles.seriesList}>
      <ul className={styles.list}>
        {seriesData.map((series) => (
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
