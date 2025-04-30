import { InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { siteTitle } from "../../../next-seo.config";
import { MyLinkListPageUsecase } from "application/usecases/MyLinkListPageUsecase";
import { MyLinkEntity } from "core/entities/MyLinkEntity";
import { MyLinkType } from "core/types/MyLinkType";
import { getThemePage } from "../../lib/themeSelector";
import dynamic from "next/dynamic";

import { ACTIVE_THEME } from '../../lib/themeSelector';

// 1ページあたりのマイリンク数
const LINKS_PER_PAGE = 10;

type Props = InferGetStaticPropsType<typeof getStaticProps>;

// テーマに応じたMyLinkPageをインポート（ページネーション情報も受け取れるように型を更新）
// const MyLinkPage = getThemePage<React.ComponentType<{ 
//   mylinks: MyLinkEntity[],
//   pagination?: {
//     totalItems: number;
//     itemsPerPage: number;
//     currentPage: number;
//     totalPages: number;
//   }
// }>>("MyLinkPage");

const MyLinkPage = dynamic(() =>
  import(`../../themes/${ACTIVE_THEME}/pages/MyLinkPage`).then(mod => mod.default)
);

// クライアントサイドでページネーションを行うラッパーコンポーネント
export default function MyLinkIndex({ allData }: Props) {
  const router = useRouter();
  
  // URLからページ番号を取得（デフォルトは1ページ目）
  const page = router.query.page ? parseInt(router.query.page as string, 10) : 1;
  
  // エンティティ変換
  const allMyLinks: MyLinkEntity[] = allData.map(
    (mylink: MyLinkType) => new MyLinkEntity(mylink)
  );
  
  // 表示すべきリンクを計算
  const startIndex = (page - 1) * LINKS_PER_PAGE;
  const endIndex = startIndex + LINKS_PER_PAGE;
  const paginatedLinks = allMyLinks.slice(startIndex, endIndex);
  
  // 総ページ数を計算
  const totalPages = Math.ceil(allMyLinks.length / LINKS_PER_PAGE);
  
  // ページネーション情報の作成
  const pagination = {
    totalItems: allMyLinks.length,
    itemsPerPage: LINKS_PER_PAGE,
    currentPage: page,
    totalPages: totalPages
  };

  // テーマに応じたページをレンダリング
  return (
    <>
      <Head>
        <title>{siteTitle} - Links</title>
      </Head>
      <MyLinkPage mylinks={paginatedLinks} pagination={pagination} />
    </>
  );
};


/**
 * 全マイリンクデータを一度に取得する関数
 * クライアントサイドでのページネーションのため、全データを取得
 */
export async function getStaticProps() {
  try {
    console.log('mylink/index.tsx - getStaticProps: Fetching all data for client-side pagination');
    
    // 全データを一度に取得
    const result = await MyLinkListPageUsecase.getStaticProps();
    
    console.log('mylink/index.tsx - getStaticProps: Data fetched successfully');
    console.log(`- Total mylinks: ${result.props.allData.length}`);
    
    return {
      props: {
        allData: result.props.allData
      }
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      props: {
        allData: []
      }
    };
  }
}
