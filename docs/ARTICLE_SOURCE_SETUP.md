# 記事データソースの設定

このプロジェクトは、記事のデータソースを3つから選択できます：

1. **Notion API** (デフォルト)
2. **ローカルMarkdownファイル**
3. **GitHub リポジトリ** (shabaraba/articles)

## 設定方法

`.env`ファイルで`ARTICLE_SOURCE`環境変数を設定します。

### 1. Notion API

```bash
ARTICLE_SOURCE=notion
NOTION_TOKEN=your_token
NOTION_BLOG_DATABASE=your_database_id
```

- Notion Integrationトークンが必要
- Notionデータベースから記事を動的に取得

### 2. ローカルMarkdownファイル

```bash
ARTICLE_SOURCE=markdown
MARKDOWN_CONTENT_DIR=./content/posts  # オプション（デフォルト値）
```

- `content/posts/`ディレクトリの`.md`ファイルを読み込み
- ローカル開発時に便利

### 3. GitHub リポジトリ

```bash
ARTICLE_SOURCE=github
GITHUB_TOKEN=ghp_xxxxxxxxxxxx  # オプション（推奨）
GITHUB_OWNER=shabaraba         # オプション（デフォルト値）
GITHUB_REPO=articles           # オプション（デフォルト値）
GITHUB_BRANCH=main             # オプション（デフォルト値）
```

- `shabaraba/articles`リポジトリから記事を取得
- GitHub GraphQL APIを使用（効率的な一括取得）
- `GITHUB_TOKEN`を設定するとレート制限が緩和される（推奨）

#### GitHub トークンの取得方法

1. https://github.com/settings/tokens にアクセス
2. "Generate new token (classic)" をクリック
3. スコープで`repo`を選択
4. トークンを生成して`.env`に設定

## データ構造の違い

### GitHub リポジトリの構造

```
shabaraba/articles/
├── articles/              # 記事本文（Markdown）
│   ├── example.md
│   └── ...
├── metadata/
│   ├── taxonomy.toml      # タグ・シリーズ定義
│   └── trends.toml        # 人気度スコア
└── .github/
    └── workflows/
        └── validate.yml   # 自動バリデーション
```

### Frontmatter形式（GitHub）

```yaml
---
slug: "my-article"
title: "記事タイトル"
published: true
publishedAt: "2024-01-01"

tags: ["design", "ddd"]     # taxonomy.tomlで定義されたID
series: "ddd-intro"         # 任意: シリーズID

coverImage: "https://..."   # 任意
excerpt: "記事の説明"          # 任意
icon: "📝"                  # 任意
---

記事本文...
```

## バリデーション

### GitHub リポジトリ

- 記事をpushする際に自動バリデーション（GitHub Actions）
- タグ・シリーズIDが`taxonomy.toml`に存在するかチェック
- 必須フィールドの検証

### ローカルMarkdown

- ビルド時にバリデーション
- フィールド形式のチェック

## テスト方法

### GitHub統合テスト

```bash
# GitHub APIから記事を取得してテスト
ARTICLE_SOURCE=github npm test -- src/tests/integration/github-article-repository.test.ts
```

### 統合テスト全体

```bash
npm test
```

## トラブルシューティング

### GitHub API Rate Limit

**問題**: `API rate limit exceeded`エラー

**解決策**:
1. `GITHUB_TOKEN`を設定（認証済みだと5000リクエスト/時）
2. または、ビルド頻度を下げる

### タグ・シリーズエラー

**問題**: `Invalid tag "xxx"`エラー

**原因**: `taxonomy.toml`に定義されていないタグIDを使用

**解決策**:
1. `shabaraba/articles/metadata/taxonomy.toml`にタグを追加
2. または、記事のfrontmatterを修正

## 推奨設定

### 開発環境

```bash
ARTICLE_SOURCE=markdown
```

- ローカルファイルで高速開発
- GitHubへの依存なし

### 本番環境（Netlify等）

```bash
ARTICLE_SOURCE=github
GITHUB_TOKEN=<secret>
```

- 記事管理を別リポジトリで一元化
- 記事の更新時に自動デプロイ（Webhookで連携）

## 参考リンク

- [GitHub GraphQL API](https://docs.github.com/en/graphql)
- [Notion API](https://developers.notion.com/)
- [記事リポジトリ](https://github.com/shabaraba/articles)
