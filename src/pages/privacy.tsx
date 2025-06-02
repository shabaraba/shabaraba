import { GetStaticProps } from 'next';
import Head from 'next/head';

interface PrivacyPageProps {
  config: any;
}

export default function PrivacyPage({ config }: PrivacyPageProps) {
  return (
    <>
      <Head>
        <title>プライバシーポリシー | Coffee Break Point</title>
        <meta name="description" content="Coffee Break Pointのプライバシーポリシーページです。" />
      </Head>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem', fontFamily: 'system-ui, sans-serif', lineHeight: '1.6' }}>
        <article style={{ color: '#333' }}>
          <h1>プライバシーポリシー</h1>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>最終更新日：2025年5月26日</p>

          <h2>1. はじめに</h2>
          <p>
            本サイト「Coffee Break Point」（以下「当サイト」）は、ユーザーのプライバシーを尊重し、個人情報の保護に努めています。本プライバシーポリシーは、当サイトにおける個人情報の取り扱いについて説明するものです。
          </p>

          <h2>2. 収集する情報</h2>
          <h3>2.1 自動的に収集される情報</h3>
          <ul>
            <li>IPアドレス</li>
            <li>ブラウザの種類とバージョン</li>
            <li>オペレーティングシステム</li>
            <li>訪問日時</li>
            <li>閲覧ページ</li>
            <li>リファラー情報</li>
          </ul>

          <h3>2.2 お問い合わせ時の情報</h3>
          <ul>
            <li>お名前</li>
            <li>メールアドレス</li>
            <li>お問い合わせ内容</li>
          </ul>

          <h2>3. Cookieの使用について</h2>
          <h3>3.1 当サイトのCookie使用</h3>
          <p>当サイトでは、ユーザーエクスペリエンスの向上とサイト解析のためにCookieを使用しています。</p>

          <h3>3.2 第三者配信事業者のCookie使用</h3>
          <p>当サイトでは、Google AdSenseを含む第三者配信事業者がCookieを使用して広告を配信しています。</p>
          <ul>
            <li>Google などの第三者配信事業者が Cookie を使用して、ユーザーがそのウェブサイトや他のウェブサイトに過去にアクセスした際の情報に基づいて広告を配信すること</li>
            <li>Google が広告 Cookie を使用することにより、ユーザーがそのサイトや他のサイトにアクセスした際の情報に基づいて、Google やそのパートナーが適切な広告をユーザーに表示できること</li>
            <li>ユーザーは、<a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">広告設定</a>でパーソナライズ広告を無効にできること</li>
          </ul>

          <h2>4. Google Analytics</h2>
          <p>
            当サイトでは、Googleによるアクセス解析ツール「Google Analytics」を使用しています。このGoogle Analyticsはデータの収集のためにCookieを使用しています。
          </p>
          <p>
            このデータは匿名で収集されており、個人を特定するものではありません。この機能はCookieを無効にすることで収集を拒否することができますので、お使いのブラウザの設定をご確認ください。
          </p>
          <p>
            Google Analyticsの利用規約については、<a href="https://marketingplatform.google.com/about/analytics/terms/jp/" target="_blank" rel="noopener noreferrer">こちら</a>をご確認ください。
          </p>

          <h2>5. 個人情報の利用目的</h2>
          <p>収集した個人情報は、以下の目的で利用します：</p>
          <ul>
            <li>お問い合わせへの対応</li>
            <li>サイトの運営・改善</li>
            <li>法令に基づく対応</li>
          </ul>

          <h2>6. 個人情報の第三者提供</h2>
          <p>法令に基づく場合を除き、ユーザーの同意なく第三者に個人情報を提供することはありません。</p>

          <h2>7. 個人情報の管理</h2>
          <p>
            当サイトは、ユーザーの個人情報を適切に管理し、不正アクセス、紛失、破損、改ざん、漏洩などを防止するため、必要かつ適切な安全対策を実施しています。
          </p>

          <h2>8. 免責事項</h2>
          <p>
            当サイトのコンテンツについては、可能な限り正確な情報を掲載するよう努めていますが、誤情報が入り込んだり、情報が古くなったりすることもあります。必ずしも正確性を保証するものではありません。
          </p>
          <p>
            また、リンク先の外部サイトで提供される情報、サービス等について一切の責任を負いません。
          </p>

          <h2>9. 著作権について</h2>
          <p>
            当サイトに掲載されているコンテンツ（文章、画像、動画等）の著作権は、当サイト管理者または各権利者に帰属します。無断転載や複製は禁止されています。
          </p>

          <h2>10. お問い合わせ</h2>
          <p>本プライバシーポリシーに関するお問い合わせは、下記までご連絡ください。</p>
          <p>
            サイト名：Coffee Break Point<br />
            URL：https://blog.shaba.dev<br />
            お問い合わせ：contact@shaba.dev
          </p>

          <h2>11. プライバシーポリシーの変更</h2>
          <p>
            本プライバシーポリシーは、必要に応じて内容を変更することがあります。変更後のプライバシーポリシーは、当サイトに掲載された時点で効力を生じるものとします。
          </p>
        </article>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      config: {},
    },
  };
};