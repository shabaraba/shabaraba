import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './MyLinkItem.module.css';
import { MyLinkEntity } from '../../../../core/entities/MyLinkEntity';

interface MyLinkItemProps {
  mylink: MyLinkEntity;
}

/**
 * 単一のMyLinkコンポーネント
 */
export default function MyLinkItem({ mylink }: MyLinkItemProps) {
  // OGP画像がない場合はデフォルト画像を使用
  const imageUrl = mylink.ogp && mylink.ogp.length > 0 
    ? mylink.ogp 
    : 'https://placehold.jp/7b5e57/ffffff/200x120.png?text=No%20Image';

  return (
    <article className={styles.mylinkCard}>
      <div className={styles.mylinkImage}>
        <Link href={mylink.url} target="_blank" rel="noopener noreferrer">
          <Image 
            src={imageUrl}
            alt={mylink.title} 
            width={200} 
            height={120} 
            className={styles.image}
          />
        </Link>
      </div>
      <div className={styles.mylinkContent}>
        <h3 className={styles.mylinkTitle}>
          <Link href={mylink.url} className={styles.titleLink} target="_blank" rel="noopener noreferrer">
            {mylink.title}
          </Link>
        </h3>
        {mylink.tags && mylink.tags.length > 0 && (
          <div className={styles.mylinkTags}>
            {mylink.tags.map((tag, index) => (
              <span key={index} className={styles.tagItem}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
