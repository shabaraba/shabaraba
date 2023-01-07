import React from "react"
import { LinkBox, Box } from '@chakra-ui/react'
import { _Title as Title } from "./_Title";
import { _Thumbnail as Thumbnail } from "./_Thumbnail";
import { _Description as Description } from "./_Description";
import { Bookmark as BookmarkEntity } from "../../../../../application/modules/post/objects/entities/blocks/Bookmark";

type Props = {
  entity: BookmarkEntity,
}

export const Bookmark: React.FC<Props> = ({ entity }: Props) => {
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
    siteUrl: entity.siteUrl,
    pageTitle: entity.pageTitle,
    siteTitle: entity.siteTitle,
  }

  const descriptionProps = {
    description: entity.pageDescription,
    siteUrl: entity.siteUrl,
  }

  return (
    <LinkBox {...layout} >
      <Thumbnail url={entity.thumbnailUrl} />
      <Box p={2} mt={{ base: 4, md: 0 }} ml={{ md: 6 }} h='100%' >
        <Title {...titleProps} />
        <Description {...descriptionProps} />
      </Box>
    </LinkBox>
  )
}

