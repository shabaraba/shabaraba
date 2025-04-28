import React from 'react';
import { Box, Text, UnorderedList, ListItem, Link } from '@chakra-ui/react';
import NextLink from 'next/link';

const CategoryList: React.FC = () => {
  // カテゴリのデータ
  const categories = [
    { id: 'programming', name: 'プログラミング', count: 12 },
    { id: 'webdev', name: 'Web開発', count: 8 },
    { id: 'design', name: 'デザイン', count: 5 },
    { id: 'tools', name: 'ツール・開発環境', count: 7 },
    { id: 'thoughts', name: '雑感', count: 3 }
  ];

  return (
    <Box className="sidebar-section">
      <Text className="sidebar-title">カテゴリ</Text>
      <UnorderedList className="category-list">
        {categories.map((category) => (
          <ListItem key={category.id}>
            <NextLink href={`/category/${category.id}`} passHref legacyBehavior>
              <Link>{category.name} ({category.count})</Link>
            </NextLink>
          </ListItem>
        ))}
      </UnorderedList>
    </Box>
  );
};

export default CategoryList;
