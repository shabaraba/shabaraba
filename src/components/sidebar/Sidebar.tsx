'use client';

import React from 'react';
import styles from './Sidebar.module.css';
import AuthorBox from './AuthorBox';
import PopularArticles from './PopularArticles';
import TagCloud from './TagCloud';
import SeriesList from './SeriesList';
import { useConfig } from '../../config/useConfig';
import { IPageHead } from 'core/types/NotionPageApiResponses';
import { TagData, SeriesData } from 'contexts/SidebarContext';

interface SidebarProps {
  trendingPosts?: IPageHead[];
  tags?: TagData[];
  series?: SeriesData[];
}

export default function Sidebar({ trendingPosts = [], tags = [], series = [] }: SidebarProps) {
  const { getSetting } = useConfig();
  const popularArticlesTitle = getSetting('sidebar.popular_articles_title', '人気記事');
  const seriesTitle = getSetting('sidebar.series_title', 'シリーズ');
  const tagsTitle = getSetting('sidebar.tags_title', 'タグ');

  return (
    <div className={styles.sidebar}>
      <AuthorBox />
      <div className={styles.sidebarSection}>
        <h3 className={styles.sidebarTitle}>{popularArticlesTitle}</h3>
        <PopularArticles trendingPosts={trendingPosts} />
      </div>
      <div className={styles.sidebarSection}>
        <h3 className={styles.sidebarTitle}>{seriesTitle}</h3>
        <SeriesList series={series} />
      </div>
      <div className={styles.sidebarSection}>
        <h3 className={styles.sidebarTitle}>{tagsTitle}</h3>
        <TagCloud tags={tags} />
      </div>
    </div>
  );
}
