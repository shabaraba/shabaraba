# Markdown記事管理システム移行ガイド

このドキュメントは、NotionベースからMarkdownベースの記事管理への移行手順をまとめたものです。

## 概要

従来のNotionベースの記事管理から、Markdownファイルベースの記事管理に移行しました。

### メリット

- **Git管理**: 記事の履歴管理、差分確認、レビューが容易
- **高速ビルド**: ファイルシステムベースでNotion API呼び出しが不要
- **オフライン編集**: インターネット接続不要で記事作成可能
- **ベンダーロックイン回避**: Notionに依存しない
- **差分ビルド**: 変更された記事のみを再生成

### デメリット

- GUI編集不可（テキストエディタのみ）
- 画像管理が手動
- リアルタイムコラボレーション不可

## システム構成

### ディレクトリ構造

```
content/
├── posts/
│   ├── 2024-01-01-first-article.md
│   ├── 2024-01-02-second-article.md
│   ├── index.json (自動生成されるメタデータキャッシュ)
│   └── _templates/
│       └── post-template.md (記事テンプレート)
└── images/
    └── (記事の画像ファイル)

.next/cache/
└── markdown-build-cache.json (差分ビルド用キャッシュ)
```

### 主要コンポーネント

- **MarkdownArticleRepository**: ファイルシステムからMarkdown記事を読み取り
- **MarkdownArticleService**: 記事データ提供サービス
- **MarkdownRenderer**: Markdown → Reactコンポーネント変換
- **差分ビルドシステム**: 変更検知と効率的なビルド

## 使い方

### 1. 環境変数設定

`.env.local`ファイルを作成し、以下を設定：

```bash
# Markdown記事管理を使用
ARTICLE_SOURCE=markdown

# Markdownコンテンツディレクトリ（オプション）
# MARKDOWN_CONTENT_DIR=./content/posts
```

### 2. 新しい記事の作成

テンプレートをコピーして作成：

```bash
cp content/posts/_templates/post-template.md content/posts/2024-01-15-new-article.md
```

### 3. フロントマター記述

記事ファイルの先頭に以下の形式でメタデータを記述：

```yaml
---
title: "記事タイトル"
slug: "article-slug"
publishedAt: "2024-01-15T10:00:00+09:00"
updatedAt: "2024-01-15T10:00:00+09:00"
tags:
  - TypeScript
  - React
icon: "📝"
excerpt: "記事の要約"
series: ""
trend: false
relatedArticles: []
draft: false
author: "shabaraba"
---
```

#### フィールド説明

| フィールド | 必須 | 説明 |
|-----------|------|------|
| title | ✅ | 記事タイトル |
| slug | ✅ | URLスラッグ（一意である必要がある） |
| publishedAt | ✅ | 公開日時（ISO 8601形式） |
| updatedAt | ❌ | 更新日時 |
| tags | ❌ | タグリスト |
| icon | ❌ | アイコン（Emoji） |
| excerpt | ❌ | 記事の要約（リスト表示用） |
| series | ❌ | シリーズID |
| trend | ❌ | トレンド記事フラグ（デフォルト: false） |
| relatedArticles | ❌ | 関連記事のスラッグリスト |
| draft | ❌ | 下書きフラグ（デフォルト: false） |
| author | ❌ | 著者名 |

### 4. Markdown本文記述

#### 基本的なMarkdown記法

```markdown
# 見出し1
## 見出し2
### 見出し3

**太字**、*イタリック*、`インラインコード`

- 箇条書きリスト
- アイテム2

1. 番号付きリスト
2. アイテム2

> 引用

[リンク](https://example.com)
```

#### コードブロック

````markdown
```typescript:filename.ts
const greeting: string = "Hello, TypeScript";
console.log(greeting);
```
````

#### カスタムディレクティブ

**Callout（情報ボックス）:**

```markdown
:::callout{type="info" icon="💡"}
**重要なポイント**

ここに内容を記載します。
:::
```

