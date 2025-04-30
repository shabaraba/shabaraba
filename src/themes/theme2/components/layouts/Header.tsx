import React from 'react';
import Link from 'next/link';
import styles from './Header.module.css';

/**
 * ヘッダーコンポーネント
 */
export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoText}>
            Coffee Break Point
          </span>
        </Link>
      </div>
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <Link href="/" className={styles.navLink}>
              ホーム
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/mylink" className={styles.navLink}>
              リンク集
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}