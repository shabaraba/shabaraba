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
import * as ReactGrIcon from 'react-icons/gr'
import * as ReactFaIcon from 'react-icons/fa'
import * as ReactGiIcon from 'react-icons/gi'

import { NotionTag as NotionTagEntity} from '../../entities/notion_entities'

export default function Tag({entity}: {entity: NotionTagEntity}) {
  return (
    <LinkBox>
      <NotionTag size='md' key='md' variant='subtle' colorScheme={entity.color}>
        <TagLeftIcon boxSize='18px' as={getIcon(entity.name)} />
        <TagLabel>
          <NextLink href='#' passHref>
            <LinkOverlay>{entity.name}</LinkOverlay>
          </NextLink>
        </TagLabel>
      </NotionTag>
    </LinkBox>
  )
}

const getIcon = (tagName: string): any => {
  const iconNameMap = {
    Nextjs: 'Nextdotjs',
    個人開発: 'MuscleUp'
  }
  const iconName = iconNameMap[tagName] ?? tagName
  return ReactSiIcon['Si' + iconName]
    ?? ReactGrIcon['Gr' + iconName]
    ?? ReactFaIcon['Fa' + iconName]
    ?? ReactGiIcon['Gi' + iconName]
    ?? ReactMdIcon['Md' + iconName]
    ?? ReactMdIcon.MdSettings
}

