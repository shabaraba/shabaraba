import React from 'react'
import { Center } from '@chakra-ui/react'
import { Embed as EmbedEntity } from "../../../../../application/modules/post/objects/entities/blocks/Embed";
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


