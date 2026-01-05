'use client';

import React from 'react';
import Link from 'next/link';
import styles from './TagCloud.module.css';
import {v4 as uuidv4} from 'uuid';
import { TagData } from 'contexts/SidebarContext';

interface TagCloudProps {
  tags?: TagData[];
}

export default function TagCloud({ tags = [] }: TagCloudProps) {
  if (tags.length === 0) {
    return <div className={styles.noTags}>タグはありません</div>;
  }

  return (
    <div className={styles.tagCloud}>
      {tags.map((tag) => (
        <Link 
          key={uuidv4()} 
          href={`/tags/${tag.name.toLowerCase()}`} prefetch={false} 
          className={`${styles.tag} ${styles[tag.size]}`}
          style={{ backgroundColor: tag.color === 'default' ? undefined : `var(--notion-${tag.color})` }}
        >
          {tag.name}
        </Link>
      ))}
    </div>
  );
}
