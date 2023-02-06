import { FC } from "react"
import { Box } from '@chakra-ui/react'
import { Image } from '@chakra-ui/react'

type Props = {
  eyeCatchUrl: string;
};

export const EyeChatch: FC<Props> = ({ eyeCatchUrl }) => {
  const style = {
      flexShrink: 0,
      width: { base: '100%', md: 200 },
      height: { base: 200, md: 120 },
      mr: { base: 'auto', md: 0 },
      ml: { base: 'auto', md: 0 },
      display: 'flex',
      justifyContent: 'center',
  }

  return (
    <Box {...style}>
      <Image 
        src={eyeCatchUrl} 
        alt={''} 
        objectFit={'contain'}
        fallbackSrc='https://placehold.jp/30/a1a1a1/ffffff/300x150.png?text=NO IMAGE'
      />
    </Box>
  )
}