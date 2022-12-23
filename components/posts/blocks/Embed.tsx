import React,{ useRef, useEffect } from 'react'
import { Center } from '@chakra-ui/react'
import type { Embed as EmbedEntity } from '../../../entities/notion/blocks';

export function Embed({entity}: {entity: EmbedEntity}) {

  const containerRef = useRef(null)
  useEffect(()=>{
    (window as any).twttr?.widgets?.load(containerRef.current) // ツイートの埋め込みを実行
  }, [])

  return (
    <Center ref={containerRef}>
      <blockquote className="twitter-tweet">
        <a href={entity.url} />
      </blockquote>
    </Center>
  )
}


