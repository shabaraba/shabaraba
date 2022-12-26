import React from "react"
import { LinkBox, LinkOverlay, Box, GridItem, Text, Image } from '@chakra-ui/react'
import Thumbnail from "./Bookmark/Thumbnail";
import type { Bookmark as BookmarkEntity } from '../../../../entities/notion/blocks';

export function Bookmark({entity}: {entity: BookmarkEntity}) {
  return (
    <LinkBox
      marginTop={5}
      display={{md: "flex"}}
      borderRadius={10}
      overflow='hidden'
      filter = 'drop-shadow(3px 3px 3px rgba(0,0,0,0.2))'
      _hover={{
        filter: 'drop-shadow(10px 10px 10px rgba(0,0,0,0.4))',
        transition: 'all .3s'
      }}
      bg='gray.50'
      height={{md: 150}}
      width='100%'
    >
      <Thumbnail url={entity.thumbnailUrl} />
      <Box
        p={2}
        mt={{base: 4, md: 0}}
        ml={{md: 6}}
        h='100%'
      >
        <LinkOverlay href={entity.siteUrl} fontSize='md' overflowWrap='anywhere'>{entity.pageTitle} | {entity.siteTitle}</LinkOverlay>
        <Text fontSize='smaller' overflowWrap='anywhere' noOfLines={2}>{entity.pageDescription}</Text>
        <Text fontSize='xs' overflowWrap='anywhere' noOfLines={1}>{entity.siteUrl}</Text>
      </Box>
    </LinkBox>
  )
}

