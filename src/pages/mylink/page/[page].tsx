import { InferGetStaticPropsType, GetStaticPropsContext, GetStaticPathsResult } from "next";
import { ParsedUrlQuery } from 'querystring';
import Head from "next/head";
import { siteTitle } from "../../../../next-seo.config";
import { MyLinkListPageUsecase } from "application/usecases/MyLinkListPageUsecase";
import { MyLinkEntity } from "core/entities/MyLinkEntity";
import { MyLinkType } from "core/types/MyLinkType";
import MyLinkPage from '../../../themes/theme2/pages/MyLinkPage';

// 1ページあたりのマイリンク数（全件表示でタイムアウト回避）
const LINKS_PER_PAGE = 1000;

// ページパラメータの型定義
interface PageParams extends ParsedUrlQuery {
  page: string;
}

type Props = InferGetStaticPropsType<typeof getStaticProps>;

/**
 * マイリンクページ（2ページ目以降）
 * サーバーサイドレンダリング対応のページネーション
 */
export default function MyLinkPageIndex({ mylinks, pagination }: Props) {
  // プレーンオブジェクトをMyLinkEntityインスタンスに変換
  const mylinkEntities = mylinks.map((mylink: MyLinkType) => new MyLinkEntity(mylink));

  return (
    <>
      <Head>
        <title>{siteTitle} - Links (Page {pagination.currentPage})</title>
      </Head>
      <MyLinkPage mylinks={mylinkEntities} pagination={pagination} />
    </>
  );
}

/**
 * 静的パスを生成するための関数
 * 全ページのパスを事前生成
 */
export async function getStaticPaths(): Promise<GetStaticPathsResult<PageParams>> {
  try {
    console.log('mylink/page/[page].tsx - getStaticPaths: Generating page paths');

    // 全データを取得してページ数を計算
    const result = await MyLinkListPageUsecase.getStaticProps();
    const totalPages = Math.ceil(result.props.allData.length / LINKS_PER_PAGE);

    // 2ページ目以降のパスを生成（1ページ目は /mylink に配置）
    const paths = [];
    for (let page = 2; page <= totalPages; page++) {
      paths.push({
        params: { page: page.toString() }
      });
    }

    console.log(`Generated ${paths.length} mylink page paths (pages 2-${totalPages})`);

    return {
      paths,
      fallback: false, // 存在しないパスは404
    };
  } catch (error) {
    console.error('Error generating mylink page paths:', error);
    return {
      paths: [],
      fallback: false,
    };
  }
}

/**
 * ページごとのデータを取得する関数
 */
export async function getStaticProps(context: GetStaticPropsContext<PageParams>) {
  const pageNumber = parseInt(context.params?.page ?? '1', 10);

  try {
    console.log(`mylink/page/[page].tsx - getStaticProps: Fetching data for page ${pageNumber}`);

    // 全データを取得（プレーンオブジェクトとして）
    const result = await MyLinkListPageUsecase.getStaticProps();
    const allMyLinks = result.props.allData;

    // ページネーション計算
    const startIndex = (pageNumber - 1) * LINKS_PER_PAGE;
    const endIndex = startIndex + LINKS_PER_PAGE;
    const paginatedLinks = allMyLinks.slice(startIndex, endIndex);
    const totalPages = Math.ceil(allMyLinks.length / LINKS_PER_PAGE);

    // ページ番号の妥当性チェック
    if (pageNumber < 1 || pageNumber > totalPages) {
      return {
        notFound: true,
      };
    }

    console.log(`mylink/page/[page].tsx - getStaticProps: Page ${pageNumber} has ${paginatedLinks.length} links`);

    return {
      props: {
        mylinks: paginatedLinks,
        pagination: {
          totalItems: allMyLinks.length,
          itemsPerPage: LINKS_PER_PAGE,
          currentPage: pageNumber,
          totalPages: totalPages
        }
      }
    };
  } catch (error) {
    console.error(`Error in getStaticProps for page ${pageNumber}:`, error);
    return {
      notFound: true,
    };
  }
}
