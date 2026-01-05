import { FC, useState } from "react"
import Image from 'next/image'
import { Text, Box } from '@chakra-ui/react'

type Props = {
  eyeCatchUrl?: string;
  iconText?: string;
};

const DEFAULT_IMAGE = '/images/covers/default.jpg';

export const EyeChatch: FC<Props> = ({ eyeCatchUrl, iconText }) => {
  const [imgSrc, setImgSrc] = useState(eyeCatchUrl || DEFAULT_IMAGE);

  const style = {
      flexShrink: 0,
      width: { base: '100%', md: 200 },
      height: { base: 200, md: 120 },
      mr: { base: 'auto', md: 0 },
      ml: { base: 'auto', md: 0 },
      display: 'flex',
      justifyContent: 'center',
  }

  const handleError = () => {
    setImgSrc(DEFAULT_IMAGE);
  };

  const _EyeChatch: FC = () => {
    if (eyeCatchUrl || imgSrc) {
      return (
        <Image
          src={imgSrc}
          width={300}
          height={200}
          alt={''}
          style={{objectFit: 'cover'}}
          onError={handleError}
        />
      );
    }
    if (iconText) return <Text fontSize={72} fontWeight='bold'> {iconText} </Text>;
    return <></>;
  };

  return (
    <Box {...style}>
      <_EyeChatch />
    </Box>
  )
}