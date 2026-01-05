/**
 * 記事メタデータのバリデーションとエンリッチメント
 */

import { ArticleFrontmatter, EnrichedArticle, Taxonomy, TrendScores, TagDefinition, SeriesDefinition } from './types';

export class ArticleValidator {
  constructor(
    private taxonomy: Taxonomy,
    private trendScores: TrendScores
  ) {}

  /**
   * 記事のバリデーションとエンリッチメント
   */
  validate(frontmatter: ArticleFrontmatter): EnrichedArticle {
    // タグの検証と解決
    const tagObjects = this.resolveTags(frontmatter.tags, frontmatter.slug);

    // シリーズの検証と解決
    const seriesObject = frontmatter.series
      ? this.resolveSeries(frontmatter.series, frontmatter.slug)
      : undefined;

    // トレンドスコアの取得
    const trendScore = this.trendScores.scores[frontmatter.slug];

    return {
      ...frontmatter,
      tagObjects,
      seriesObject,
      trendScore,
    };
  }

  /**
   * タグIDの配列をTagDefinitionに解決（厳格モード）
   *
   * 戦略：
   * - 存在しないタグID → ビルドエラー（データ整合性保証）
   * - 空配列 → 許容（タグなし記事に対応）
   *
   * @param tagIds - Frontmatterで指定されたタグID配列
   * @param slug - エラーメッセージ用の記事slug
   * @returns 解決されたTagDefinition配列
   */
  private resolveTags(tagIds: string[], slug: string): TagDefinition[] {
    // 空配列は許容
    if (tagIds.length === 0) {
      return [];
    }

    const tags: TagDefinition[] = [];

    for (const tagId of tagIds) {
      const tag = this.taxonomy.tags.find(t => t.id === tagId);

      if (!tag) {
        throw new Error(
          `❌ Build failed: Invalid tag "${tagId}" in article "${slug}"\n` +
          `   Available tags: ${this.taxonomy.tags.map(t => t.id).join(', ')}\n` +
          `   Please check taxonomy.toml`
        );
      }

      tags.push(tag);
    }

    return tags;
  }

  /**
   * シリーズIDをSeriesDefinitionに解決（厳格モード）
   *
   * 戦略：
   * - 存在しないシリーズID → ビルドエラー（データ整合性保証）
   *
   * @param seriesId - Frontmatterで指定されたシリーズID
   * @param slug - エラーメッセージ用の記事slug
   * @returns 解決されたSeriesDefinition
   */
  private resolveSeries(seriesId: string, slug: string): SeriesDefinition {
    const series = this.taxonomy.series.find(s => s.id === seriesId);

    if (!series) {
      throw new Error(
        `❌ Build failed: Invalid series "${seriesId}" in article "${slug}"\n` +
        `   Available series: ${this.taxonomy.series.map(s => s.id).join(', ')}\n` +
        `   Please check taxonomy.toml`
      );
    }

    return series;
  }
}

/**
 * 複数記事の一括バリデーション
 */
export function validateArticles(
  articles: ArticleFrontmatter[],
  taxonomy: Taxonomy,
  trendScores: TrendScores
): EnrichedArticle[] {
  const validator = new ArticleValidator(taxonomy, trendScores);
  return articles.map(article => validator.validate(article));
}
