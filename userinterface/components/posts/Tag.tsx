import { useState, useEffect } from 'react'
import {
  Tag as NotionTag,
  TagLabel,
  TagLeftIcon,
  LinkBox,
  LinkOverlay
} from '@chakra-ui/react'
import NextLink from 'next/link'
import dynamic from 'next/dynamic'

import { NotionTag as NotionTagEntity} from '../../../entities/notion_entities'

export default function Tag({entity}: {entity: NotionTagEntity}) {
  // const [icon, setIcon] = useState(null)
  // useEffect(() => {
  //   if (!icon) getReactIcon(entity)
  // }, [])

  // const getReactIcon = async(entity: NotionTagEntity): Promise<any> => {
  //   // dynamic importで読み込むライブラリを文字列変数で指定する場合、
  //   // 直接import()内に`test/${val}`のような文字列を入れられない
  //   // 一度変数を定義し、その変数のみ展開するような記載でないと受け付けてくれない
  //   const saffix: string = entity.iconLabel.toLowerCase()
  //   const importPath: string = `@meronex/icons/${saffix}/${entity.iconName}`
  //   // setIcon(dynamic(() => import(importPath), {ssr: false}))
  //   setIcon(import(importPath))

  //   // 下記の書き方だとライブラリすべてを読み込んでしまう
  //   // result = dynamic(() => import('react-icons/gr').then(mod => mod[entity.iconName]))
  // }


  return (
    <LinkBox>
      <NotionTag size='sm' key='md' variant='subtle' colorScheme={entity.color}>
        <TagLabel>
          <LinkOverlay as={NextLink} href='#'>{entity.name}</LinkOverlay>
        </TagLabel>
      </NotionTag>
    </LinkBox>
  )
  // return (
  //   <LinkBox>
  //     <NotionTag size='md' key='md' variant='subtle' colorScheme={entity.color}>
  //       <TagLeftIcon boxSize='18px' as={icon} />
  //       <TagLabel>
  //         <NextLink href='#' passHref>
  //           <LinkOverlay>{entity.name}</LinkOverlay>
  //         </NextLink>
  //       </TagLabel>
  //     </NotionTag>
  //   </LinkBox>
  // )
}

