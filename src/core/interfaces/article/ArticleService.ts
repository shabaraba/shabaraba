import { Article, ArticleListItem } from './ArticleRepository';

/**
 * 記事サービスのインターフェース
 * アプリケーション層と記事データソース間のインターフェース
 */
export interface ArticleService {
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
