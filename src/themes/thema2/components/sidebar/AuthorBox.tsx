import React from 'react';
import Image from 'next/image';
import styles from './AuthorBox.module.css';

/**
 * 著者情報コンポーネント
 */
export default function AuthorBox() {
  return (
    <div className={styles.authorBox}>
      <div className={styles.authorImage}>
        <Image 
          src="/images/profile.jpg" 
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
          <i className="icon-github"></i> GitHub
        </a>
      </div>
    </div>
  );
}
