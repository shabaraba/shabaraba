/**
 * TOML/Markdownパーサー
 */

import * as TOML from '@iarna/toml';
import matter from 'gray-matter';
import { Taxonomy, TrendScores, ArticleFrontmatter } from './types';

/**
 * taxonomy.toml をパース
 */
export function parseTaxonomy(tomlContent: string): Taxonomy {
  try {
    const parsed = TOML.parse(tomlContent) as any;

    return {
      tags: parsed.tags || [],
      series: parsed.series || [],
    };
  } catch (error) {
    throw new Error(`Failed to parse taxonomy.toml: ${error}`);
  }
}

/**
 * trends.toml をパース
 */
export function parseTrends(tomlContent: string): TrendScores {
  try {
    const parsed = TOML.parse(tomlContent) as any;

    return {
      scores: parsed.scores || {},
    };
  } catch (error) {
    throw new Error(`Failed to parse trends.toml: ${error}`);
  }
}

/**
 * Markdownファイルのfrontmatterをパース
 */
export function parseMarkdownFrontmatter(markdownContent: string): {
  frontmatter: ArticleFrontmatter;
  content: string;
} {
  try {
    const { data, content } = matter(markdownContent);

    // frontmatterの必須項目チェック
    if (!data.slug || !data.title || typeof data.published !== 'boolean' || !data.publishedAt) {
      throw new Error(
        `Missing required frontmatter fields. Required: slug, title, published, publishedAt`
      );
    }

    // tagsのデフォルト値（空配列）
    if (!Array.isArray(data.tags)) {
      data.tags = [];
    }

    return {
      frontmatter: data as ArticleFrontmatter,
      content,
    };
  } catch (error) {
    throw new Error(`Failed to parse Markdown frontmatter: ${error}`);
  }
}
