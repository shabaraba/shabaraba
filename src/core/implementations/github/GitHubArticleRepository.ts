import { ArticleRepository, ArticleListItem, Article } from '../../interfaces/article/ArticleRepository';
import { GitHubClient } from '../../../lib/github/client';
import { parseTaxonomy, parseTrends, parseMarkdownFrontmatter } from '../../../lib/github/parser';
import { Taxonomy, TrendScores } from '../../../lib/github/types';

/**
 * GitHubリポジトリから記事を取得するRepository実装
 *
 * データソース: shabaraba/articles リポジトリ
 * - metadata/taxonomy.toml: タグ・シリーズ定義
 * - metadata/trends.toml: 人気度スコア
 * - articles/*.md: 記事本文
 */
export class GitHubArticleRepository implements ArticleRepository {
  private client: GitHubClient;
  private taxonomy: Taxonomy | null = null;
  private trendScores: TrendScores | null = null;
  private articlesCache: Map<string, any> = new Map();

  constructor() {
    this.client = new GitHubClient({
      owner: process.env.GITHUB_OWNER || 'shabaraba',
      repo: process.env.GITHUB_REPO || 'articles',
      branch: process.env.GITHUB_BRANCH || 'main',
      token: process.env.GITHUB_TOKEN,
    });
  }

  /**
   * メタデータ（taxonomy, trends）を読み込み
   */
  private async loadMetadata(): Promise<void> {
    if (this.taxonomy && this.trendScores) {
      return; // 既に読み込み済み
    }

    console.log('[GitHubArticleRepository] Loading metadata...');

    // taxonomy.toml を取得
    const taxonomyFile = await this.client.getFile('metadata/taxonomy.toml');
    if (!taxonomyFile) {
      throw new Error('taxonomy.toml not found');
    }
    this.taxonomy = parseTaxonomy(taxonomyFile.content);

    // trends.toml を取得
    const trendsFile = await this.client.getFile('metadata/trends.toml');
    if (!trendsFile) {
      throw new Error('trends.toml not found');
    }
    this.trendScores = parseTrends(trendsFile.content);

    console.log('[GitHubArticleRepository] Metadata loaded successfully');
  }

  /**
   * 全記事を取得してキャッシュ
   */
  private async loadAllArticles(): Promise<void> {
    if (this.articlesCache.size > 0) {
      return; // 既にキャッシュ済み
    }

    await this.loadMetadata();

    console.log('[GitHubArticleRepository] Fetching all articles...');

    const files = await this.client.getDirectoryFiles('articles');
    console.log(`[GitHubArticleRepository] Found ${files.length} articles`);

    for (const file of files) {
      try {
        const { frontmatter, content } = parseMarkdownFrontmatter(file.content);

        // published=false の記事はスキップ
        if (!frontmatter.published) {
          continue;
        }

        this.articlesCache.set(frontmatter.slug, {
          frontmatter,
          content,
          filePath: file.path,
        });
      } catch (error) {
        console.error(`[GitHubArticleRepository] Error parsing ${file.path}:`, error);
      }
    }

    console.log(`[GitHubArticleRepository] Loaded ${this.articlesCache.size} published articles`);
  }

  /**
   * 記事一覧を取得
   */
  async getArticleList(): Promise<ArticleListItem[]> {
    await this.loadAllArticles();

    const articles: ArticleListItem[] = [];

    for (const [slug, data] of Array.from(this.articlesCache.entries())) {
      const { frontmatter } = data;

      articles.push({
        id: slug,
        slug: frontmatter.slug,
        title: frontmatter.title,
        excerpt: frontmatter.excerpt || this.extractExcerptFromContent(data.content),
        publishedAt: frontmatter.publishedAt as any,
        updatedAt: frontmatter.updatedAt as any,
        coverImage: frontmatter.coverImage,
        icon: frontmatter.icon,
        tags: this.resolveTagLabels(frontmatter.tags),
      });
    }

    // 公開日降順でソート
    return articles.sort((a, b) =>
      new Date(b.publishedAt as any).getTime() - new Date(a.publishedAt as any).getTime()
    );
  }

