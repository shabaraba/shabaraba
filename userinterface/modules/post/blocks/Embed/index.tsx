import React from 'react'
import { Center } from '@chakra-ui/react'
import type { Embed as EmbedEntity } from '../../../../../entities/notion/blocks';
import useTwitterEmbed from '../../../../components/hooks/useTwitterEmbed';

type Props = {entity: EmbedEntity};

export const Embed: React.FC<Props> = ({entity}: Props) => {

  const containerRef = useTwitterEmbed();

  return (
    <Center ref={containerRef}>
      <blockquote className="twitter-tweet">
        <a href={entity.url} />
      </blockquote>
    </Center>
  )
}


