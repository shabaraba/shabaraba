import { InferGetStaticPropsType, GetStaticPropsContext, GetStaticPathsResult } from "next";
import { ParsedUrlQuery } from "querystring";
import Head from "next/head";
import { siteTitle } from "../../../next-seo.config";
import { MyLinkListPageUsecase } from "application/usecases/MyLinkListPageUsecase";
import { MyLinkEntity } from "core/entities/MyLinkEntity";
import { MyLinkType } from "core/types/MyLinkType";
import { getThemePage } from "../../lib/themeSelector";

// 1ページあたりのマイリンク数
const LINKS_PER_PAGE = 10;

// ページパラメータの型定義
interface PageParams extends ParsedUrlQuery {
  page?: string;
}

type Props = InferGetStaticPropsType<typeof getStaticProps>;

// テーマに応じたMyLinkPageをインポート（ページネーション情報も受け取れるように型を更新）
const MyLinkPage = getThemePage<React.ComponentType<{ 
  mylinks: MyLinkEntity[],
  pagination?: {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    totalPages: number;
  }
}>>("MyLinkPage");

export default function MyLinkIndex({ allData, pagination }: Props) {
  // エンティティ変換
  const mylinks: MyLinkEntity[] = allData.map(
    (mylink: MyLinkType) => new MyLinkEntity(mylink)
  );

  // テーマに応じたページをレンダリング
  return (
    <>
      <Head>
        <title>{siteTitle} - Links</title>
      </Head>
      <MyLinkPage mylinks={mylinks} pagination={pagination} />
    </>
  );
};

/**
 * 静的ページ生成時のパスを定義
 * ページネーション用の複数のページパスを生成する
 */
export async function getStaticPaths(): Promise<GetStaticPathsResult<PageParams>> {
  try {
    console.log('mylink/index.tsx - getStaticPaths: Generating mylink page paths');
    
    // 全マイリンクデータを取得して、ページ数を計算
    const commonData = await MyLinkListPageUsecase.getStaticProps();
    const totalLinks = commonData.props.allData.length;
    const totalPages = Math.ceil(totalLinks / LINKS_PER_PAGE);
    
    // パスを生成
    const paths = [];
    
    // 1ページ目（ルートパス）
    paths.push({
      params: {}  // ルートページなのでパラメータなし
    });
    
    // 2ページ目以降
    for (let page = 2; page <= totalPages; page++) {
      paths.push({
        params: { page: page.toString() }
      });
    }
    
    console.log(`Generated ${paths.length} mylink page paths for SSG`);
    
    return {
      paths,
      fallback: false, // 存在しないパスは404エラー
    };
  } catch (error) {
    console.error('Error generating mylink page paths:', error);
    return {
      paths: [{ params: {} }],
      fallback: false,
    };
  }
}

/**
 * 各ページのデータを取得する関数
 * ページごとに異なるリンクセットをプリレンダリングする
 */
export async function getStaticProps(context: GetStaticPropsContext<PageParams>) {
  try {
    // URLパラメータからページ番号を取得（デフォルトは1）
    const page = context.params?.page ? parseInt(context.params.page) : 1;
    
    console.log(`mylink/index.tsx - getStaticProps: Fetching data for page ${page}`);
    
    // ページネーション対応のデータ取得メソッドを使用
    const paginatedData = await MyLinkListPageUsecase.getPaginatedData(page, LINKS_PER_PAGE);
    
    console.log(`mylink/index.tsx - getStaticProps: Data fetched successfully for page ${page}`);
    console.log(`- Page items: ${paginatedData.items.length}`);
    console.log(`- Total items: ${paginatedData.totalItems}`);
    console.log(`- Total pages: ${paginatedData.totalPages}`);
    
    return {
      props: {
        allData: paginatedData.allData,
        pagination: {
          totalItems: paginatedData.totalItems,
          itemsPerPage: paginatedData.pageSize,
          currentPage: paginatedData.currentPage,
          totalPages: paginatedData.totalPages
        }
      }
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      props: {
        allData: [],
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
