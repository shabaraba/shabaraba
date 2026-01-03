import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { ArticleRepository, ArticleListItem, Article } from '../../interfaces/article/ArticleRepository';
import { ArticleFrontmatter } from '../../../lib/markdown/types';

export class MarkdownArticleRepository implements ArticleRepository {
  private contentDir: string;

  constructor(contentDir?: string) {
    this.contentDir = contentDir || path.join(process.cwd(), 'content', 'posts');
  }

  /**
   * 記事一覧を取得する
   */
  async getArticleList(): Promise<ArticleListItem[]> {
    try {
      const files = await this.getAllMarkdownFiles();
      const articles: ArticleListItem[] = [];

      for (const file of files) {
        const content = await fs.readFile(file, 'utf-8');
        const { data } = matter(content);
        const frontmatter = data as ArticleFrontmatter;

        // 下書きは除外
        if (frontmatter.draft) {
          continue;
        }

        articles.push(this.convertToArticleListItem(frontmatter, file));
      }

      // 公開日降順でソート（ISO文字列として比較）
      return articles.sort((a, b) =>
        new Date(b.publishedAt as any).getTime() - new Date(a.publishedAt as any).getTime()
      );
    } catch (error) {
      console.error('Error fetching article list from Markdown:', error);
      throw error;
    }
  }

  /**
   * スラッグから記事を取得する
   */
  async getArticleBySlug(slug: string): Promise<Article> {
    try {
      const filePath = await this.findFileBySlug(slug);
      if (!filePath) {
        throw new Error(`Article with slug "${slug}" not found`);
      }

      const content = await fs.readFile(filePath, 'utf-8');
      const { data: frontmatterData, content: markdown } = matter(content);
      const frontmatter = frontmatterData as ArticleFrontmatter;

      // 下書きは取得不可
      if (frontmatter.draft) {
        throw new Error(`Article with slug "${slug}" is a draft`);
      }

      const articleListItem = this.convertToArticleListItem(frontmatter, filePath);

      // 関連記事を取得
      const relatedArticles = frontmatter.relatedArticles
        ? await this.getRelatedArticles(frontmatter.relatedArticles)
        : [];

      return {
        ...articleListItem,
        content: markdown, // Markdown本文をそのまま渡す（後続のパーサーで処理）
        relatedArticles,
      };
    } catch (error) {
      console.error(`Error fetching article with slug "${slug}":`, error);
      throw error;
    }
  }

  /**
   * 全ての記事のスラッグを取得する
   */
  async getArticleSlugs(): Promise<string[]> {
    try {
      const files = await this.getAllMarkdownFiles();
      const slugs: string[] = [];

      for (const file of files) {
        const content = await fs.readFile(file, 'utf-8');
        const { data } = matter(content);
        const frontmatter = data as ArticleFrontmatter;

        // 下書きは除外
        if (!frontmatter.draft && frontmatter.slug) {
          slugs.push(frontmatter.slug);
        }
      }

      return slugs;
    } catch (error) {
      console.error('Error fetching article slugs from Markdown:', error);
      throw error;
    }
  }

  /**
   * 全てのMarkdownファイルを再帰的に取得
   */
  private async getAllMarkdownFiles(): Promise<string[]> {
    const files: string[] = [];

    try {
      await this.walkDirectory(this.contentDir, files);
    } catch (error) {
      console.error('Error walking directory:', error);
    }

    return files;
  }

  /**
   * ディレクトリを再帰的に探索
   */
  private async walkDirectory(dir: string, files: string[]): Promise<void> {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          // _templatesディレクトリはスキップ
          if (entry.name !== '_templates') {
            await this.walkDirectory(fullPath, files);
          }
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      console.error(`Error reading directory ${dir}:`, error);
    }
  }

  /**
   * スラッグからファイルを検索
   */
  private async findFileBySlug(slug: string): Promise<string | null> {
    const files = await this.getAllMarkdownFiles();

    for (const file of files) {
      try {
        const content = await fs.readFile(file, 'utf-8');
        const { data } = matter(content);
        const frontmatter = data as ArticleFrontmatter;

        if (frontmatter.slug === slug) {
          return file;
        }
      } catch (error) {
        console.error(`Error reading file ${file}:`, error);
      }
    }

    return null;
  }

  /**
   * 関連記事を取得
   */
  private async getRelatedArticles(slugs: string[]): Promise<ArticleListItem[]> {
    const relatedArticles: ArticleListItem[] = [];

    for (const slug of slugs) {
      try {
        const filePath = await this.findFileBySlug(slug);
        if (!filePath) continue;

        const content = await fs.readFile(filePath, 'utf-8');
        const { data } = matter(content);
        const frontmatter = data as ArticleFrontmatter;

        // 下書きは除外
        if (frontmatter.draft) continue;

        relatedArticles.push(this.convertToArticleListItem(frontmatter, filePath));
      } catch (error) {
        console.error(`Error fetching related article ${slug}:`, error);
      }
    }

    return relatedArticles;
  }

  /**
   * フロントマターをArticleListItemに変換
   */
  private convertToArticleListItem(
    frontmatter: ArticleFrontmatter,
    filePath: string
  ): ArticleListItem {
    // 日付をISO文字列に変換（JSONシリアライズ可能にするため）
    const publishedDate = new Date(frontmatter.publishedAt);
    const updatedDate = frontmatter.updatedAt ? new Date(frontmatter.updatedAt) : undefined;

    return {
      id: frontmatter.slug,
      slug: frontmatter.slug,
      title: frontmatter.title,
      excerpt: frontmatter.excerpt || '',
      publishedAt: publishedDate.toISOString() as any, // ISO文字列に変換
      updatedAt: updatedDate?.toISOString() as any,
      coverImage: this.resolveCoverImagePath(frontmatter.coverImage, filePath),
      icon: frontmatter.icon,
      tags: frontmatter.tags || [],
    };
  }

  /**
   * カバー画像パスを解決
   * 相対パスの場合は絶対パスに変換
   */
  private resolveCoverImagePath(coverImage: string | undefined, filePath: string): string | undefined {
    if (!coverImage) return undefined;

    // 既に絶対パスまたはURLの場合はそのまま返す
    if (coverImage.startsWith('/') || coverImage.startsWith('http')) {
      return coverImage;
    }

    // 相対パス（./images/cover.jpg など）の場合
    const fileDir = path.dirname(filePath);
    const absolutePath = path.join(fileDir, coverImage);

    // プロジェクトルートからの相対パスに変換
    const relativePath = path.relative(process.cwd(), absolutePath);

    // publicディレクトリからの相対パスに変換（静的ファイル配信用）
    return '/' + relativePath.replace(/\\/g, '/');
  }
}
