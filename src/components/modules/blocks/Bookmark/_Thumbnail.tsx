import React from 'react';
import { Box, Image } from '@chakra-ui/react';

type Props = {
  url: string
};

export const _Thumbnail: React.FC<Props> =  ({url}: Props) => {
    return (
      <Box 
        flexShrink={0}
        width={{base: '100%', md: 200}}
        height={{base: 200, md: 150}}
        mr={{base: 'auto', md: 5}}
        ml={{base: 'auto', md: 5}}
      >
        <Image
          src={url}
          width={800}
          height={600}
          layout="responsive"
          objectFit={'contain'}
          alt="Bookmark thumbnail"
        />
      </Box>
    );
}