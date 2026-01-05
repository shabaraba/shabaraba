'use client';

import React from 'react';
import Link from 'next/link';
import styles from './SeriesList.module.css';
import { SeriesData } from 'contexts/SidebarContext';

interface SeriesListProps {
  series?: SeriesData[];
}

export default function SeriesList({ series = [] }: SeriesListProps) {
  if (series.length === 0) {
    return <div className={styles.noSeries}>シリーズはありません</div>;
  }

  return (
    <div className={styles.seriesList}>
      <ul className={styles.list}>
        {series.map((item) => (
          <li key={item.name} className={styles.item}>
            <Link href={`/series/${encodeURIComponent(item.name.toLowerCase())}`} prefetch={false} className={styles.link}>
              <span className={styles.name}>{item.name}</span>
              <span className={styles.count}>{item.count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
