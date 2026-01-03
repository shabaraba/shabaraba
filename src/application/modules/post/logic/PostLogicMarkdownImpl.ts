
import { IPageHead } from "core/types/NotionPageApiResponses";
import { Block } from "../objects/entities/blocks/Block";
import { PostDetailEntity } from "../objects/entities/PostDetailEntity";
import { PostLogic } from "./PostLogic";
import { ArticleServiceFactory } from "core/factories/ArticleServiceFactory";

/**
 * Markdownソース用のPostLogic実装
 * ArticleServiceを使用して記事データを取得する
 *
 * 注意: このクラスはサーバーサイドでのみ使用可能
 */
export class PostLogicMarkdownImpl implements PostLogic {

  private getArticleService() {
    return ArticleServiceFactory.createArticleService();
  }

  async getList(): Promise<IPageHead[]> {
    const articleService = this.getArticleService();
    const articles = await articleService.getArticleList();
    return articles as IPageHead[];
  }

  async getTrendingPosts(): Promise<IPageHead[]> {
    // Markdownではtrendフラグで判定
    const articles = await this.getList();
    const trendingPosts = articles.filter((article: any) => article.trend === true);

    // トレンド記事がない場合は最新5件を返す
    if (trendingPosts.length === 0) {
      return articles.slice(0, 5);
    }

    return trendingPosts;
  }

  async getPathList(): Promise<string[]> {
    const articleService = this.getArticleService();
    const slugs = await articleService.getArticleSlugs();
    return slugs;
  }

  async getHeadBySlug(slug: string): Promise<IPageHead> {
    const articles = await this.getList();
    const article = articles.find((a: any) => a.slug === slug);

    if (!article) {
      throw new Error(`Article with slug "${slug}" not found`);
    }

    return article;
  }

  async getDetail(slug: string): Promise<PostDetailEntity> {
    // Markdownの場合はArticleServiceから取得
    const articleService = this.getArticleService();
    const article = await articleService.getArticleBySlug(slug);

    // PostDetailEntityに変換
    // Markdownの場合はcontentフィールドを使用
    return {
      content: article.content,
      blocks: [], // Markdownではブロック構造は使わない
    } as any;
  }

  async getBlock(id: string): Promise<Block> {
    throw new Error("getBlock is not supported for Markdown source");
  }
}
