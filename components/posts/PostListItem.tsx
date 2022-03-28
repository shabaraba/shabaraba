import { Image, LinkBox, LinkOverlay, Wrap, WrapItem, Text, SpaceProps, Icon, Grid, GridItem, Box, Flex } from '@chakra-ui/react'
import {MdCreate, MdUpdate, MdArrowRightAlt } from 'react-icons/md'
import Date from '../../components/date'
// import Image from 'next/image'
import NextLink from 'next/link'
import Tag from '../../components/posts/Tag'
import {v4 as uuidv4} from 'uuid'
import type { IPageHead, IPageTag, IPageCover } from '../../interfaces/NotionPageApiResponses'

export default function PostListItem({postHead, breakPoint}: {postHead: IPageHead, breakPoint: string}) {
  const coverImageUrl: string | null = postHead.cover?.file?.url ?? postHead.cover?.external?.url ?? null
  const iconText: string | null = postHead.icon?.emoji

  return(
    <LinkBox as="article"
      marginTop={5}
      display={{md: "flex"}}
      borderRadius={10}
      overflow='hidden'
      filter = 'drop-shadow(3px 3px 3px rgba(0,0,0,0.2))'
      _hover={{
        filter: 'drop-shadow(10px 10px 10px rgba(0,0,0,0.4))',
        transition: 'all .3s'
      }}
      bg='#FFF5F3'
      height={{md: 120}}
      width='100%'
    >
      <Box 
        flexShrink={0}
        width={{base: '100%', md: 200}}
        height={{base: 200, md: 120}}
        mr={{base: 'auto', md: 0}}
        ml={{base: 'auto', md: 0}}
      >
        {coverImageUrl && (
          <Image
            src={coverImageUrl}
            width='100%'
            height='100%'
            objectFit="cover"
          />
        )}
        {!coverImageUrl && iconText && (
          <Text
            fontSize={72}
            fontWeight='bold'
          >
            {iconText}
          </Text>
        )}
      </Box>
      <Box
        p={2}
        mt={{base: 4, md: 0}}
        ml={{md: 6}}
        h='100%'
      >
        <NextLink href="/posts/[id]" as={'/posts/' + (postHead.slug)} passHref>
          <LinkOverlay fontSize={{md: '20px', sm: '20px', base: '18px'}} overflowWrap='anywhere'>
            {postHead.title}
          </LinkOverlay>
        </NextLink>
        <Wrap>
          {postHead.tags?.map((tag: IPageTag) => (
            <WrapItem key={uuidv4()}>
              <Tag entity={tag} />
            </WrapItem>
          ))}
          <WrapItem key={uuidv4()} />
        </Wrap>
        <Box fontSize={{base: '12px', sm: '14px'}} textAlign={['right']}>
          <Wrap justify='right'>
            <WrapItem>
              <Icon as={MdCreate} />
              <Date dateString={postHead.publishedAt}/>
            </WrapItem>
            <WrapItem>
              <Icon as={MdArrowRightAlt} />
            </WrapItem>
            <WrapItem>
              <Icon as={MdUpdate} />
              <Date dateString={postHead.updatedAt}/>
            </WrapItem>
          </Wrap>
        </Box>
      </Box>
    </LinkBox>
  )
} 