タイプ: `info`, `warning`, `error`, `success`

**Toggle（折りたたみ）:**

```markdown
:::toggle{summary="詳細を表示"}
折りたたまれたコンテンツ
:::
```

**Bookmark:**

```markdown
:::bookmark
https://example.com
:::
```

### 5. 画像の配置

記事と同じディレクトリに画像を配置：

```
content/posts/
└── 2024-01-15-new-article.md
└── images/
    ├── cover.jpg
    └── diagram.png
```

Markdownでの参照：

```markdown
![画像の説明](./images/cover.jpg)
*図1: キャプション*
```

### 6. ビルドと確認

#### 開発サーバー起動

```bash
npm run dev
```

#### ビルド（全記事）

```bash
npm run build
```

#### 差分ビルド

```bash
npm run build:incremental
```

## 差分ビルドの仕組み

1. **ビルド前処理** (`npm run prebuild`)
   - `scripts/build-article-index.js` を実行
   - 各記事のハッシュ値を計算
   - 前回ビルドのキャッシュと比較
   - 変更された記事のみを処理対象とする

2. **キャッシュファイル**
   - `.next/cache/markdown-build-cache.json`: 各記事のハッシュ値
   - `content/posts/index.json`: 記事メタデータ一覧

3. **ログ出力例**

```
🔍 Building article index...
📄 Found 15 markdown files
📊 Total articles: 15
🔄 Changed: 2, Skipped: 13
✅ Article index saved to content/posts/index.json
💾 Build cache saved
```

## Notionからの移行手順

### 1. Notion記事をMarkdownにエクスポート

Notionの「エクスポート」機能で記事をMarkdown形式でエクスポート。

### 2. フロントマター追加

エクスポートしたMarkdownファイルの先頭にフロントマターを追加。

### 3. 画像パスの修正

Notionの画像URLを相対パスに変更し、画像ファイルを`content/posts/images/`に配置。

### 4. カスタムブロックの変換

Notionの特殊ブロックを対応するカスタムディレクティブに変換：

- Callout → `:::callout{type="info"}`
- Toggle → `:::toggle{summary="..."}`
- Bookmark → `:::bookmark`

### 5. 動作確認

```bash
# 環境変数設定
echo "ARTICLE_SOURCE=markdown" >> .env.local

# 開発サーバー起動
npm run dev

# ブラウザで確認
open http://localhost:3000/blog
```

## トラブルシューティング

### 記事が表示されない

- フロントマターの`draft: false`を確認
- `slug`が一意であることを確認
- `publishedAt`が正しい形式（ISO 8601）であることを確認

### ビルドエラー

```bash
# キャッシュをクリア
rm -rf .next/cache
rm content/posts/index.json

# 再ビルド
npm run build
```

### カスタムディレクティブが表示されない

- Markdown記法が正しいか確認
- :::で囲まれているか確認

## パフォーマンス

### ビルド時間比較

| 記事数 | Notion API | Markdown（初回） | Markdown（差分） |
|--------|-----------|-----------------|-----------------|
| 10記事 | ~30秒 | ~5秒 | ~2秒 |
| 50記事 | ~2分 | ~15秒 | ~3秒 |
| 100記事 | ~5分 | ~30秒 | ~5秒 |

### 最適化のポイント

1. 差分ビルドを活用（`npm run build:incremental`）
2. 記事インデックスキャッシュの利用
3. 画像の事前最適化

## まとめ

Markdownベースの記事管理システムにより、以下が実現できました：

✅ Git管理による記事の履歴管理
✅ 高速なビルド（Notion APIなし）
✅ オフライン編集
✅ 差分ビルドによる効率化
✅ Notionと同等の機能（カスタムディレクティブ）

## 参考リンク

- [Markdown Guide](https://www.markdownguide.org/)
- [remark/rehype ecosystem](https://github.com/remarkjs/remark)
- [Next.js Static Generation](https://nextjs.org/docs/basic-features/pages#static-generation)
