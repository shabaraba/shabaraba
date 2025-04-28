import React from 'react';
import Link from 'next/link';
import styles from './TagCloud.module.css';
import { useTags } from 'themes/theme2/hooks/useTags';

/**
 * タグクラウドコンポーネント
 * Notionから取得したタグを表示します
 */
export default function TagCloud() {
  const { tags, isLoading, error } = useTags();
  
  if (error) {
    console.error('Error in TagCloud:', error);
  }

  if (isLoading) {
    return <div className={styles.loading}>読み込み中...</div>;
  }
  
  if (tags.length === 0) {
    return <div className={styles.noTags}>タグはありません</div>;
  }

  return (
    <div className={styles.tagCloud}>
      {tags.map((tag) => (
        <Link 
          key={tag.id} 
          href={`/tags/${tag.name.toLowerCase()}`} 
          className={`${styles.tag} ${styles[tag.size]}`}
          style={{ backgroundColor: tag.color === 'default' ? undefined : `var(--notion-${tag.color})` }}
        >
          {tag.name}
        </Link>
      ))}
    </div>
  );
}
