import React from 'react';
import styles from './Sidebar.module.css';
import AuthorBox from './AuthorBox';
import PopularArticles from './PopularArticles';
import TagCloud from './TagCloud';
import SeriesList from './SeriesList';
import { useConfig } from '../../../../lib/useConfig';

/**
 * サイドバーコンポーネント
 */
export default function Sidebar() {
  // 設定から文字列を取得
  const { getSetting } = useConfig();
  const popularArticlesTitle = getSetting('sidebar.popular_articles_title', '人気記事');
  const seriesTitle = getSetting('sidebar.series_title', 'シリーズ');
  const tagsTitle = getSetting('sidebar.tags_title', 'タグ');
  
  return (
    <div className={styles.sidebar}>
      <AuthorBox />
      <div className={styles.sidebarSection}>
        <h3 className={styles.sidebarTitle}>{popularArticlesTitle}</h3>
        <PopularArticles />
      </div>
      <div className={styles.sidebarSection}>
        <h3 className={styles.sidebarTitle}>{seriesTitle}</h3>
        <SeriesList />
      </div>
      <div className={styles.sidebarSection}>
        <h3 className={styles.sidebarTitle}>{tagsTitle}</h3>
        <TagCloud />
      </div>
    </div>
  );
}
