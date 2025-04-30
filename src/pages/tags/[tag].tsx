import React from 'react';
import dynamic from 'next/dynamic';
import { GetStaticPropsContext, GetStaticPathsResult } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { ACTIVE_THEME } from '../../lib/themeSelector';
import { IPageHead } from 'core/types/NotionPageApiResponses';
import { CommonDataService } from '../../services/CommonDataService';

// 動的にテーマのホームページコンポーネントをインポート
const HomePage = dynamic(() =>
  import(`../../themes/${ACTIVE_THEME}/pages/HomePage`).then(mod => mod.default),
  {
    // loading: () => <Loading />, // 読み込み中に表示されるコンポーネント
    loading: () => null,
    ssr: false, // 必要に応じて
  }

);

// 1ページあたりの記事数
const POSTS_PER_PAGE = 10;

// タグページのパラメータの型定義
interface TagPageParams extends ParsedUrlQuery {
  tag: string;
  page?: string;
}

interface TagPageProps {
  articles: IPageHead[];
  tag: string;
  sidebarData: {
    trendingPosts: IPageHead[];
    tags: any[];
    series: any[];
  };
  pagination?: {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    totalPages: number;
  };
}

/**
 * タグページコンポーネント
 * 特定のタグに関連する記事一覧を表示します
 * ページネーション対応
 */
export default function TagPage({ articles, tag, sidebarData, pagination }: TagPageProps) {
  // タイトルをタグ名に合わせて表示
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

/**
 * 静的パスを生成するための関数
 * タグごとに複数のページパスを生成
 */
export async function getStaticPaths(): Promise<GetStaticPathsResult<TagPageParams>> {
  try {
    console.log('tags/[tag].tsx - getStaticPaths: Generating tag page paths');
    const commonData = await CommonDataService.getAllData();

    // パスを格納する配列
    const paths = [];

    // すべてのタグを収集
    const tagMap: { [tagName: string]: IPageHead[] } = {};
    commonData.posts.forEach(post => {
      if (post.tags) {
        post.tags.forEach(tag => {
          // tagがオブジェクトであることを確認
          if (tag && typeof tag === 'object' && tag.name) {
            const tagName = tag.name.toLowerCase();
            if (!tagMap[tagName]) {
              tagMap[tagName] = [];
            }
            tagMap[tagName].push(post);
          }
        });
      }
    });

    // 各タグに対してページパスを生成
    Object.entries(tagMap).forEach(([tagName, tagPosts]) => {
      const totalPages = Math.ceil(tagPosts.length / POSTS_PER_PAGE);

      // タグのページ1（例: /tags/javascript）
      paths.push({
        params: { tag: tagName }
      });

      // タグの2ページ目以降（例: /tags/javascript?page=2）
      for (let page = 2; page <= totalPages; page++) {
        paths.push({
          params: {
            tag: tagName,
            page: page.toString()
          }
        });
      }
    });

    console.log(`Generated ${paths.length} tag page paths for SSG`);

    return {
      paths,
      fallback: false, // 存在しないパスは404
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
 * タグページの静的生成のためのデータ取得関数
 * ページネーション対応
 */
export async function getStaticProps(context: GetStaticPropsContext<TagPageParams>) {
  // URLパラメータからタグ名とページ番号を取得
  const tagName = context.params?.tag ?? '';
  const page = context.params?.page ? parseInt(context.params.page) : 1;

  try {
    console.log(`tags/[tag].tsx - getStaticProps: Fetching data for tag "${tagName}", page ${page}`);

    // ページネーション対応のデータ取得メソッドを使用
    const paginatedData = await CommonDataService.getPaginatedArticlesByTag(tagName, page, POSTS_PER_PAGE);

    console.log(`tags/[tag].tsx - getStaticProps: Data fetched successfully for tag "${tagName}", page ${page}`);
    console.log(`- Page articles: ${paginatedData.items.length}`);
    console.log(`- Total articles: ${paginatedData.totalItems}`);
    console.log(`- Total pages: ${paginatedData.totalPages}`);

    // 記事がない場合は404を返す
    if (paginatedData.totalItems === 0) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        articles: paginatedData.items,
        tag: tagName,
        sidebarData: paginatedData.sidebarData!,
        pagination: {
          totalItems: paginatedData.totalItems,
          itemsPerPage: paginatedData.pageSize,
          currentPage: paginatedData.currentPage,
          totalPages: paginatedData.totalPages
        }
      }
    };
  } catch (error) {
    console.error(`Error fetching articles for tag "${tagName}":`, error);
    return {
      notFound: true,
    };
  }
}
