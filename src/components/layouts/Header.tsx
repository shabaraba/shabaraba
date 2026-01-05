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
  const mylinkText = getSetting('header.mylink', 'マイリンク');

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
          <li className={styles.navItem}>
            <Link href="/mylink" className={styles.navLink} prefetch={false}>
              { mylinkText }
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
