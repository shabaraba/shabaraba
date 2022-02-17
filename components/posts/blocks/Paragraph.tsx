import React from "react"
import { Text, Code } from '@chakra-ui/react'
import type { Paragraph as ParagraphEntity, } from '../../../entities/notion/blocks';

import {v4 as uuidv4} from 'uuid';
import _ from 'lodash'

type Props = {
  enable: boolean,
  color: string,
  backgroundColor: string,
  children?: React.ReactNode
}

export function Paragraph({entity}: {entity: ParagraphEntity}) {
  if (entity.texts.length === 0) return <br />

  const Bold: React.VFC<Props> = ({enable, color, backgroundColor, children}: Props) => {
    if (enable) return <Text as='strong' fontWeight='bold' color={color} backgroundColor={backgroundColor} >{children}</Text>
    return <>{children}</>
  }

  const Italic: React.VFC<Props> = ({enable, color, backgroundColor, children}: Props) => {
    if (enable) return <Text as='i' color={color} backgroundColor={backgroundColor} >{children}</Text>
    return <>{children}</>
  }

  const Underline: React.VFC<Props> = ({enable, color, backgroundColor, children}: Props) => {
    if (enable) return <Text as='u' color={color} backgroundColor={backgroundColor} >{children}</Text>
    return <>{children}</>
  }

  const Strikethrough: React.VFC<Props> = ({enable, color, backgroundColor, children}: Props) => {
    if (enable) return <Text as='s' color={color} backgroundColor={backgroundColor} >{children}</Text>
    return <>{children}</>
  }

  const CodeText: React.VFC<Props> = ({enable, color, backgroundColor, children}: Props) => {
    if (enable) return <Code color={color} backgroundColor={backgroundColor} >{children}</Code>
    return <>{children}</>
  }

  const RichText = ({text}: any) => {
    if (text.content == null) return <br />


    let content = text.content ?? ''
    const color = text.annotations.color + '.500'
    const backgroundColor = (text.annotations.color + '.500').split('_background').length > 1 ? (text.annotations.color + '.500').split('_background')[0] : null
    return (
      <Bold
        enable={text.annotations.bold}
        color={color}
        backgroundColor={backgroundColor}
      >
        <Italic 
          enable={text.annotations.italic}
          color={color}
          backgroundColor={backgroundColor}
        >
          <Underline 
            enable={text.annotations.underline}
            color={color}
            backgroundColor={backgroundColor}
          >
            <Strikethrough 
              enable={text.annotations.strikethrough}
              color={color}
              backgroundColor={backgroundColor}
            >
              <CodeText 
                enable={text.annotations.code}
                color={color}
                backgroundColor={backgroundColor}
              >
                {content}
              </CodeText>
            </Strikethrough>
          </Underline>
        </Italic>
      </Bold>
    )
  }
  
  const getLineEntities = (entity: ParagraphEntity) => {
    let lineEntities = []
    entity.texts.forEach(text => {
      let eachLine = text.content.split('\n')
      eachLine.forEach(line => {
        let lineEntity = _.cloneDeep(text)
        lineEntity.content = line
        lineEntities.push(lineEntity)
        let endLineEntity = _.cloneDeep(text)
        endLineEntity.content = null
        lineEntities.push(endLineEntity)
      })
      lineEntities.pop()
    })
    return lineEntities
  }

  return (
    <Text>
      {getLineEntities(entity).map(text => <RichText key={uuidv4()} text={text} /> )}
    </Text>
  )
}

