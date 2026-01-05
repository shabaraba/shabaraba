import React from 'react';
import Link from 'next/link';
import styles from './Header.module.css';
import useConfig from 'config/useConfig';

/**
 * ヘッダーコンポーネント
 */
export default function Header() {

  const { getSetting } = useConfig();
  const homeText = getSetting('header.homelink', 'ホーム');

  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <Link href="/blog" className={styles.logo}>
          <span className={styles.logoText}>
            Coffee Break Point
          </span>
        </Link>
      </div>
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <Link href="/blog" className={styles.navLink}>
              { homeText }
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
