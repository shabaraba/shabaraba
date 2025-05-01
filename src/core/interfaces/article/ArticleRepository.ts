/**
 * 記事リポジトリのインターフェース
 * NotionやMarkdownなど、異なるデータソースからの記事取得を抽象化します
 */
export interface ArticleListItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: Date;
  updatedAt?: Date;
  coverImage?: string;
  tags?: string[];
}

export interface Article extends ArticleListItem {
  content: any; // コンテンツの形式はソースによって異なるため、anyとする
  relatedArticles?: ArticleListItem[]; // 関連記事
}

export interface ArticleRepository {
  /**
   * 記事一覧を取得する
   */
  getArticleList(): Promise<ArticleListItem[]>;
  
  /**
   * スラッグから記事を取得する
   * @param slug 記事のスラッグ
   */
  getArticleBySlug(slug: string): Promise<Article>;
  
  /**
   * 全ての記事のスラッグを取得する
   */
  getArticleSlugs(): Promise<string[]>;
}
