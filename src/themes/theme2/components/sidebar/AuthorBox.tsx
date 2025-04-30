import React from 'react';
import Image from 'next/image';
import styles from './AuthorBox.module.css';
import { Icon } from '@iconify/react';
import { useConfig } from '../../../../config/useConfig';

/**
 * 著者情報コンポーネント
 */
export default function AuthorBox() {
  // 設定から文字列を取得
  const { getSetting } = useConfig();
  const authorTitle = getSetting('sidebar.author_title', 'Author');
  const authorBio = getSetting('author.bio', 'プログラミングとデザインが好きなエンジニア。日々の発見や気づきをこのブログで共有しています。');
  
  return (
    <div className={styles.authorBox}>
      <div className={styles.authorImage}>
        <Image 
          src="/images/github-profile.jpg" 
          alt="著者プロフィール画像" 
          width={100} 
          height={100} 
          className={styles.avatar}
        />
      </div>
      <h3 className={styles.authorName}>{authorTitle}</h3>
      <p className={styles.authorBio}>
        {authorBio}
      </p>
      <div className={styles.authorSocial}>
        <a href="https://github.com/shabaraba" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
          <Icon icon="simple-icons:github" width="24" height="24" />
        </a>
        <a href="https://x.com/shaba_dev" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
          <Icon icon="simple-icons:x" width="24" height="24" />
        </a>
        <a href="https://qiita.com/shabaraba" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
          <Icon icon="simple-icons:qiita" width="24" height="24" />
        </a>
      </div>
    </div>
  );
}
