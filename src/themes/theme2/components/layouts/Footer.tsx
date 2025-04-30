import React from 'react';
import styles from './Footer.module.css';
import { Icon } from '@iconify/react';

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
      </div>
      <div className={styles.footerBottom}>
        <p className={styles.copyright}>© {currentYear} Coffee Break Point. All rights reserved.</p>
        <div className={styles.poweredBy}>
          powered by
          <span className={styles.techIcons}>
            <Icon icon="simple-icons:notion" width="24" height="24" />
            <Icon icon="simple-icons:nextdotjs" width="24" height="24" />
            <Icon icon="simple-icons:netlify" width="24" height="24" />
          </span>
        </div>
      </div>
    </footer>
  );
}
