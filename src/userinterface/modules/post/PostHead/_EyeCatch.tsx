import { FC } from "react"
import Image from 'next/image'
import { Text, Box } from '@chakra-ui/react'

type Props = {
  eyeCatchUrl?: string;
  iconText?: string;
};

export const EyeChatch: FC<Props> = ({ eyeCatchUrl, iconText }) => {
  const style = {
      flexShrink: 0,
      width: { base: '100%', md: 200 },
      height: { base: 200, md: 120 },
      mr: { base: 'auto', md: 0 },
      ml: { base: 'auto', md: 0 },
      display: 'flex',
      justifyContent: 'center',
  }

  const _EyeChatch: FC = () => {
    if (eyeCatchUrl) return <Image src={eyeCatchUrl} width={300} height={200} alt={''} />;
    if (iconText) return <Text fontSize={72} fontWeight='bold'> {iconText} </Text>;
    return <></>;
  };

  return (
    <Box {...style}>
      <_EyeChatch />
    </Box>
  )
}