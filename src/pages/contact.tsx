import { GetStaticProps } from 'next';
import Head from 'next/head';

interface ContactPageProps {
  config: any;
}

export default function ContactPage({ config }: ContactPageProps) {
  return (
    <>
      <Head>
        <title>お問い合わせ | Coffee Break Point</title>
        <meta name="description" content="Coffee Break Pointへのお問い合わせページです。" />
      </Head>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem', fontFamily: 'system-ui, sans-serif', lineHeight: '1.6' }}>
        <article style={{ color: '#333' }}>
          <h1>お問い合わせ</h1>

          <h2>Contact</h2>
          <p>
            当サイト「Coffee Break Point」に関するお問い合わせは、下記のフォームからご連絡ください。
          </p>

          <h3>📝 お問い合わせフォーム</h3>
          <p>
            以下のボタンからGoogle Formでお問い合わせいただけます。
          </p>
          <div style={{ margin: '2rem 0', textAlign: 'center' }}>
            <a 
              href="https://forms.gle/5KLSAY1KkvAXQ5wi8" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                backgroundColor: '#4285f4',
                color: 'white',
                padding: '12px 24px',
                textDecoration: 'none',
                borderRadius: '8px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                transition: 'background-color 0.3s'
              }}
            >
              お問い合わせフォームを開く
            </a>
          </div>

          <h3>⏰ 返信について</h3>
          <p>
            通常、<strong>2-3営業日以内</strong>にご返信いたします。
          </p>

          <h3>📝 お問い合わせ内容について</h3>
          <p>以下のようなお問い合わせをお受けしています：</p>

          <h4>記事内容について</h4>
          <ul>
            <li>技術的な質問</li>
            <li>記事の内容に関するご指摘</li>
            <li>追加情報のリクエスト</li>
          </ul>

          <h4>サイト運営について</h4>
          <ul>
            <li>プライバシーポリシーに関するお問い合わせ</li>
            <li>著作権に関するお問い合わせ</li>
            <li>免責事項について</li>
          </ul>

          <h4>その他</h4>
          <ul>
            <li>取材・寄稿依頼</li>
            <li>技術相談</li>
            <li>コラボレーションのご提案</li>
          </ul>

          <h3>🚫 お受けできないお問い合わせ</h3>
          <p>申し訳ございませんが、以下のようなお問い合わせはお受けできません：</p>
          <ul>
            <li>営業・宣伝目的のメール</li>
            <li>無関係な商品・サービスの宣伝</li>
            <li>不適切な内容を含むもの</li>
          </ul>

          <hr />
          <p style={{ fontSize: '0.9rem', color: '#666' }}>
            <em>お問い合わせいただいた内容は、プライバシーポリシーに従って適切に管理いたします。</em>
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