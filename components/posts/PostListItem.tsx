import { LinkBox, LinkOverlay, Wrap, WrapItem, Text, SpaceProps, Icon, Grid, GridItem, Box } from '@chakra-ui/react'
import {MdCreate, MdUpdate, MdArrowRightAlt } from 'react-icons/md'
import Date from '../../components/date'
import Image from 'next/image'
import NextLink from 'next/link'
import Tag from '../../components/posts/Tag'
import {v4 as uuidv4} from 'uuid'
import type { IPageHead, IPageTag, IPageCover } from '../../interfaces/NotionPageApiResponses'

export default function PostListItem({postHead, breakPoint}: {postHead: IPageHead, breakPoint: string}) {
  const coverImageUrl: string | null = postHead.cover?.file?.url ?? postHead.cover?.external?.url ?? null
  const iconText: string | null = postHead.icon?.emoji

  return(
    <LinkBox as="article"
      marginTop={{ base: '5', sm: '5' }}
      display="flex"
      justifyContent="space-between"
      borderRadius={10}
      filter = 'drop-shadow(3px 3px 3px rgba(0,0,0,0.2))'
      _hover={{
        filter: 'drop-shadow(10px 10px 10px rgba(0,0,0,0.4))',
        transition: 'all .3s'
      }}
      bg='#FFF5F3'
    >
      <Grid
        templateColumns={{sm: '1fr', md: 'repeat(12, 1fr)', }}
        templateRows={{md: '1fr', sm: 'repeat(6, 1fr)', }}
        gap={0}
        w='100%'
      >
        <GridItem
          colSpan={{sm: 1, md: 3}}
          rowSpan={{md: 1, sm: 4}}
          display="flex"
          justifyContent='center'
          alignItems='center'
        >
          <>
            {coverImageUrl && (
              <Image
                src={coverImageUrl}
                height={100}
                width={200}
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
          </>
        </GridItem>
        <GridItem
          colSpan={{sm: 1, md: 9}}
          rowSpan={{md: 1, sm: 2}}
          p={3}
        >
          <NextLink href="/posts/[id]" as={'/posts/' + (postHead.slug)} passHref>
            <LinkOverlay fontSize='xl'>
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
          <Box fontSize='sm' textAlign={['right']}>
            <Wrap justify='right'>
              <WrapItem>
                <Icon as={MdCreate} />
                <Date dateString={postHead.createdAt}/>
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
        </GridItem>
      </Grid>
    </LinkBox>
  )
} 
