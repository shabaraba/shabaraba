import {
  Tag as NotionTag,
  TagLabel,
  TagLeftIcon,
  LinkBox,
  LinkOverlay
} from '@chakra-ui/react'
import NextLink from 'next/link'
import * as ReactMdIcon from 'react-icons/md'
import * as ReactSiIcon from 'react-icons/si'
import { NotionTag as NotionTagEntity} from '../../entities/notion_entities'

export default function Tag({entity}: {entity: NotionTagEntity}) {
  let Icon = ReactSiIcon['Si' + entity.name] ?? ReactMdIcon.MdSettings
  console.log(Icon)
  return (
    <LinkBox>
      <NotionTag size='md' key='md' variant='subtle' colorScheme={entity.color}>
        <TagLeftIcon boxSize='12px' as={Icon} />
        <TagLabel>
          <NextLink href='#' passHref>
            <LinkOverlay>{entity.name}</LinkOverlay>
          </NextLink>
        </TagLabel>
      </NotionTag>
    </LinkBox>
  )
}



