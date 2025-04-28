import React from 'react';
import Link from 'next/link';
import styles from './TagCloud.module.css';

/**
 * タグクラウドコンポーネント
 * 注: 実際の実装では、データは動的に取得します
 */
export default function TagCloud() {
  // 仮のデータ - 実際の実装では動的に取得する
  const tags = [
    { id: 1, name: 'JavaScript', count: 8, size: 'large' },
    { id: 2, name: 'React', count: 6, size: 'large' },
    { id: 3, name: 'TypeScript', count: 5, size: 'medium' },
    { id: 4, name: 'Next.js', count: 5, size: 'medium' },
    { id: 5, name: 'CSS', count: 4, size: 'medium' },
    { id: 6, name: 'HTML', count: 3, size: 'small' },
    { id: 7, name: 'Node.js', count: 3, size: 'small' },
    { id: 8, name: 'API', count: 2, size: 'small' },
    { id: 9, name: 'Notion', count: 2, size: 'small' },
    { id: 10, name: 'デザイン', count: 2, size: 'small' },
  ];

  return (
    <div className={styles.tagCloud}>
      {tags.map((tag) => (
        <Link 
          key={tag.id} 
          href={`/tags/${tag.name.toLowerCase()}`} 
          className={`${styles.tag} ${styles[tag.size]}`}
        >
          {tag.name}
        </Link>
      ))}
    </div>
  );
}
