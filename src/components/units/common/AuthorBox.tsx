import React from 'react'
import useSWRImmutable from 'swr/immutable'
import {Link, Skeleton, Container, Box, Image, VStack, Tooltip, Icon, Text} from '@chakra-ui/react'
import {SiGithub, SiTwitter, SiQiita} from 'react-icons/si'

export default () => {
  const fetcher = async (url: string) => {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  const { data: fetchedData } = useSWRImmutable('https://api.github.com/users/shabaraba', fetcher)
  if (!fetchedData) return <Skeleton />

  const avatarUrl = fetchedData.avatar_url
  const iconSize = 6
  return (
    <Box
      p={5}
    >
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
      >
        <Image
          borderRadius='full'
          boxSize='150px'
          alt='shabaraba'
          src={avatarUrl}
          filter='drop-shadow(3px 3px 3px rgba(0,0,0,0.2))'
        />
        <VStack
          align='center'
          justify='center'
          ml={5}
        >
          <Tooltip hasArrow label='Github' placement='right-start'>
            <Link href="https://github.com/shabaraba">
              <Icon as={SiGithub} w={iconSize} h={iconSize} filter='drop-shadow(3px 3px 3px rgba(0,0,0,0.2))' />
            </Link>
          </Tooltip>
          <Tooltip hasArrow label='Twitter' placement='right-start'>
            <Link href="https://twitter.com/shaba_dev">
              <Icon as={SiTwitter} w={iconSize} h={iconSize} filter='drop-shadow(3px 3px 3px rgba(0,0,0,0.2))' />
            </Link>
          </Tooltip>
          <Tooltip hasArrow label='Qiita' placement='right-start'>
            <Link href="https://qiita.com/shabaraba">
              <Icon as={SiQiita} w={iconSize} h={iconSize} filter='drop-shadow(3px 3px 3px rgba(0,0,0,0.2))' />
            </Link>
          </Tooltip>
        </VStack>
      </Box>
      <Box
        pt={5}
      >
        <Text fontSize='lg'>
          Author: しゃば
        </Text>
        <Text fontSize='xs'>
          ロボット好きのPHPエンジニア<br />
          自分でイジれるおもちゃを欲しがち<br />
          時間がなく3年ほど中断している工作機械自作の完成が夢<br />
          <br />
          休憩の傍らななめ読みできそうな技術ブログを目指す<br />
        </Text>
      </Box>

    </Box>
  )
}

