import { GetStaticProps } from 'next';
import { DetailLayout } from 'src/components/layouts/DetailLayout';

interface ContactPageProps {
  config: any;
}

export default function ContactPage({ config }: ContactPageProps) {
  return (
    <DetailLayout config={config}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <article className="prose prose-lg max-w-none">
          <h1>お問い合わせ</h1>

          <h2>Contact</h2>
          <p>
            当サイト「Coffee Break Point」に関するお問い合わせは、以下の方法でご連絡ください。
          </p>

          <h3>📧 メールでのお問い合わせ</h3>
          <p>
            <strong>メールアドレス：</strong> contact@shaba.dev
          </p>
          <p>お問い合わせの際は、以下の内容をご記載いただけますとスムーズに対応できます：</p>
          <ul>
            <li>お名前</li>
            <li>件名</li>
            <li>お問い合わせ内容</li>
            <li>返信をご希望のメールアドレス</li>
          </ul>

          <h3>⏰ 返信について</h3>
          <p>
            通常、<strong>2-3営業日以内</strong>にご返信いたします。<br />
            お急ぎの場合は、件名に【急】と記載してください。
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

          <h3>ℹ️ サイト情報</h3>
          <p>
            <strong>サイト名：</strong> Coffee Break Point<br />
            <strong>URL：</strong> https://blog.shaba.dev<br />
            <strong>運営者：</strong> shaba<br />
            <strong>開設日：</strong> 2022年
          </p>

          <h3>🔗 その他の連絡方法</h3>
          <ul>
            <li><strong>GitHub：</strong> <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">github.com/yourusername</a></li>
            <li><strong>Twitter：</strong> <a href="https://twitter.com/yourhandle" target="_blank" rel="noopener noreferrer">@yourhandle</a></li>
          </ul>

          <hr />
          <p className="text-sm text-gray-600">
            <em>お問い合わせいただいた内容は、プライバシーポリシーに従って適切に管理いたします。</em>
          </p>
        </article>
      </div>
    </DetailLayout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      config: {},
    },
  };
};