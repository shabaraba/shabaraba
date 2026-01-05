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
        const fileContent = await fs.readFile(file, 'utf-8');
        const { data, content } = matter(fileContent);
        const frontmatter = data as ArticleFrontmatter;

        // 下書きは除外
        if (frontmatter.draft) {
          continue;
        }

        articles.push(this.convertToArticleListItem(frontmatter, file, content));
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

        const fileContent = await fs.readFile(filePath, 'utf-8');
        const { data, content } = matter(fileContent);
        const frontmatter = data as ArticleFrontmatter;

        // 下書きは除外
        if (frontmatter.draft) continue;

        relatedArticles.push(this.convertToArticleListItem(frontmatter, filePath, content));
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
    filePath: string,
    markdownContent?: string
  ): ArticleListItem {
    // 日付をISO文字列に変換（JSONシリアライズ可能にするため）
    const publishedDate = new Date(frontmatter.publishedAt);
    const updatedDate = frontmatter.updatedAt ? new Date(frontmatter.updatedAt) : undefined;

    // excerptがない場合は本文から自動生成
    const excerpt = frontmatter.excerpt ||
      (markdownContent ? this.extractExcerptFromContent(markdownContent) : '');

    return {
      id: frontmatter.slug,
      slug: frontmatter.slug,
      title: frontmatter.title,
      excerpt,
      publishedAt: publishedDate.toISOString() as any, // ISO文字列に変換
      updatedAt: updatedDate?.toISOString() as any,
      coverImage: this.resolveCoverImagePath(frontmatter.coverImage, filePath),
      icon: frontmatter.icon,
      tags: frontmatter.tags || [],
    };
  }

  /**
   * Markdown本文からexcerptを抽出（150文字 + "..."）
   */
  private extractExcerptFromContent(markdown: string, maxLength: number = 150): string {
    // Markdownの記法を除去してプレーンテキスト化
    let text = markdown
      // 見出し記号を削除
      .replace(/^#{1,6}\s+/gm, '')
      // リンク記法を削除（テキスト部分のみ残す）
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
      // 画像記法を削除
      .replace(/!\[([^\]]*)\]\([^\)]+\)/g, '')
      // コードブロックを削除
      .replace(/```[\s\S]*?```/g, '')
      // インラインコードを削除
      .replace(/`([^`]+)`/g, '$1')
      // 太字・斜体記号を削除
      .replace(/\*\*([^\*]+)\*\*/g, '$1')
      .replace(/\*([^\*]+)\*/g, '$1')
      .replace(/__([^_]+)__/g, '$1')
      .replace(/_([^_]+)_/g, '$1')
      // 引用記号を削除
      .replace(/^>\s+/gm, '')
      // 箇条書き記号を削除
      .replace(/^[\*\-\+]\s+/gm, '')
      .replace(/^\d+\.\s+/gm, '')
      // カスタムディレクティブを削除
      .replace(/:::[a-z]+(\{[^\}]*\})?[\s\S]*?:::/g, '')
      // 水平線を削除
      .replace(/^[\-\*_]{3,}$/gm, '')
      // 複数の空白行を1つに
      .replace(/\n{3,}/g, '\n\n')
      // 前後の空白を削除
      .trim();

    // 改行を空白に変換
    text = text.replace(/\n/g, ' ');

    // 複数の空白を1つに
    text = text.replace(/\s{2,}/g, ' ');

    // 指定文字数で切り取り
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }

    return text;
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