  /**
   * スラッグから記事を取得
   */
  async getArticleBySlug(slug: string): Promise<Article> {
    await this.loadAllArticles();

    const data = this.articlesCache.get(slug);
    if (!data) {
      throw new Error(`Article with slug "${slug}" not found`);
    }

    const { frontmatter, content } = data;

    // 関連記事を取得（手動設定がある場合はそれを使用、なければ自動推薦）
    let relatedArticles: ArticleListItem[] = [];
    if (frontmatter.relatedArticles && frontmatter.relatedArticles.length > 0) {
      relatedArticles = await this.getRelatedArticles(frontmatter.relatedArticles);
    } else {
      // 自動推薦: 同じタグを持つ最新記事を最大3件取得
      relatedArticles = await this.getRecommendedArticles(slug, frontmatter.tags || []);
    }

    return {
      id: slug,
      slug: frontmatter.slug,
      title: frontmatter.title,
      excerpt: frontmatter.excerpt || this.extractExcerptFromContent(content),
      publishedAt: frontmatter.publishedAt as any,
      updatedAt: frontmatter.updatedAt as any,
      coverImage: frontmatter.coverImage,
      icon: frontmatter.icon,
      tags: this.resolveTagLabels(frontmatter.tags),
      content, // Markdown本文
      relatedArticles,
    };
  }

  /**
   * 全記事のスラッグを取得
   */
  async getArticleSlugs(): Promise<string[]> {
    await this.loadAllArticles();
    return Array.from(this.articlesCache.keys());
  }

  /**
   * 関連記事を取得
   */
  private async getRelatedArticles(slugs: string[]): Promise<ArticleListItem[]> {
    const relatedArticles: ArticleListItem[] = [];

    for (const slug of slugs) {
      const data = this.articlesCache.get(slug);
      if (!data) continue;

      const { frontmatter, content } = data;

      relatedArticles.push({
        id: slug,
        slug: frontmatter.slug,
        title: frontmatter.title,
        excerpt: frontmatter.excerpt || this.extractExcerptFromContent(content),
        publishedAt: frontmatter.publishedAt as any,
        updatedAt: frontmatter.updatedAt as any,
        coverImage: frontmatter.coverImage,
        icon: frontmatter.icon,
        tags: this.resolveTagLabels(frontmatter.tags),
      });
    }

    return relatedArticles;
  }

  /**
   * 関連記事を自動推薦（同じタグを持つ記事から最大3件）
   */
  private async getRecommendedArticles(currentSlug: string, tags: string[]): Promise<ArticleListItem[]> {
    if (!tags || tags.length === 0) {
      return [];
    }

    const allArticles = await this.getArticleList();

    // 現在の記事を除外し、タグが一致する記事をスコアリング
    const scoredArticles = allArticles
      .filter(article => article.slug !== currentSlug)
      .map(article => {
        const matchingTags = article.tags?.filter(tag =>
          tags.some(currentTag => {
            // タグIDまたはラベルで比較
            const currentTagLabel = this.resolveTagLabels([currentTag])[0];
            return tag === currentTag || tag === currentTagLabel;
          })
        ) || [];

        return {
          article,
          score: matchingTags.length, // マッチしたタグの数をスコアとする
        };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => {
        // スコアが同じ場合は公開日が新しい順
        if (a.score === b.score) {
          return new Date(b.article.publishedAt).getTime() - new Date(a.article.publishedAt).getTime();
        }
        return b.score - a.score;
      });

    // 上位3件を返す
    return scoredArticles.slice(0, 3).map(item => item.article);
  }

  /**
   * タグIDから表示ラベルに変換
   */
  private resolveTagLabels(tagIds: string[]): string[] {
    if (!this.taxonomy) return tagIds;

    return tagIds.map(tagId => {
      const tag = this.taxonomy!.tags.find(t => t.id === tagId);
      return tag ? tag.label : tagId;
    });
  }

  /**
   * Markdown本文からexcerptを抽出（150文字 + "..."）
   */
  private extractExcerptFromContent(markdown: string, maxLength: number = 150): string {
    let text = markdown
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
      .replace(/!\[([^\]]*)\]\([^\)]+\)/g, '')
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\*\*([^\*]+)\*\*/g, '$1')
      .replace(/\*([^\*]+)\*/g, '$1')
      .replace(/^>\s+/gm, '')
      .replace(/^[\*\-\+]\s+/gm, '')
      .replace(/^\d+\.\s+/gm, '')
      .replace(/:::[a-z]+(\{[^\}]*\})?[\s\S]*?:::/g, '')
      .replace(/^[\-\*_]{3,}$/gm, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    text = text.replace(/\n/g, ' ');
    text = text.replace(/\s{2,}/g, ' ');

    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }

    return text;
  }
}
