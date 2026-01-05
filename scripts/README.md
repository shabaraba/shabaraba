# スクリプト一覧

このディレクトリには、Notionとの連携やMarkdown変換に関するユーティリティスクリプトが含まれています。

## 🖼️ ビルド関連スクリプト

### download-notion-cover-images.js

Notionからアイキャッチ画像をダウンロードするスクリプト。

```bash
./scripts/load-env.sh node scripts/download-notion-cover-images.js
```

**機能:**
- Notionページのカバー画像を取得
- 高解像度画像（Unsplash等）をダウンロード
- `public/images/covers/` に配置

**用途:**
- articlesリポジトリへのカバー画像追加時に使用
- 一度実行してarticlesリポジトリにコミットすれば、以降は不要

---

### fetch-cover-images.js

GitHubリポジトリ（shabaraba/Articles）からカバー画像をダウンロードするスクリプト。

```bash
node scripts/fetch-cover-images.js
```

**機能:**
- GitHub Raw Content経由でカバー画像をダウンロード（レート制限なし）
- `shabaraba/Articles/covers/` からダウンロード
- `public/images/covers/` に配置

**特徴:**
- レート制限なし（raw.githubusercontent.com使用）
- 既存ファイルはスキップして高速化
- ビルド時に自動実行

---

### fetch-article-og-images.js

GitHubリポジトリ（shabaraba/Articles）から記事のOG画像をダウンロードするスクリプト。

```bash
node scripts/fetch-article-og-images.js
```

**機能:**
- GitHub Raw Content経由でOG画像をダウンロード（レート制限なし）
- `shabaraba/Articles/og-images/` からダウンロード
- `public/og-images/` に配置

**特徴:**
- レート制限なし（raw.githubusercontent.com使用）
- 既存ファイルはスキップして高速化
- ビルド時に自動実行（generate-og-images.jsより先に実行）
- Articlesリポジトリで事前生成されたOG画像を再利用

---

### generate-og-images.js

SNSシェア用のOG画像を自動生成するスクリプト。ビルド時に自動実行されます。

```bash
pnpm run generate-og
```

**機能:**
- 各記事のOG画像を`public/og-images/`に生成（PNG形式）
- 記事タイトルと背景画像を組み合わせた美しいデザイン
- カフェ風のカラースキームを採用

**生成される画像:**
- OG画像: `public/og-images/{slug}.png` (1200x630px)

**注意:**
- ビルドプロセス（`pnpm run build`）に自動的に組み込まれています
- `fetch-article-og-images.js`で取得した画像がある場合は上書きしない
- 生成された画像はgitignoreされており、コミットされません
- 各デプロイ時に最新の記事情報で再生成されます

---

## 📝 Notion関連スクリプト

### test-notion-api.js

Notion APIへの接続をテストし、記事一覧を取得するスクリプト。

```bash
node scripts/test-notion-api.js
```

**出力内容:**
- 公開済み記事の一覧（タイトル、Slug、公開日、タグ）
- トレンド記事の一覧

**環境変数:**
- `NOTION_TOKEN`: Notion Integration Token
- `NOTION_BLOG_DATABASE`: ブログ記事データベースID

---

### convert-notion-to-markdown.js

Notionの全記事をMarkdown形式に変換し、`content/posts/`ディレクトリに保存するスクリプト。

```bash
node scripts/convert-notion-to-markdown.js
```

**機能:**
- 公開済み記事のみを取得
- フロントマター（メタデータ）の自動生成
- Notionブロックタイプの完全なMarkdown変換サポート
- `YYYY-MM-DD-slug.md` 形式のファイル名で保存

**サポートされるNotionブロックタイプ:**
- paragraph（段落）
- heading_1, heading_2, heading_3（見出し）
- bulleted_list_item（箇条書き）
- numbered_list_item（番号付きリスト）
- quote（引用）
- code（コードブロック）
- image（画像）
- bookmark（ブックマーク）
- callout（コールアウト）
- embed（埋め込み）
- divider（区切り線）
- link_preview（リンクプレビュー）
- toggle（折りたたみ）

**出力形式:**

各Markdownファイルは以下の構造を持ちます：

```markdown
---
title: "記事タイトル"
slug: "article-slug"
publishedAt: "2024-01-01"
updatedAt: "2024-01-01T10:00:00.000Z"
tags:
  - タグ1
  - タグ2
icon: "📝"
excerpt: "記事の概要"
coverImage: "画像URL"
series: ""
trend: false
relatedArticles: []
draft: false
author: "shabaraba"
---

# 記事本文
...
```

**環境変数:**
- `NOTION_TOKEN`: Notion Integration Token
- `NOTION_BLOG_DATABASE`: ブログ記事データベースID

**注意事項:**
- API制限を避けるため、各記事の変換後に300msの待機時間を設けています
- 既存のMarkdownファイルは上書きされます
- Notionの画像URLは有効期限があるため、定期的な再変換が必要な場合があります

---

## 🔧 使い方

### 初回セットアップ

1. `.env`ファイルにNotion APIの情報を設定：

```bash
NOTION_TOKEN=your_notion_integration_token
NOTION_BLOG_DATABASE=your_database_id
```

2. 必要なパッケージがインストールされていることを確認：

```bash
npm install
```

### Notion記事の一括変換

```bash
# 現在の記事一覧を確認
node scripts/test-notion-api.js

# 全記事をMarkdownに変換
node scripts/convert-notion-to-markdown.js
```

変換されたMarkdownファイルは `content/posts/` ディレクトリに保存されます。

---

## 📚 関連ドキュメント

- [Notion API ドキュメント](https://developers.notion.com/)
- [プロジェクトのCLAUDE.md](/CLAUDE.md) - プロジェクト全体の構成について

---

## 🐛 トラブルシューティング

### "Cannot find module" エラー

```bash
npm install
```

### Notion API接続エラー

1. `.env`ファイルの`NOTION_TOKEN`と`NOTION_BLOG_DATABASE`が正しく設定されているか確認
2. NotionのIntegrationがデータベースに接続されているか確認
3. データベースのプロパティ名が正しいか確認（Name, Slug, Published_Time等）

### 変換されない記事がある

- Notionデータベースで`Published`チェックボックスがONになっているか確認
- スクリプトのコンソール出力でエラーメッセージを確認
