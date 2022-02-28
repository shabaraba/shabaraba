import React from "react"
import { LinkBox, LinkOverlay, Grid, GridItem, Text, Image } from '@chakra-ui/react'
import type { Bookmark as BookmarkEntity } from '../../../entities/notion/blocks';

export function Bookmark({entity}: {entity: BookmarkEntity}) {
  return (
    <LinkBox>
      <Grid
        mt={5}
        mb={5}
        p={2}
        borderRadius={10}
        filter = 'drop-shadow(3px 3px 3px rgba(0,0,0,0.2))'
        _hover={{
          filter: 'drop-shadow(10px 10px 10px rgba(0,0,0,0.4))',
          transition: 'all .3s'
        }}
        backgroundColor = 'gray.50'
        templateColumns='repeat(10, 1fr)'
        gap={4}
      >
        <GridItem
          colSpan={2}
          display="flex"
          justifyContent='center'
          alignItems='center'
        >
          <Image
            src={entity.thumbnailUrl}
          />
        </GridItem>

        <GridItem
          colStart={3}
          colEnd={11}
          p={2}
        >
          <LinkOverlay href={entity.siteUrl} fontSize='lg'>{entity.pageTitle} | {entity.siteTitle}</LinkOverlay>
          <Text fontSize='smaller'>{entity.pageDescription}</Text>
          <Text fontSize='xs'>{entity.siteUrl}</Text>
        </GridItem>
      </Grid>
    </LinkBox>
  )
}

