import React from 'react';
import { Box, Text, UnorderedList, ListItem, Link } from '@chakra-ui/react';
import NextLink from 'next/link';

const PopularPosts: React.FC = () => {
  // 実際の人気記事データ
  const popularPosts = [
    { id: 'notion-api-typescript', title: 'Notion API TypeScriptで使うためのセットアップ方法' },
    { id: 'nextjs-chakra-ui-setup', title: 'Next.jsとChakra UIで快適フロントエンド開発環境' },
    { id: 'jamstack-blog-implementation', title: 'JAMStack構成でブログを作った話' },
    { id: 'react-hooks-custom-hooks', title: 'Reactのカスタムフックで共通処理をスマートに実装' },
    { id: 'coffee-break-point-design', title: 'コーヒーブレイクポイントのデザイン改善' }
  ];

  return (
    <Box className="sidebar-section">
      <Text className="sidebar-title">人気記事</Text>
      <UnorderedList className="popular-posts-list">
        {popularPosts.map((post) => (
          <ListItem key={post.id}>
            <NextLink href={`/posts/${post.id}`} passHref legacyBehavior>
              <Link>{post.title}</Link>
            </NextLink>
          </ListItem>
        ))}
      </UnorderedList>
    </Box>
  );
};

export default PopularPosts;
