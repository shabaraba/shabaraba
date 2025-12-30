import React from 'react';
import dynamic from 'next/dynamic';
import { GetStaticPropsContext, GetStaticPathsResult } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { ACTIVE_THEME } from '../../../../config/themeSelector';
import { IPageHead } from 'core/types/NotionPageApiResponses';
import { CommonDataService } from '../../../../services/CommonDataService';

// 動的にテーマのホームページコンポーネントをインポート
const HomePage = dynamic(() =>
  import(`../../../../themes/${ACTIVE_THEME}/pages/HomePage`).then(mod => mod.default),
  {
    loading: () => null,
    ssr: true,
  }
);

// 1ページあたりの記事数
const POSTS_PER_PAGE = 10;

// タグページパラメータの型定義
interface TagPageParams extends ParsedUrlQuery {
  tag: string;
  page: string;
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
 * タグページコンポーネント（2ページ目以降）
 * サーバーサイドレンダリング対応のページネーション
 */
function TagPage({ articles, tag, sidebarData, pagination }: TagPageProps) {
  const title = `${tag} の記事一覧 (Page ${pagination.currentPage}) | Coffee Break Point`;
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
 * タグごと、ページごとのパスを事前生成
 */
export async function getStaticPaths(): Promise<GetStaticPathsResult<TagPageParams>> {
  try {
    console.log('tags/[tag]/page/[page].tsx - getStaticPaths: Generating tag page paths');
    const commonData = await CommonDataService.getAllData();

    const paths = [];

    // タグごとに記事をグループ化
    const tagArticles: { [key: string]: IPageHead[] } = {};
    commonData.posts.forEach(post => {
      if (post.tags) {
        post.tags.forEach(tag => {
          if (tag && typeof tag === 'object' && tag.name) {
            const tagName = tag.name.toLowerCase();
            if (!tagArticles[tagName]) {
              tagArticles[tagName] = [];
            }
            tagArticles[tagName].push(post);
          }
        });
      }
    });

    // 各タグの2ページ目以降のパスを生成
    Object.keys(tagArticles).forEach(tagName => {
      const articles = tagArticles[tagName];
      const totalPages = Math.ceil(articles.length / POSTS_PER_PAGE);

      // 2ページ目以降のパスを生成（1ページ目は /tags/[tag] に配置）
      for (let page = 2; page <= totalPages; page++) {
        paths.push({
          params: { tag: tagName, page: page.toString() }
        });
      }
    });

    console.log(`Generated ${paths.length} tag page paths`);

    return {
      paths,
      fallback: false,
    };
  } catch (error) {
    console.error('Error generating tag page paths:', error);
    return {
      paths: [],
      fallback: false,
    };
  }
}

/**
 * タグページの静的生成のためのデータ取得関数
 */
export async function getStaticProps(context: GetStaticPropsContext<TagPageParams>) {
  const tagName = context.params?.tag ?? '';
  const pageNumber = parseInt(context.params?.page ?? '1', 10);

  try {
    console.log(`tags/[tag]/page/[page].tsx - getStaticProps: Fetching data for tag "${tagName}", page ${pageNumber}`);

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

    // ページネーション計算
    const startIndex = (pageNumber - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    const paginatedArticles = taggedArticles.slice(startIndex, endIndex);
    const totalPages = Math.ceil(taggedArticles.length / POSTS_PER_PAGE);

    // ページ番号の妥当性チェック
    if (pageNumber < 1 || pageNumber > totalPages || taggedArticles.length === 0) {
      return {
        notFound: true,
      };
    }

    console.log(`tags/[tag]/page/[page].tsx - getStaticProps: Page ${pageNumber} has ${paginatedArticles.length} articles`);

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
          currentPage: pageNumber,
          totalPages: totalPages
        }
      }
    };
  } catch (error) {
    console.error(`Error fetching articles for tag "${tagName}", page ${pageNumber}:`, error);
    return {
      notFound: true,
    };
  }
}
