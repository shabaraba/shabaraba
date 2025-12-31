import React from 'react';
import { GetStaticPropsContext, GetStaticPathsResult } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { IPageHead } from 'core/types/NotionPageApiResponses';
import { CommonDataService } from '../../../services/CommonDataService';
import HomePage from '../../../themes/theme2/pages/HomePage';

// 1ページあたりの記事数
const POSTS_PER_PAGE = 10;

// タグページのパラメータの型定義
interface TagPageParams extends ParsedUrlQuery {
  tag: string;
}

interface TagPageProps {
  articles: IPageHead[];
  tag: string;
  sidebarData: {
    trendingPosts: IPageHead[];
    tags: any[];
    series: any[];
  };
  pagination: {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    totalPages: number;
  };
}

/**
 * タグページコンポーネント（1ページ目）
 * サーバーサイドレンダリング対応
 */
function TagPage({ tag, articles, sidebarData, pagination }: TagPageProps) {
  const title = `${tag} の記事一覧 | Coffee Break Point`;
  const description = `「${tag}」タグに関連する記事一覧ページです`;

  return (
    <HomePage
      articles={articles}
      sidebarData={sidebarData}
      customTitle={title}
      customDescription={description}
      tagName={tag}
      pagination={pagination}
    />
  );
}

export default TagPage;

/**
 * 静的パスを生成するための関数
 * タグごとに1ページ目のパスを生成
 */
export async function getStaticPaths(): Promise<GetStaticPathsResult<TagPageParams>> {
  try {
    console.log('tags/[tag]/index.tsx - getStaticPaths: Generating tag page paths');
    const commonData = await CommonDataService.getAllData();

    // すべてのタグを収集
    const tagSet = new Set<string>();
    commonData.posts.forEach(post => {
      if (post.tags) {
        post.tags.forEach(tag => {
          if (tag && typeof tag === 'object' && tag.name) {
            tagSet.add(tag.name.toLowerCase());
          }
        });
      }
    });

    // 各タグの1ページ目のパスを生成
    const paths = Array.from(tagSet).map(tagName => ({
      params: { tag: tagName }
    }));

    console.log(`Generated ${paths.length} tag page paths for SSG`);

    return {
      paths,
      fallback: false,
    };
  } catch (error) {
    console.error('Error generating tag paths:', error);
    return {
      paths: [],
      fallback: false,
    };
  }
}

/**
 * タグページの静的生成のためのデータ取得関数（1ページ目）
 * サーバーサイドレンダリング対応
 */
export async function getStaticProps(context: GetStaticPropsContext<TagPageParams>) {
  const tagName = context.params?.tag ?? '';

  try {
    console.log(`tags/[tag]/index.tsx - getStaticProps: Fetching data for tag "${tagName}", page 1`);

    // 全データを取得
    const commonData = await CommonDataService.getAllData();

    // 指定されたタグの記事をフィルタリング
    const taggedArticles = commonData.posts.filter(post => {
      if (!post.tags) return false;
      return post.tags.some(tag => {
        if (tag && typeof tag === 'object' && tag.name) {
          return tag.name.toLowerCase() === tagName;
        }
        return false;
      });
    });

    // 記事がない場合（静的エクスポートではnotFoundは使用不可）
    if (taggedArticles.length === 0) {
      return {
        props: {
          articles: [],
          tag: tagName,
          sidebarData: { trendingPosts: [], tags: [], series: [] },
          pagination: { totalItems: 0, itemsPerPage: POSTS_PER_PAGE, currentPage: 1, totalPages: 0 }
        }
      };
    }

    // 1ページ目のデータを計算
    const paginatedArticles = taggedArticles.slice(0, POSTS_PER_PAGE);
    const totalPages = Math.ceil(taggedArticles.length / POSTS_PER_PAGE);

    console.log(`tags/[tag]/index.tsx - getStaticProps: Data fetched successfully for tag "${tagName}"`);
    console.log(`- Total articles: ${taggedArticles.length}`);
    console.log(`- Page 1 articles: ${paginatedArticles.length}`);
    console.log(`- Total pages: ${totalPages}`);

    return {
      props: {
        articles: paginatedArticles,
        tag: tagName,
        sidebarData: {
          trendingPosts: commonData.trendingPosts,
          tags: commonData.tags,
          series: commonData.series
        },
        pagination: {
          totalItems: taggedArticles.length,
          itemsPerPage: POSTS_PER_PAGE,
          currentPage: 1,
          totalPages: totalPages
        }
      }
    };
  } catch (error) {
    console.error(`Error fetching articles for tag "${tagName}":`, error);
    // 静的エクスポートではnotFoundは使用不可、空データを返す
    return {
      props: {
        articles: [],
        tag: tagName,
        sidebarData: { trendingPosts: [], tags: [], series: [] },
        pagination: { totalItems: 0, itemsPerPage: POSTS_PER_PAGE, currentPage: 1, totalPages: 0 }
      }
    };
  }
}
