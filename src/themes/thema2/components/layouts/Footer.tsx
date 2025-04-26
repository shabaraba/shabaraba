import React from 'react';
import styles from './Footer.module.css';

/**
 * フッターコンポーネント
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerInfo}>
          <h3 className={styles.footerTitle}>Coffee Break Point</h3>
          <p className={styles.footerText}>
            プログラミングやデザイン、日々の気づきをお届けするブログです。
          </p>
        </div>
        <div className={styles.footerLinks}>
          <h4 className={styles.footerSubtitle}>リンク</h4>
          <ul className={styles.footerList}>
            <li><a href="/" className={styles.footerLink}>ホーム</a></li>
            <li><a href="/mylink" className={styles.footerLink}>リンク集</a></li>
          </ul>
        </div>
        <div className={styles.footerHours}>
          <h4 className={styles.footerSubtitle}>営業時間</h4>
          <p className={styles.footerText}>
            当ブログは24時間営業中<br />
            いつでもお気軽にお立ち寄りください
          </p>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p className={styles.copyright}>© {currentYear} Coffee Break Point. All rights reserved.</p>
      </div>
    </footer>
  );
}
