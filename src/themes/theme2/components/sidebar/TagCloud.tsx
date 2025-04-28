import React from 'react';
import Link from 'next/link';
import styles from './TagCloud.module.css';
import { usePostList } from 'themes/theme2/hooks/usePostList';
import { IPageTag } from 'core/types/NotionPageApiResponses';

// タグのサイズを決めるための閾値
const SIZE_THRESHOLDS = {
  large: 5,   // 5回以上使われているタグは大きく表示
  medium: 3,  // 3-4回使われているタグは中くらいに表示
  small: 0    // それ以外は小さく表示
};

/**
 * タグクラウドコンポーネント
 * Notionから取得したタグを表示します
 */
export default function TagCloud() {
  const { posts, isLoading } = usePostList();
  
  // すべての記事からタグを抽出して集計
  const tagCounts: { [key: string]: { count: number, tag: IPageTag } } = {};
  
  console.log('TagCloud - posts:', posts);
  
  posts.forEach((post) => {
    if (post.tags) {
      post.tags.forEach((tag) => {
        if (!tagCounts[tag.name]) {
          tagCounts[tag.name] = { count: 0, tag };
        }
        tagCounts[tag.name].count += 1;
      });
    }
  });
  
  console.log('TagCloud - tagCounts:', tagCounts);
  
  // 表示用のタグデータに変換
  const tagData = Object.values(tagCounts).map(({ count, tag }) => {
    let size = 'small';
    if (count >= SIZE_THRESHOLDS.large) {
      size = 'large';
    } else if (count >= SIZE_THRESHOLDS.medium) {
      size = 'medium';
    }
    
    return {
      id: tag.id,
      name: tag.name,
      count,
      size,
      color: tag.color
    };
  }).sort((a, b) => b.count - a.count); // 使用頻度順にソート
  
  console.log('TagCloud - tagData:', tagData);

  if (isLoading) {
    return <div className={styles.loading}>読み込み中...</div>;
  }
  
  if (tagData.length === 0) {
    return <div className={styles.noTags}>タグはありません</div>;
  }

  return (
    <div className={styles.tagCloud}>
      {tagData.map((tag) => (
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
