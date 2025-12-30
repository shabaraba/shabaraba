import React from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { GetStaticPropsContext, GetStaticPathsResult } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { ACTIVE_THEME } from '../../config/themeSelector';
import { IPageHead } from 'core/types/NotionPageApiResponses';
import { CommonDataService } from '../../services/CommonDataService';

// 動的にテーマのホームページコンポーネントをインポート
const HomePage = dynamic(() =>
  import(`../../themes/${ACTIVE_THEME}/pages/HomePage`).then(mod => mod.default),
  {
    // loading: () => <Loading />, // 読み込み中に表示されるコンポーネント
    loading: () => null,
    ssr: true,
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
}

/**
 * タグページコンポーネント
 * 特定のタグに関連する記事一覧を表示します
 * クライアントサイドページネーション対応
 */
function TagPageWrapper(props: TagPageProps) {
  const router = useRouter();
  const { tag, articles, sidebarData } = props;

  // URLからページ番号を取得（デフォルトは1ページ目）
  const page = router.query.page ? parseInt(router.query.page as string, 10) : 1;

  // 表示すべき記事を計算
  const startIndex = (page - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const paginatedArticles = articles.slice(startIndex, endIndex);

  // 総ページ数を計算
  const totalPages = Math.ceil(articles.length / POSTS_PER_PAGE);

  // タイトルをタグ名に合わせて表示
  const title = `${tag} の記事一覧 | Coffee Break Point`;
  const description = `「${tag}」タグに関連する記事一覧ページです`;

  // ページネーション情報を追加
  const pagination = {
    totalItems: articles.length,
    itemsPerPage: POSTS_PER_PAGE,
    currentPage: page,
    totalPages: totalPages
  };

  return (
    <HomePage
      articles={paginatedArticles}
      sidebarData={sidebarData}
      customTitle={title}
      customDescription={description}
      tagName={tag}
      pagination={pagination}
    />
  );
}

export default TagPageWrapper;

/**
 * 静的パスを生成するための関数
 * タグごとに1つのページパスを生成（クライアントサイドページネーション対応）
 */
export async function getStaticPaths(): Promise<GetStaticPathsResult<TagPageParams>> {
  try {
    console.log('tags/[tag].tsx - getStaticPaths: Generating tag page paths');
    const commonData = await CommonDataService.getAllData();

    // パスを格納する配列
    const paths = [];

    // すべてのタグを収集
    const tagSet = new Set<string>();
    commonData.posts.forEach(post => {
      if (post.tags) {
        post.tags.forEach(tag => {
          // tagがオブジェクトであることを確認
          if (tag && typeof tag === 'object' && tag.name) {
            tagSet.add(tag.name.toLowerCase());
          }
        });
      }
    });

    // 各タグに対してベースパスを生成
    tagSet.forEach(tagName => {
      paths.push({
        params: { tag: tagName }
      });
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
 * クライアントサイドページネーション対応
 */
export async function getStaticProps(context: GetStaticPropsContext<TagPageParams>) {
  // URLパラメータからタグ名を取得
  const tagName = context.params?.tag ?? '';

  try {
    console.log(`tags/[tag].tsx - getStaticProps: Fetching data for tag "${tagName}"`);

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

    console.log(`tags/[tag].tsx - getStaticProps: Data fetched successfully for tag "${tagName}"`);
    console.log(`- Total articles: ${taggedArticles.length}`);

    // 記事がない場合は404を返す
    if (taggedArticles.length === 0) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        articles: taggedArticles,
        tag: tagName,
        sidebarData: {
          trendingPosts: commonData.trendingPosts,
          tags: commonData.tags,
          series: commonData.series
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
