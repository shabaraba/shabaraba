# Notiography

Notion APIを用いたブログ  
取り急ぎ最低限必要な機能 + 個人的に運用できる状態にするが、将来的にフレームワーク化を図る予定。
自分用のブログ: <https://blog.from-garage.com>

## 技術スタック

Nextjs
Typescript
Notion API
Netlify

## 開発方法

### ホットリロード

```sh
yarn dev
```

### 最終確認

```sh
yarn build
yarn start
```

### デプロイ

mainにpushした段階で自動的にdeployされる。
mainにむけてPLを出すと、そのタイミングでデプロイプレビュをnetlifyがしてくれる

### デイリーデプロイ
SSGを採用しているので、一日ごとに再デプロイを行って最新のnotionの状態と同期している
lambdaで行っている
