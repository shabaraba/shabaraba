---
title: "記事タイトル"
slug: "article-slug"
publishedAt: "2024-01-01T00:00:00+09:00"
updatedAt: "2024-01-01T00:00:00+09:00"
tags:
  - TypeScript
  - React
coverImage: "./images/cover.jpg"
icon: "📝"
excerpt: "記事の要約を2-3行で記述"
series: ""
trend: false
relatedArticles: []
draft: false
author: "shabaraba"
---

# 記事タイトル

記事の本文をここに記述します。

## セクション1

### サブセクション

通常のMarkdown記法が使えます。

## コードブロック

```typescript:example.ts
const greeting: string = "Hello, TypeScript";
console.log(greeting);
```

## Callout（拡張記法）

:::callout{type="info" icon="💡"}
**重要なポイント**

ここに重要な情報を記載します。
:::

:::callout{type="warning" icon="⚠️"}
注意事項をここに記載します。
:::

## Toggle（折りたたみ）

:::toggle{summary="詳細を表示"}
折りたたまれたコンテンツをここに記載します。

- リストも使えます
- ネストも可能
:::

## リスト

- アイテム1
  - ネストアイテム1-1
  - ネストアイテム1-2
- アイテム2

## 番号付きリスト

1. 最初の項目
2. 2番目の項目
3. 3番目の項目

## 引用

> 引用テキストをここに記載します。
>
> — 著者名

## テーブル

| カラム1 | カラム2 | カラム3 |
|---------|---------|---------|
| データ1 | データ2 | データ3 |
| データ4 | データ5 | データ6 |

## 画像

![画像の説明](./images/example.png)
*図1: 画像のキャプション*

## リンク

[リンクテキスト](https://example.com)

## Bookmark

:::bookmark
https://www.typescriptlang.org/docs/
:::
