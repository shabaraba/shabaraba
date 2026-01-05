import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';
import { Icon } from '@iconify/react';
import { useConfig } from '../../config/useConfig';

/**
 * フッターコンポーネント
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  // 設定から文字列を取得
  const { getSetting } = useConfig();
  const poweredByText = getSetting('footer.powered_by_text', 'powered by');
  const copyright = getSetting('footer.copyright', '©from-garage 2022 All Rights Reserved.');
  
  // 年数を動的に置換（2022を現在の年に）
  const copyrightWithYear = copyright.replace(/\d{4}/, currentYear.toString());

  return (
    <footer className={styles.footer}>
      <div className={styles.footerLinks}>
        <Link href="/privacy">プライバシーポリシー</Link>
        <Link href="/">About</Link>
      </div>
      <p className={styles.copyright}>{copyrightWithYear}</p>
      <div className={styles.poweredBy}>
        {poweredByText}
        <span className={styles.techIcons}>
          <Icon icon="simple-icons:notion" width="24" height="24" />
          <Icon icon="simple-icons:nextdotjs" width="24" height="24" />
          <Icon icon="simple-icons:netlify" width="24" height="24" />
        </span>
      </div>
    </footer>
  );
}
