import { GetStaticProps } from 'next';
import { DetailLayout } from 'src/components/layouts/DetailLayout';

interface AboutPageProps {
  config: any;
}

export default function AboutPage({ config }: AboutPageProps) {
  return (
    <DetailLayout config={config}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <article className="prose prose-lg max-w-none">
          <h1>About</h1>

          <h2>Coffee Break Point について</h2>
          <p>
            「Coffee Break Point」は、日々の開発で得た知識や気付きを共有する技術ブログです。プログラミング、ウェブ開発、そして時々の雑記を通じて、読者の皆様にとって有益な情報をお届けします。
          </p>

          <h3>🎯 サイトのコンセプト</h3>
          <p><strong>「コーヒーブレイクのように気軽に読める技術情報」</strong></p>
          <p>
            忙しい開発者の皆様が、ちょっとした休憩時間に読めるような、実用的で分かりやすい記事を心がけています。
          </p>

          <h3>📝 主な記事テーマ</h3>

          <h4>フロントエンド開発</h4>
          <ul>
            <li>React, Next.js, TypeScript</li>
            <li>CSS, UI/UX設計</li>
            <li>パフォーマンス最適化</li>
          </ul>

          <h4>バックエンド開発</h4>
          <ul>
            <li>Node.js, Express</li>
            <li>データベース設計</li>
            <li>API設計・実装</li>
          </ul>

          <h4>開発環境・ツール</h4>
          <ul>
            <li>Git, GitHub</li>
            <li>開発効率化のツール紹介</li>
            <li>VSCode設定・拡張機能</li>
          </ul>

          <h4>その他</h4>
          <ul>
            <li>技術トレンド</li>
            <li>開発者向けのライフハック</li>
            <li>学習方法・リソース紹介</li>
          </ul>

          <h2>運営者について</h2>

          <h3>👨‍💻 プロフィール</h3>
          <p>
            <strong>名前：</strong> shaba<br />
            <strong>職業：</strong> フロントエンドエンジニア<br />
            <strong>経験：</strong> ウェブ開発 3年以上
          </p>

          <h3>💼 スキル・専門分野</h3>
          <ul>
            <li><strong>言語：</strong> JavaScript, TypeScript, Python</li>
            <li><strong>フレームワーク：</strong> React, Next.js, Express</li>
            <li><strong>その他：</strong> Git, Docker, AWS基礎</li>
          </ul>

          <h3>🌱 現在の関心事</h3>
          <ul>
            <li>モダンなフロントエンド開発手法</li>
            <li>Webパフォーマンス最適化</li>
            <li>アクセシビリティ向上</li>
            <li>開発者体験（DX）の改善</li>
          </ul>

          <h2>サイト運営方針</h2>

          <h3>📖 記事の品質について</h3>
          <ul>
            <li><strong>実体験に基づく内容：</strong>実際に試した技術や手法を中心に執筆</li>
            <li><strong>初心者にも分かりやすく：</strong>専門用語には解説を加え、段階的に説明</li>
            <li><strong>最新情報への対応：</strong>定期的な記事の更新と情報の追加</li>
          </ul>

          <h3>🔄 更新頻度</h3>
          <ul>
            <li>新規記事：週1-2回程度</li>
            <li>既存記事の更新：月1-2回程度</li>
            <li>技術トレンドに応じた臨時更新</li>
          </ul>

          <h3>💬 読者との交流</h3>
          <p>
            お問い合わせページからのご質問や、記事に対するフィードバックをお待ちしています。皆様からのご意見は、サイト改善の貴重な参考にさせていただいています。
          </p>

          <h2>サイト情報</h2>

          <h3>🏗️ 技術スタック</h3>
          <ul>
            <li><strong>フレームワーク：</strong> Next.js (SSG)</li>
            <li><strong>スタイリング：</strong> Tailwind CSS</li>
            <li><strong>ホスティング：</strong> Vercel</li>
            <li><strong>ドメイン：</strong> 独自ドメイン</li>
          </ul>

          <h3>📊 開始時期</h3>
          <ul>
            <li><strong>サイト開設：</strong> 2022年</li>
            <li><strong>記事数：</strong> 45記事以上（2025年5月現在）</li>
            <li><strong>月間PV：</strong> 成長中</li>
          </ul>

          <h3>🎨 デザインポリシー</h3>
          <ul>
            <li>シンプルで読みやすいレイアウト</li>
            <li>モバイル対応（レスポンシブデザイン）</li>
            <li>高速な表示速度</li>
            <li>アクセシビリティへの配慮</li>
          </ul>

          <h2>お問い合わせ</h2>
          <p>
            記事の内容に関するご質問、サイトへのご意見・ご要望、お仕事のご相談などがございましたら、お気軽にお問い合わせください。
          </p>
          <p>
            <strong>Email：</strong> contact@shaba.dev<br />
            <strong>URL：</strong> https://blog.shaba.dev
          </p>

          <hr />
          <p className="text-sm text-gray-600">
            <em>最後まで読んでいただき、ありがとうございます。皆様の開発ライフがより充実したものになるよう、有益な情報発信を続けてまいります。</em>
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
