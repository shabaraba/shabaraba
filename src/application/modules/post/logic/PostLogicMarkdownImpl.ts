import { ArticleServiceFactory } from "core/factories/ArticleServiceFactory";
import { ArticleService } from "core/interfaces/article/ArticleService";
import { IPageHead } from "core/types/NotionPageApiResponses";
import { Block } from "../objects/entities/blocks/Block";
import { PostDetailEntity } from "../objects/entities/PostDetailEntity";
import { PostLogic } from "./PostLogic";
import { BlockList } from "../objects/entities/blocks";
import { MarkdownBlock } from "../objects/entities/blocks/MarkdownBlock";

/**
 * Markdown/GitHub記事ソース用のPostLogic実装
 * ArticleServiceを使用して記事データを取得し、IPageHead形式に変換する
 */
export class PostLogicMarkdownImpl implements PostLogic {
  private readonly articleService: ArticleService;

  constructor() {
    this.articleService = ArticleServiceFactory.createArticleService();
  }

  async getList(): Promise<IPageHead[]> {
    const articles = await this.articleService.getArticleList();
    return articles.map(article => this.convertToPageHead(article));
  }

  async getTrendingPosts(): Promise<IPageHead[]> {
    const allPosts = await this.getList();
    return allPosts.filter(post => post.trend === true);
  }

  async getPathList(): Promise<string[]> {
    return await this.articleService.getArticleSlugs();
  }

  async getHeadBySlug(slug: string): Promise<IPageHead> {
    const article = await this.articleService.getArticleBySlug(slug);
    return this.convertToPageHead(article);
  }

  async getDetail(slug: string): Promise<PostDetailEntity> {
    const article = await this.articleService.getArticleBySlug(slug);

    const markdownBlock = new MarkdownBlock({
      id: article.id,
      content: article.content,
    });

    const blockList = new BlockList([markdownBlock]);
    return new PostDetailEntity(blockList);
  }

  async getBlock(id: string): Promise<Block> {
    throw new Error("getBlock is not supported for Markdown/GitHub sources");
  }

  private convertToPageHead(article: any): IPageHead {
    return {
      id: article.id,
      title: article.title,
      slug: article.slug,
      publishedAt: article.publishedAt.toString(),
      updatedAt: article.updatedAt?.toString(),
      tags: article.tags?.map((tag: string, index: number) => ({
        id: index,
        color: this.getTagColor(tag),
        name: tag,
      })),
      icon: article.icon ? { type: 'emoji' as const, emoji: article.icon } : undefined,
      cover: article.coverImage ? {
        external: {
          type: 'external' as const,
          url: article.coverImage,
        }
      } : undefined,
    };
  }

  private getTagColor(tagName: string): string {
    const colorMap: { [key: string]: string } = {
      'Design': '#FF6B6B',
      '開発環境とツール活用': '#F38181',
      '個人開発・自動化プロジェクト': '#AA96DA',
      'ポエム': '#95E1D3',
      'キャリアと子育ての両立': '#FCBAD3',
    };

    return colorMap[tagName] || '#E0E0E0';
  }
}
