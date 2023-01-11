import React from 'react'
import { Center } from '@chakra-ui/react'
import useTwitterEmbed from '../../../units/hooks/useTwitterEmbed';
import { EmbedBlockType } from 'core/types/PostBlockType';

type Props = {entity: EmbedBlockType};

export const EmbedComponent: React.FC<Props> = ({entity}: Props) => {

  const containerRef = useTwitterEmbed();

  return (
    <Center ref={containerRef}>
      <blockquote className="twitter-tweet">
        <a href={entity.content.url} />
      </blockquote>
    </Center>
  )
}


