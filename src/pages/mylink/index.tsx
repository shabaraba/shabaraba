import { InferGetStaticPropsType } from "next";
import Head from "next/head";
import { siteTitle } from "../../../next-seo.config";
import { MyLinkListPageUsecase } from "application/usecases/MyLinkListPageUsecase";
import { MyLinkEntity } from "core/entities/MyLinkEntity";
import { MyLinkType } from "core/types/MyLinkType";
import { ACTIVE_THEME, getThemePage } from "../../lib/themeSelector";

type Props = InferGetStaticPropsType<typeof getStaticProps>;

// テーマに応じたMyLinkPageをインポート
const MyLinkPage = getThemePage<React.ComponentType<{ mylinks: MyLinkEntity[] }>>("MyLinkPage");

export default function MyLinkIndex({ allData }: Props) {
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
      <MyLinkPage mylinks={mylinks} />
    </>
  );
};

// server側で呼ばれる
export const getStaticProps = async () =>
  MyLinkListPageUsecase.getStaticProps();
