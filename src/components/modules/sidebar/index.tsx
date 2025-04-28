import React from 'react';
import { Box } from '@chakra-ui/react';
import PopularPosts from './PopularPosts';
import CategoryList from './CategoryList';
import TagCloud from './TagCloud';

const Sidebar: React.FC = () => {
  return (
    <Box className="sidebar">
      <PopularPosts />
      <CategoryList />
      <TagCloud />
    </Box>
  );
};

export default Sidebar;
