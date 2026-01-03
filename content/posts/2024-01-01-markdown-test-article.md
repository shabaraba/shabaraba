---
title: "Markdownベースの記事システムのテスト"
slug: "markdown-test-article"
publishedAt: "2024-01-01T10:00:00+09:00"
updatedAt: "2024-01-01T10:00:00+09:00"
tags:
  - Markdown
  - テスト
  - 技術ブログ
icon: "🚀"
excerpt: "Markdownベースの新しい記事管理システムのテスト記事です。"
coverImage: "/images/articles/markdown-test-cover.jpg"
series: ""
trend: false
relatedArticles: []
draft: false
author: "shabaraba"
---

# Markdownベースの記事システムのテスト

この記事は、Notionから移行した新しいMarkdownベースの記事管理システムのテスト用記事です。

## 基本的なMarkdown記法

### 段落とテキスト装飾

通常の段落テキストです。改行も正しく表示されます。

**太字のテキスト**、*イタリック体*、`インラインコード`などが使えます。

### リスト

#### 箇条書きリスト

- アイテム1
- アイテム2
  - ネストされたアイテム
  - もう一つのネストアイテム
- アイテム3

#### 番号付きリスト

1. 最初の項目
2. 2番目の項目
3. 3番目の項目

## コードブロック

TypeScriptのサンプルコード：

```typescript:example.ts
interface User {
  id: number;
  name: string;
  email: string;
}

const users: User[] = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob", email: "bob@example.com" },
];

function getUserById(id: number): User | undefined {
  return users.find(user => user.id === id);
}

console.log(getUserById(1));
```

## 引用

> Markdownは、軽量マークアップ言語の一つです。
>
> 読みやすく、書きやすいプレーンテキスト形式で文書を作成できます。

### ネストされた引用

> 外側の引用文です。
>
>> これはネストされた引用です。
>> 深い階層の引用もサポートしています。
>
> 外側の引用に戻ります。

## ブックマーク（OGPカード）

外部リンクをOGPカード形式で表示できます：

:::bookmark{url="https://zenn.dev" title="Zenn" description="エンジニアのための情報共有コミュニティ" site="zenn.dev" image="https://zenn.dev/images/logo-only-dark.png"}
:::

:::bookmark{url="https://github.com" title="GitHub" description="世界最大の開発プラットフォーム。GitHubはソフトウェア開発を効率化する場所です。" site="github.com"}
:::

## カスタムディレクティブ

### Callout（情報ボックス）

:::callout{type="info" icon="💡"}
**ポイント**

この記事システムでは、Notionと同等の機能をMarkdownで実現しています。
:::

:::callout{type="warning" icon="⚠️"}
**注意**

カスタムディレクティブは拡張記法のため、標準的なMarkdownエディタでは正しく表示されない場合があります。
:::

### Toggle（折りたたみ）

:::toggle{summary="詳細な実装内容を見る"}
Markdownベースの記事管理システムは以下のコンポーネントで構成されています：

- **MarkdownArticleRepository**: ファイルシステムからMarkdownファイルを読み取る
- **MarkdownArticleService**: 記事データを提供するサービス層
- **MarkdownRenderer**: Markdown→Reactコンポーネント変換
- **差分ビルドシステム**: 変更された記事のみを再ビルド

これにより、高速なビルドと柔軟な記事管理を実現しています。
:::

## テーブル

| 機能 | Notion | Markdown |
|------|--------|----------|
| バージョン管理 | ❌ | ✅ Git |
| オフライン編集 | ❌ | ✅ 可能 |
| ビルド速度 | 🐢 遅い | 🚀 高速 |
| 学習コスト | 低 | 中 |

## リンク

詳細は[公式ドキュメント](https://example.com)を参照してください。

---

## まとめ

Markdownベースの記事管理システムにより、以下のメリットが得られます：

1. **Git管理**: 記事の履歴管理とレビューが容易
2. **高速ビルド**: ファイルシステムベースで高速
3. **オフライン編集**: インターネット接続不要
4. **拡張性**: カスタムディレクティブで機能拡張

今後も継続的に改善していきます。
