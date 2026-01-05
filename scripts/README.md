# スクリプト一覧

このディレクトリには、Notionとの連携やMarkdown変換に関するユーティリティスクリプトが含まれています。

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
