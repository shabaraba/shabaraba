import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.css';

/**
 * ヘッダーコンポーネント
 */
export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <Link href="/" className={styles.logo}>
          <Image 
            src="/images/CoffeeBreakPoint.png" 
            alt="Coffee Break Point" 
            width={240} 
            height={60} 
            priority
          />
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