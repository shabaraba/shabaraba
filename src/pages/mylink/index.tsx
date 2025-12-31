import { InferGetStaticPropsType } from "next";
import Head from "next/head";
import { siteTitle } from "../../../next-seo.config";
import { MyLinkListPageUsecase } from "application/usecases/MyLinkListPageUsecase";
import { MyLinkEntity } from "core/entities/MyLinkEntity";
import { MyLinkType } from "core/types/MyLinkType";
import MyLinkPage from '../../themes/theme2/pages/MyLinkPage';

// 1ページあたりのマイリンク数（全件表示でタイムアウト回避）
const LINKS_PER_PAGE = 1000;

type Props = InferGetStaticPropsType<typeof getStaticProps>;

/**
 * マイリンクトップページ（1ページ目）
 * サーバーサイドレンダリング対応
 */
export default function MyLinkIndex({ mylinks, pagination }: Props) {
  // プレーンオブジェクトをMyLinkEntityインスタンスに変換
  const mylinkEntities = mylinks.map((mylink: MyLinkType) => new MyLinkEntity(mylink));

  return (
    <>
      <Head>
        <title>{siteTitle} - Links</title>
      </Head>
      <MyLinkPage mylinks={mylinkEntities} pagination={pagination} />
    </>
  );
}


/**
 * 1ページ目のデータを取得する関数
 * サーバーサイドレンダリング対応のページネーション
 */
export async function getStaticProps() {
  try {
    console.log('mylink/index.tsx - getStaticProps: Fetching data for page 1');

    // 全データを取得（プレーンオブジェクトとして）
    const result = await MyLinkListPageUsecase.getStaticProps();
    const allMyLinks = result.props.allData;

    // 1ページ目のデータを計算
    const paginatedLinks = allMyLinks.slice(0, LINKS_PER_PAGE);
    const totalPages = Math.ceil(allMyLinks.length / LINKS_PER_PAGE);

    console.log('mylink/index.tsx - getStaticProps: Data fetched successfully');
    console.log(`- Total mylinks: ${allMyLinks.length}`);
    console.log(`- Page 1 links: ${paginatedLinks.length}`);
    console.log(`- Total pages: ${totalPages}`);

    return {
      props: {
        mylinks: paginatedLinks,
        pagination: {
          totalItems: allMyLinks.length,
          itemsPerPage: LINKS_PER_PAGE,
          currentPage: 1,
          totalPages: totalPages
        }
      }
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    // 静的エクスポートではnotFoundは使用不可、空データを返す
    return {
      props: {
        mylinks: [],
        pagination: {
          totalItems: 0,
          itemsPerPage: LINKS_PER_PAGE,
          currentPage: 1,
          totalPages: 0
        }
      }
    };
  }
}
