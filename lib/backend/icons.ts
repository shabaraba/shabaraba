import * as ReactMdIcon from '@meronex/icons/md'
import * as ReactSiIcon from '@meronex/icons/si'
import * as ReactGrIcon from '@meronex/icons/gr'
import * as ReactFaIcon from '@meronex/icons/fa'
import * as ReactGiIcon from '@meronex/icons/gi'

import { NotionTag } from '../../entities/notion_entities'

export const getTagIcon = (entity: NotionTag) => {
  const iconNameMap = {
    Nextjs: 'Nextdotjs',
    個人開発: 'MuscleUp'
  }

  const iconName = iconNameMap[entity.name] ?? entity.name
  if(ReactSiIcon['Si' + iconName]) {
    entity.iconLabel = 'Si'
    entity.iconName = entity.iconLabel + iconName
    console.log(entity)
    return entity
  }
  if(ReactGrIcon['Gr' + iconName]) {
    entity.iconLabel = 'Gr'
    entity.iconName = entity.iconLabel + iconName
    console.log(entity)
    return entity
  }
  if(ReactFaIcon['Fa' + iconName]) {
    entity.iconLabel = 'Fa'
    entity.iconName = entity.iconLabel + iconName
    console.log(entity)
    return entity
  }
  if(ReactGiIcon['Gi' + iconName]) {
    entity.iconLabel = 'Gi'
    entity.iconName = entity.iconLabel + iconName
    console.log(entity)
    return entity
  }
  if(ReactMdIcon['Md' + iconName]) {
    entity.iconLabel = 'Md'
    entity.iconName = entity.iconLabel + iconName
    console.log(entity)
    return entity
  }
  entity.iconLabel = 'Md'
  entity.iconName = 'MdSettings'
  console.log(entity)
  return entity
}
