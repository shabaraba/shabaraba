import React from 'react';
import styles from './Sidebar.module.css';
import AuthorBox from './AuthorBox';
import PopularArticles from './PopularArticles';
import CategoryList from './CategoryList';
import TagCloud from './TagCloud';

/**
 * サイドバーコンポーネント
 */
export default function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <AuthorBox />
      <div className={styles.sidebarSection}>
        <h3 className={styles.sidebarTitle}>人気記事</h3>
        <PopularArticles />
      </div>
      <div className={styles.sidebarSection}>
        <h3 className={styles.sidebarTitle}>カテゴリ</h3>
        <CategoryList />
      </div>
      <div className={styles.sidebarSection}>
        <h3 className={styles.sidebarTitle}>タグ</h3>
        <TagCloud />
      </div>
    </div>
  );
}
