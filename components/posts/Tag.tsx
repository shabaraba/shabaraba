import {
  Tag as NotionTag,
  TagLabel,
  TagLeftIcon,
  LinkBox,
  LinkOverlay
} from '@chakra-ui/react'
import NextLink from 'next/link'
import dynamic from 'next/dynamic'

import { NotionTag as NotionTagEntity} from '../../entities/notion_entities'

export default function Tag({entity}: {entity: NotionTagEntity}) {
  let ReactIcon = null
  switch(entity.iconLabel) {
    case 'Si':
      ReactIcon = dynamic(() => import('react-icons/si').then(mod => mod[entity.iconName]))
      break
    case 'Gr':
      ReactIcon = dynamic(() => import('react-icons/gr').then(mod => mod[entity.iconName]))
      break
    case 'Fa':
      ReactIcon = dynamic(() => import('react-icons/fa').then(mod => mod[entity.iconName]))
      break
    case 'Gi':
      ReactIcon = dynamic(() => import('react-icons/gi').then(mod => mod[entity.iconName]))
      break
    case 'Md':
      ReactIcon = dynamic(() => import('react-icons/md').then(mod => mod[entity.iconName]))
      break
    default:
      ReactIcon = dynamic(() => import('react-icons/md').then(mod => mod['MdSettings']))
      break
  }
  console.log(entity.iconName)
  return (
    <LinkBox>
      <NotionTag size='md' key='md' variant='subtle' colorScheme={entity.color}>
        <TagLeftIcon boxSize='18px' as={ReactIcon} />
        <TagLabel>
          <NextLink href='#' passHref>
            <LinkOverlay>{entity.name}</LinkOverlay>
          </NextLink>
        </TagLabel>
      </NotionTag>
    </LinkBox>
  )
}

