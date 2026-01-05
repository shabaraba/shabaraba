/**
 * GitHub Articles リポジトリのデータ型定義
 */

/**
 * タグ定義（taxonomy.toml）
 */
export interface TagDefinition {
  id: string;           // タグID（frontmatterで参照）
  label: string;        // 表示名
  color?: string;       // 表示色（HEX）
  description?: string; // 説明
}

/**
 * シリーズ定義（taxonomy.toml）
 */
export interface SeriesDefinition {
  id: string;           // シリーズID（frontmatterで参照）
  title: string;        // シリーズ名
  description?: string; // 説明
  order?: number;       // 表示順序
}

/**
 * タクソノミー全体（taxonomy.toml）
 */
export interface Taxonomy {
  tags: TagDefinition[];
  series: SeriesDefinition[];
}

/**
 * トレンドスコア（trends.toml）
 *
 * TOML形式:
 * [scores]
 * "entity-vs-value-object" = 85
 * "coding-with-claude" = 92
 */
export interface TrendScores {
  scores: Record<string, number>;
}

/**
 * 記事のFrontmatter
 */
export interface ArticleFrontmatter {
  // 必須項目
  slug: string;
  title: string;
  published: boolean;
  publishedAt: string;

  // タクソノミー参照
  tags: string[];       // TagDefinition.id を参照
  series?: string;      // SeriesDefinition.id を参照

  // 記事固有データ
  coverImage?: string;
  excerpt?: string;
  icon?: string;
  updatedAt?: string;

  // 表示制御
  toc?: boolean;
  comments?: boolean;

  // その他
  relatedArticles?: string[];
  draft?: boolean;
}

/**
 * Frontmatter + メタデータ結合後の記事データ
 */
export interface EnrichedArticle extends ArticleFrontmatter {
  // タクソノミーから解決されたデータ
  tagObjects: TagDefinition[];      // tags配列から解決
  seriesObject?: SeriesDefinition;  // seriesから解決

  // トレンドスコア
  trendScore?: number;              // trends.jsonから取得
}
