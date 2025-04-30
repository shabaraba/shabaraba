import React from 'react';
import styles from './Footer.module.css';
import { Icon } from '@iconify/react';
import { useConfig } from '../../../../lib/useConfig';

/**
 * フッターコンポーネント
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  // 設定から文字列を取得
  const { getSetting } = useConfig();
  const siteTitle = getSetting('site.title', 'Coffee Break Point');
  const siteDescription = getSetting('home.subtitle', 'プログラミングやデザイン、日々の気づきをお届けするブログです');
  const poweredByText = getSetting('footer.powered_by_text', 'powered by');
  const copyright = getSetting('footer.copyright', '©from-garage 2022 All Rights Reserved.');
  
  // 年数を動的に置換（2022を現在の年に）
  const copyrightWithYear = copyright.replace(/\d{4}/, currentYear.toString());

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerInfo}>
          <h3 className={styles.footerTitle}>{siteTitle}</h3>
          <p className={styles.footerText}>
            {siteDescription}
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
        <p className={styles.copyright}>{copyrightWithYear}</p>
        <div className={styles.poweredBy}>
          {poweredByText}
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
