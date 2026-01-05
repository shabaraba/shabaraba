import React from 'react';
import Link from 'next/link';
import styles from './CategoryList.module.css';

/**
 * カテゴリ一覧コンポーネント
 * 注: 実際の実装では、データは動的に取得します
 */
export default function CategoryList() {
  // 仮のデータ - 実際の実装では動的に取得する
  const categories = [
    { id: 1, name: 'プログラミング', count: 12 },
    { id: 2, name: 'デザイン', count: 8 },
    { id: 3, name: '開発環境', count: 6 },
    { id: 4, name: 'ライフハック', count: 5 },
    { id: 5, name: 'ガジェット', count: 4 },
  ];

  return (
    <div className={styles.categoryList}>
      <ul className={styles.list}>
        {categories.map((category) => (
          <li key={category.id} className={styles.item}>
            <Link href={`/category/${category.name.toLowerCase()}`} prefetch={false} className={styles.link}>
              <span className={styles.name}>{category.name}</span>
              <span className={styles.count}>{category.count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
