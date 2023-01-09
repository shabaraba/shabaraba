import React from "react"
import { LinkBox, Box } from '@chakra-ui/react'
import { _Title as Title } from "./_Title";
import { _Thumbnail as Thumbnail } from "./_Thumbnail";
import { _Description as Description } from "./_Description";
import { BookmarkBlockType } from "core/types/PostBlockType";

type Props = {
  entity: BookmarkBlockType,
}

export const BookmarkComponent: React.FC<Props> = ({ entity }: Props) => {
  const bookmark = entity.bookmark;
  const layout = {
    marginTop: 5,
    display: { md: "flex" },
    borderRadius: 10,
    overflow: 'hidden',
    filter: 'drop-shadow(3px 3px 3px rgba(0,0,0,0.2))',
    _hover: {
      filter: 'drop-shadow(10px 10px 10px rgba(0,0,0,0.4))',
      transition: 'all .3s',
    },
    bg: 'gray.50',
    height: { md: 150 },
    width: '100%'
  }

  const titleProps = {
    siteUrl: bookmark.siteUrl,
    pageTitle: bookmark.pageTitle,
    siteTitle: bookmark.siteTitle,
  }

  const descriptionProps = {
    description: bookmark.pageDescription,
    siteUrl: bookmark.siteUrl,
  }

  return (
    <LinkBox {...layout} >
      <Thumbnail url={bookmark.thumbnailUrl} />
      <Box p={2} mt={{ base: 4, md: 0 }} ml={{ md: 6 }} h='100%' >
        <Title {...titleProps} />
        <Description {...descriptionProps} />
      </Box>
    </LinkBox>
  )
}

