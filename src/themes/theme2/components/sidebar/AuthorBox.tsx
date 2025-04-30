import React from 'react';
import Image from 'next/image';
import styles from './AuthorBox.module.css';
// アイコンをインポート
import { SiGithub, SiQiita } from '@meronex/icons/si';
import { FaTwitter } from '@meronex/icons/fa';

/**
 * 著者情報コンポーネント
 */
export default function AuthorBox() {
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
      <h3 className={styles.authorName}>Author</h3>
      <p className={styles.authorBio}>
        プログラミングとデザインが好きなエンジニア。日々の発見や気づきをこのブログで共有しています。
      </p>
      <div className={styles.authorSocial}>
        <a href="https://github.com/shabaraba" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
          <SiGithub className={styles.socialIcon} />
        </a>
        <a href="https://x.com/shaba_dev" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
          <FaTwitter className={styles.socialIcon} />
        </a>
        <a href="https://qiita.com/shabaraba" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
          <SiQiita className={styles.socialIcon} />
        </a>
      </div>
    </div>
  );
}
