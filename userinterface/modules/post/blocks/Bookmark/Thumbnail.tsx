import { Box, Image } from '@chakra-ui/react'

type props = {
  url: string
};

export default ({url}: props): JSX.Element => {
    return (
      <Box 
        flexShrink={0}
        width={{base: '100%', md: 200}}
        height={{base: 200, md: 150}}
        mr={{base: 'auto', md: 0}}
        ml={{base: 'auto', md: 0}}
      >
        <Image
          src={url}
          width='100%'
          height='100%'
          objectFit={'contain'}
        />
      </Box>
    );
}