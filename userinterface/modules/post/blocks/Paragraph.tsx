import React from "react"
import { Text, Code, Link, HStack } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import type { Paragraph as ParagraphEntity, } from '../../../../entities/notion/blocks';

import {v4 as uuidv4} from 'uuid';
import _ from 'lodash'

type Props = {
  apply?: boolean,
  color: string,
  backgroundColor: string,
  url?: string,
  children?: React.ReactNode
}

export function Paragraph({entity}: {entity: ParagraphEntity}) {
  if (entity.texts.length === 0) return <br />

  const LinkText: React.VFC<Props> = ({color, backgroundColor, url, children}: Props) => {
    if (url != null) return <Link href={url} color={color} background={backgroundColor} overflowWrap='anywhere' isExternal>{children}<ExternalLinkIcon mx='2px' /></Link>
    return <>{children}</>
  }

  const Bold: React.VFC<Props> = ({apply, color, backgroundColor, children}: Props) => {
    if (apply) return <Text as='strong' fontWeight='bold' color={color} background={backgroundColor} overflowWrap='anywhere'>{children}</Text>
    return <>{children}</>
  }

  const Italic: React.VFC<Props> = ({apply, color, backgroundColor, children}: Props) => {
    if (apply) return <Text as='i' color={color} background={backgroundColor} overflowWrap='anywhere'>{children}</Text>
    return <>{children}</>
  }

  const Underline: React.VFC<Props> = ({apply, color, backgroundColor, children}: Props) => {
    if (apply) return <Text as='u' color={color} background={backgroundColor} overflowWrap='anywhere'>{children}</Text>
    return <>{children}</>
  }

  const Strikethrough: React.VFC<Props> = ({apply, color, backgroundColor, children}: Props) => {
    if (apply) return <Text as='s' color={color} background={backgroundColor} overflowWrap='anywhere'>{children}</Text>
    return <>{children}</>
  }

  const CodeText: React.VFC<Props> = ({apply, color, backgroundColor, children}: Props) => {
    if (apply) return <Code colorScheme={'red'} background={backgroundColor} display='inline' overflowWrap='anywhere' children={children} />
    return <>{children}</>
  }

  const RichText = ({text}: any) => {
    if (text.content == null) return <br />

    let content = text.content ?? ''
    let color = null
    let backgroundColor = null
    if (text.annotations.color.match('_background')) backgroundColor = text.annotations.color.split('_background')[0] + '.500'
    else color = text.annotations.color + '.500'

    return (
      <Text
        as='span'
        color={color}
        backgroundColor={backgroundColor}
        fontSize={{ base: '12px', md: '14px', lg: '16px' }}
      >
        <LinkText
          color={color}
          backgroundColor={backgroundColor}
          url={text.href}
        >
          <Bold
            apply={text.annotations.bold}
            color={color}
            backgroundColor={backgroundColor}
          >
            <Italic 
              apply={text.annotations.italic}
              color={color}
              backgroundColor={backgroundColor}
            >
              <Underline 
                apply={text.annotations.underline}
                color={color}
                backgroundColor={backgroundColor}
              >
                <Strikethrough 
                  apply={text.annotations.strikethrough}
                  color={color}
                  backgroundColor={backgroundColor}
                >
                  <CodeText 
                    apply={text.annotations.code}
                    color={color}
                    backgroundColor={backgroundColor}
                  >
                    {content}
                  </CodeText>
                </Strikethrough>
              </Underline>
            </Italic>
          </Bold>
        </LinkText>
      </Text>
    )
  }
  
  const getLineEntities = (entity: ParagraphEntity) => {
    let lineEntities = []
    let wordEntities = []
    entity.texts.forEach(text => {
      let eachLine = text.content.split('\n')
      eachLine.forEach((line, index) => {
        // 各行ごとのword block
        let wordEntity = _.cloneDeep(text)
        wordEntity.content = line
        wordEntities.push(wordEntity)
        if (eachLine.length - 1 != index) {
          lineEntities.push(wordEntities)
          wordEntities = []
        }
      })
    })
    lineEntities.push(wordEntities)
    return lineEntities
  }

  const lineEntities = getLineEntities(entity)


  return (
    <Text>
      {lineEntities.map((line:any) =>
          <Text as='span' key={uuidv4()}>{line.map((word:any) => <RichText key={uuidv4()} text={word} /> )} <br /></Text>
      )}
    </Text>
  )
}

