# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 開発コマンド

### 基本的な開発フロー
```bash
# 開発サーバー起動（TOML設定の自動変換を含む）
npm run dev

# ビルド（GitHubプロフィール取得、OG画像生成、Next.js ビルドを順次実行）
npm run build

# 静的サイト配信
npm start

# テスト実行
npm test
npm run test:watch  # 変更監視モード
```

### 特殊なビルドコマンド
```bash
# OG画像生成のみ
npm run generate-og

# バンドルサイズ解析
npm run analyze

# サイトマップ生成（ビルド後に自動実行）
npm run postbuild
```

### 重要な前処理
- `npm run dev`と`npm run build`の前に`convert-toml-to-json.js`が自動実行される
- TOML設定ファイル（`src/config/site.toml`）がJSONに変換され`public/config/site-config.json`に出力される

## プロジェクト構成

### アーキテクチャ概要
このプロジェクトは**Next.js静的サイト生成**を基盤とした技術ブログで、以下の特徴を持つ：

- **Notion API連携**: 記事コンテンツをNotionから取得
- **多段階ビルドプロセス**: GitHubプロフィール取得 → OG画像生成 → Next.jsビルド
- **レイヤー分離アーキテクチャ**: Clean Architectureパターンを採用

### ディレクトリ構造
```
src/
├── application/           # アプリケーション層
│   ├── modules/          # ドメイン別モジュール
│   │   └── mylink/       # MyLinkドメイン（外部リンク管理）
│   │       ├── logic/    # ビジネスロジック
│   │       ├── objects/  # データオブジェクト（Entity, DTO, DXO）
│   │       └── repositories/ # データアクセス層
│   └── usecases/         # ユースケース実装
├── components/           # Reactコンポーネント
├── config/              # 設定ファイル
│   └── site.toml        # サイト設定（TOML形式）
├── core/                # 型定義
│   └── types/           # 共通型定義
├── lib/                 # ユーティリティ・共通機能
├── pages/               # Next.jsページ
├── services/            # 外部サービス連携
├── styles/              # スタイル定義
├── tests/               # テストファイル
└── themes/              # テーマ設定
```

### 重要な設計パターン

#### 1. レイヤー分離
- **Application Layer**: ビジネスロジックとユースケース
- **Core Layer**: 型定義とドメインオブジェクト
- **Infrastructure**: 外部API連携（Notion、GitHub等）

#### 2. モジュール構成（application/modules/）
各ドメインは以下の構造を持つ：
- `logic/`: ビジネスロジック実装
- `objects/entities/`: ドメインエンティティ
- `objects/dtos/`: データ転送オブジェクト
- `objects/dxos/`: データ交換オブジェクト
- `repositories/`: データアクセス抽象化

#### 3. 設定管理
- TOMLファイル（`src/config/site.toml`）で設定を管理
- ビルド時にJSONに変換されクライアントサイドからアクセス可能

## 技術スタック

### フレームワーク・ライブラリ
- **Next.js 15**: 静的サイト生成（SSG）
- **React 18**: UIライブラリ
- **Chakra UI**: UIコンポーネントライブラリ
- **TypeScript**: 型安全性確保

### 外部サービス連携
- **Notion API**: 記事コンテンツ管理
- **GitHub API**: プロフィール情報取得
- **Netlify**: ホスティング・デプロイ

### テスト環境
- **Jest**: テストフレームワーク
- **@testing-library/react**: React コンポーネントテスト
- **@testing-library/jest-dom**: DOM テスト拡張

## 開発時の注意事項

### ビルド設定
- TypeScript型チェックとESLintは一時的に無効化されている（`next.config.js`）
- 画像最適化は無効化（静的出力のため）
- `/posts/*` から `/blog/posts/*` へのリダイレクト設定あり

### 環境変数
- `NEXT_PUBLIC_ACTIVE_THEME`: アクティブテーマ設定（デフォルト: theme2）
- `ARTICLE_SOURCE`: 記事ソース設定（デフォルト: notion）
- `BUILD_TIME`: OG画像のキャッシュバスティング用

### テスト実行
```bash
# 全テスト実行
npm test

# 単一テスト実行例
npm test src/tests/unit/lib/config.test.ts

# 監視モード
npm run test:watch
```

### 設定変更時の注意
- `src/config/site.toml`を編集した場合、開発サーバー再起動で自動的にJSONに変換される
- OG画像生成は重い処理のため、必要時のみ`npm run generate-og`を実行

## 特殊な機能

### OG画像自動生成
- 記事ごとのOG画像を動的生成
- Canvas APIとSkia-canvasを使用
- ビルド時に自動実行、または手動で`npm run generate-og`

### GitHub プロフィール連携
- ビルド時にGitHubプロフィール情報を取得
- 著者情報の動的更新

### Notion連携アーキテクチャ
- `BaseNotionRepository`を基盤としたリポジトリパターン
- Notion APIレスポンスの型安全な変換処理
- 記事とMyLink（外部リンク）の統一管理