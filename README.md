# Notiography

Notion APIを用いたブログ  

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
