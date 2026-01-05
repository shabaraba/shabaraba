/**
 * GitHub記事取得の統合テスト
 *
 * 環境変数設定:
 * ARTICLE_SOURCE=github
 * GITHUB_TOKEN=<optional>
 *
 * 実行方法:
 * ARTICLE_SOURCE=github npm test -- src/tests/integration/github-article-repository.test.ts
 */

import { GitHubArticleRepository } from '../../core/implementations/github/GitHubArticleRepository';

describe('GitHubArticleRepository Integration Test', () => {
  let repository: GitHubArticleRepository;

  beforeAll(() => {
    repository = new GitHubArticleRepository();
  });

  it('should fetch article list from GitHub', async () => {
    const articles = await repository.getArticleList();

    expect(articles).toBeDefined();
    expect(Array.isArray(articles)).toBe(true);
    expect(articles.length).toBeGreaterThan(0);

    const firstArticle = articles[0];
    expect(firstArticle).toHaveProperty('slug');
    expect(firstArticle).toHaveProperty('title');
    expect(firstArticle).toHaveProperty('tags');
    expect(firstArticle).toHaveProperty('publishedAt');
  }, 30000);

  it('should fetch article by slug', async () => {
    const articles = await repository.getArticleList();
    const firstSlug = articles[0].slug;

    const article = await repository.getArticleBySlug(firstSlug);

    expect(article).toBeDefined();
    expect(article.slug).toBe(firstSlug);
    expect(article.content).toBeDefined();
    expect(article.content.length).toBeGreaterThan(0);
  }, 30000);

  it('should fetch all article slugs', async () => {
    const slugs = await repository.getArticleSlugs();

    expect(slugs).toBeDefined();
    expect(Array.isArray(slugs)).toBeDefined();
    expect(slugs.length).toBeGreaterThan(0);
    expect(typeof slugs[0]).toBe('string');
  }, 30000);

  it('should resolve tag IDs to labels using taxonomy', async () => {
    const articles = await repository.getArticleList();
    const articleWithTags = articles.find(a => a.tags && a.tags.length > 0);

    if (articleWithTags) {
      expect(articleWithTags.tags[0]).toBeDefined();
      expect(typeof articleWithTags.tags[0]).toBe('string');
      // タグはIDではなくラベルに変換されているはず
      expect(articleWithTags.tags[0]).not.toMatch(/^[a-z-]+$/);
    }
  }, 30000);

  it('should throw error for invalid slug', async () => {
    await expect(
      repository.getArticleBySlug('non-existent-article-slug-12345')
    ).rejects.toThrow();
  }, 30000);
});
