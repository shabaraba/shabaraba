import React from 'react';
import { Text } from "@chakra-ui/react";
import { MyLinkEntity } from '../../../core/entities/MyLinkEntity';
import AuthorBox from '../../../components/units/common/AuthorBox';
import { Seo } from '../../../components/units/common/Seo';
import { MyLinkList } from '../../../components/patterns/MyLinkList';
import ListLayout from '../../../components/layouts/ListLayout';

interface MyLinkPageProps {
  mylinks: MyLinkEntity[];
}

/**
 * MyLinkページコンポーネント（Theme1用）
 */
export default function MyLinkPage({ mylinks }: MyLinkPageProps) {
  return (
    <ListLayout mylink leftside={<AuthorBox />}>
      <Seo title="Coffee+Break+Point" />
      <Text fontSize="xl" mt={10}>筆者の興味関心のある外部ページはこちらに</Text>
      <MyLinkList data={mylinks} />
    </ListLayout>
  );
}
