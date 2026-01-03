
import { ArticleService } from '../../interfaces/article/ArticleService';
import { Article, ArticleListItem } from '../../interfaces/article/ArticleRepository';
import { MarkdownArticleRepository } from './MarkdownArticleRepository';

/**
 * Markdownファイルを利用した記事サービスの実装
 * 注意: このクラスはサーバーサイドでのみ使用可能
 */
export class MarkdownArticleService implements ArticleService {
  private repository: MarkdownArticleRepository;

  constructor(contentDir?: string) {
    this.repository = new MarkdownArticleRepository(contentDir);
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
