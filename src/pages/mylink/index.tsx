import { Text } from "@chakra-ui/react";
import { InferGetStaticPropsType } from "next";
import Head from "next/head";
import { siteTitle } from "../../../next-seo.config";
import { MyLinkListPageUsecase } from "application/usecases/MyLinkListPageUsecase";
import AuthorBox from "components/units/common/AuthorBox";
import { Seo } from "components/units/common/Seo";
import Layout from "components/units/layout";
import { MyLinkEntity } from "core/entities/MyLinkEntity";
import { MyLinkType } from "core/types/MyLinkType";
import { MyLinkList } from "components/patterns/MyLinkList";

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export default ({ allData }: Props) => {
  const data: MyLinkEntity[] = allData.map(
    (mylink: MyLinkType) => new MyLinkEntity(mylink)
  );

  return (
    <Layout mylink leftside={<AuthorBox />}>
      <Seo title="Coffee+Break+Point" />
      <Head> <title>{siteTitle}</title> </Head>
      <Text fontSize="xl" mt={10}> 筆者の興味関心のある外部ページはこちらに </Text>
      <MyLinkList data={data} />
    </Layout>
  );
};

// server側で呼ばれる
export const getStaticProps = async () =>
  MyLinkListPageUsecase.getStaticProps();
