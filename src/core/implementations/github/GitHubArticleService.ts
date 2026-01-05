import { ArticleService } from '../../interfaces/article/ArticleService';
import { Article, ArticleListItem } from '../../interfaces/article/ArticleRepository';
import { GitHubArticleRepository } from './GitHubArticleRepository';

/**
 * GitHubリポジトリを利用した記事サービスの実装
 * データソース: shabaraba/articles リポジトリ
 */
export class GitHubArticleService implements ArticleService {
  private repository: GitHubArticleRepository;

  constructor() {
    this.repository = new GitHubArticleRepository();
  }

  /**
   * 記事一覧を取得する
   */
  async getArticleList(): Promise<ArticleListItem[]> {
    return this.repository.getArticleList();
  }

  /**
   * スラッグから記事を取得する
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
