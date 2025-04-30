import { ArticleService } from "../../interfaces/article/ArticleService";
import { Article, ArticleListItem } from "../../interfaces/article/ArticleRepository";
import { NotionArticleRepository } from "./NotionArticleRepository";

/**
 * Notion APIを利用した記事サービスの実装
 */
export class NotionArticleService implements ArticleService {
  private repository: NotionArticleRepository;

  constructor() {
    this.repository = new NotionArticleRepository();
  }

  /**
   * 記事一覧を取得する
   */
  async getArticleList(): Promise<ArticleListItem[]> {
    return this.repository.getArticleList();
  }

  /**
   * スラッグから記事を取得する
   * @param slug 記事のスラッグ
   */
  async getArticleBySlug(slug: string): Promise<Article> {
    return this.repository.getArticleBySlug(slug);
  }

  /**
   * 全ての記事のスラッグを取得する
   */
  async getArticleSlugs(): Promise<string[]> {
    return this.repository.getArticleSlugs();
  }
}
