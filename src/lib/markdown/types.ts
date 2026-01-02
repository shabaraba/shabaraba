/**
 * Markdown記事のフロントマター型定義
 */
export interface ArticleFrontmatter {
  /** 記事タイトル */
  title: string;
  /** URLスラッグ */
  slug: string;
  /** 公開日時 */
  publishedAt: string;
  /** 更新日時 */
  updatedAt?: string;
  /** タグリスト */
  tags?: string[];
  /** カバー画像パス（相対パスまたは絶対パス） */
  coverImage?: string;
  /** アイコン（Emoji） */
  icon?: string;
  /** 記事の要約 */
  excerpt?: string;
  /** シリーズID */
  series?: string;
  /** トレンド記事フラグ */
  trend?: boolean;
  /** 関連記事のスラッグリスト */
  relatedArticles?: string[];
  /** 下書きフラグ */
  draft?: boolean;
  /** 著者名 */
  author?: string;
  /** OG画像パス（カスタム指定時） */
  ogImage?: string;
  /** メタディスクリプション */
  description?: string;
}

/**
 * パース済みMarkdown記事
 */
export interface ParsedMarkdownArticle {
  /** フロントマター */
  frontmatter: ArticleFrontmatter;
  /** Markdown本文 */
  content: string;
  /** ファイルパス */
  filePath: string;
}

/**
 * Markdownパーサーオプション
 */
export interface MarkdownParserOptions {
  /** ベースディレクトリ（画像パス解決用） */
  baseDir: string;
  /** OGP情報を取得するか */
  fetchOGP?: boolean;
}

/**
 * カスタムディレクティブノード（Callout用）
 */
export interface CalloutNode {
  type: 'callout';
  data: {
    type: 'info' | 'warning' | 'error' | 'success';
    icon?: string;
  };
  children: any[];
}

/**
 * カスタムディレクティブノード（Toggle用）
 */
export interface ToggleNode {
  type: 'toggle';
  data: {
    summary: string;
  };
  children: any[];
}

/**
 * カスタムディレクティブノード（Bookmark用）
 */
export interface BookmarkNode {
  type: 'bookmark';
  data: {
    url: string;
    ogp?: {
      title?: string;
      description?: string;
      image?: string;
      siteName?: string;
    };
  };
}
