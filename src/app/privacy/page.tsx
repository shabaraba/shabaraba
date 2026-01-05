import { Metadata } from 'next';
import PortfolioLayout from '../../components/PortfolioLayout';
import styles from './privacy.module.css';

export const metadata: Metadata = {
  title: 'プライバシーポリシー - Coffee Break Point',
  description: '当サイトにおける個人情報の取り扱いについて',
};

export default function PrivacyPage() {
  return (
    <PortfolioLayout>
      <div className={styles.privacyContainer}>
        <h1 className={styles.title}>プライバシーポリシー</h1>
        <p className={styles.lastUpdated}>最終更新日：2025年1月5日</p>

        <section className={styles.section}>
          <h2>1. はじめに</h2>
          <p>
            Coffee Break Point（以下、「当サイト」）は、ユーザーのプライバシーを尊重し、
            個人情報の保護に努めています。本プライバシーポリシーでは、当サイトにおける
            個人情報の取り扱いについて説明します。
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. 収集する情報</h2>
          <p>当サイトでは、以下の情報を収集する場合があります：</p>
          <ul>
            <li>アクセスログ情報（IPアドレス、ブラウザ情報、アクセス日時など）</li>
            <li>Cookieおよび類似技術により収集される情報</li>
            <li>お問い合わせフォームを通じて提供される情報</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>3. 情報の利用目的</h2>
          <p>収集した情報は、以下の目的で利用します：</p>
          <ul>
            <li>サイトの改善およびユーザー体験の向上</li>
            <li>アクセス解析およびコンテンツの最適化</li>
            <li>お問い合わせへの対応</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>4. Google Analyticsの使用</h2>
          <p>
            当サイトでは、Google Analyticsを使用してアクセス解析を行っています。
            Google Analyticsは、Cookieを使用して匿名のトラフィックデータを収集します。
            この情報は、個人を特定するものではありません。
          </p>
          <p>
            Google Analyticsの詳細については、
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              Googleのプライバシーポリシー
            </a>
            をご確認ください。
          </p>
        </section>

        <section className={styles.section}>
          <h2>5. Cookieについて</h2>
          <p>
            当サイトでは、サービスの向上や利便性の提供のためにCookieを使用しています。
            Cookieの使用を希望しない場合は、ブラウザの設定でCookieを無効にすることができます。
          </p>
        </section>

        <section className={styles.section}>
          <h2>6. 第三者への情報提供</h2>
          <p>
            当サイトは、法律で要求される場合を除き、収集した個人情報を第三者に
            提供することはありません。
          </p>
        </section>

        <section className={styles.section}>
          <h2>7. 外部リンク</h2>
          <p>
            当サイトには、外部サイトへのリンクが含まれている場合があります。
            これらの外部サイトのプライバシーポリシーについては、当サイトは責任を負いません。
          </p>
        </section>

        <section className={styles.section}>
          <h2>8. プライバシーポリシーの変更</h2>
          <p>
            当サイトは、必要に応じて本プライバシーポリシーを変更することがあります。
            変更後のプライバシーポリシーは、当サイトに掲載した時点で効力を生じるものとします。
          </p>
        </section>

        <section className={styles.section}>
          <h2>9. セキュリティ</h2>
          <p>
            当サイトは、収集した情報の安全性を確保するため、適切な技術的および
            組織的なセキュリティ対策を実施しています。
          </p>
        </section>

        <section className={styles.section}>
          <h2>10. データ保護</h2>
          <p>
            当サイトは、収集した個人情報を適切に管理し、不正アクセス、紛失、
            破壊、改ざん、漏洩などから保護するよう努めます。
          </p>
        </section>

        <section className={styles.section}>
          <h2>11. お問い合わせ</h2>
          <p>
            本プライバシーポリシーに関するご質問やご意見は、以下の連絡先までお願いします。
          </p>
          <p className={styles.contact}>
            お問い合わせ：
            <a href="mailto:work.shaba.dev@gmail.com" className={styles.emailLink}>
              work.shaba.dev@gmail.com
            </a>
          </p>
        </section>
      </div>
    </PortfolioLayout>
  );
}
