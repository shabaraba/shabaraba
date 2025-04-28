import React from "react";
import { useBreakpointValue, Text } from "@chakra-ui/react";
import Head from "next/head";
import { InferGetStaticPropsType } from "next";
import AuthorBox from "../components/units/common/AuthorBox";
import { Seo } from "../components/units/common/Seo";
import { PostHeadList } from "../components/patterns/PostHeadList";
import { siteTitle } from "../../../pages/_app";
import { PostHeadEntity } from "core/entities/PostHeadEntity";
import { ArticleListPageUsecase } from "application/usecases/ArticleListPageUsecase";
import { PostHeadType } from "core/types/PostHeadType";
import ListLayout from "../components/layouts/ListLayout";

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export default ({ allPostsData }: Props) => {
  // PostListに渡していたが、多分使ってない
  const data: PostHeadEntity[] = allPostsData.map(
    (postHead: PostHeadType) => new PostHeadEntity(postHead)
  );

  return (
    <ListLayout home leftside={<AuthorBox />}>
      <Seo title="Coffee+Break+Point" />
      <Head>
        {" "}
        <title>{siteTitle}</title>{" "}
      </Head>
      <Text fontSize="md" mt={10}>
        日々の気付きやメモはこちらに
      </Text>
      <PostHeadList data={data} />
    </ListLayout>
  );
};

// server側で呼ばれる
export const getStaticProps = async () =>
  ArticleListPageUsecase.getStaticProps();
