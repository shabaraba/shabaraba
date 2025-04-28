import React from 'react';
import { Box, Text, Link } from '@chakra-ui/react';
import NextLink from 'next/link';

const TagCloud: React.FC = () => {
  // タグのデータ
  const tags = [
    { id: 'nextjs', name: 'Next.js', count: 15, size: 'xl' },
    { id: 'react', name: 'React', count: 20, size: '2xl' },
    { id: 'typescript', name: 'TypeScript', count: 18, size: 'xl' },
    { id: 'notion', name: 'Notion', count: 10, size: 'lg' },
    { id: 'chakra-ui', name: 'Chakra UI', count: 8, size: 'md' },
    { id: 'jamstack', name: 'JAMStack', count: 5, size: 'md' },
    { id: 'css', name: 'CSS', count: 12, size: 'lg' },
    { id: 'javascript', name: 'JavaScript', count: 25, size: '2xl' },
    { id: 'api', name: 'API', count: 7, size: 'md' },
    { id: 'design', name: 'デザイン', count: 9, size: 'lg' }
  ];

  return (
    <Box className="sidebar-section">
      <Text className="sidebar-title">タグ</Text>
      <Box className="tag-cloud">
        {tags.map((tag) => (
          <NextLink key={tag.id} href={`/tags/${tag.id}`} passHref legacyBehavior>
            <Link 
              className="tag-cloud-item"
              style={{ '--tag-size': `${getFontSizeByTagSize(tag.size)}px` } as React.CSSProperties}
            >
              {tag.name}
            </Link>
          </NextLink>
        ))}
      </Box>
    </Box>
  );
};

// タグサイズに基づいたフォントサイズの取得
const getFontSizeByTagSize = (size: string): number => {
  switch (size) {
    case '2xl': return 18;
    case 'xl': return 16;
    case 'lg': return 14;
    case 'md': return 12;
    default: return 12;
  }
};

export default TagCloud;
