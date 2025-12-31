import { InferGetStaticPropsType } from "next";
import Head from "next/head";
import { siteTitle } from "../../../next-seo.config";
import { MyLinkListPageUsecase } from "application/usecases/MyLinkListPageUsecase";
import { MyLinkEntity } from "core/entities/MyLinkEntity";
import { MyLinkType } from "core/types/MyLinkType";
import dynamic from "next/dynamic";
import { ACTIVE_THEME } from '../../config/themeSelector';

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
  import(`../../themes/${ACTIVE_THEME}/pages/MyLinkPage`).then(mod => mod.default),
  {
    // loading: () => <Loading />, // 読み込み中に表示されるコンポーネント
    loading: () => null,
    ssr: true,
  }

);

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
    return {
      notFound: true,
    };
  }
}
