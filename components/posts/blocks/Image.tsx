import { Center, Text, Flex, Image as ChakraImage } from '@chakra-ui/react'
import useSWRImmutable from 'swr/immutable'
import axios from 'axios'

import { Image as ImageEntity, } from '../../../entities/notion/blocks';

export function Image({entity}: {entity: ImageEntity}) {
  const fetcher = async (url:string) => {
    console.log('fetching... -> ' + url)
    const result = await axios.get(url)
    console.log('result... -> ' + JSON.stringify(result))
    return result.data
  }

  const { data: withinExpiration } = useSWRImmutable(entity.url, fetcher, {shouldRetryOnError: false})
  const { data: fetchedBlockImage } = useSWRImmutable(withinExpiration ? null: `/api/notion/blocks/${entity.id}`, fetcher)

  let imageEntity: ImageEntity = entity

  if (fetchedBlockImage) imageEntity = new ImageEntity(fetchedBlockImage)

  return (
    <Center
      filter='drop-shadow(3px 3px 3px rgba(0,0,0,0.2))'
    >
      <ChakraImage
        boxSize='80%'
        src={imageEntity.url}
        objectFit="contain"
      />
    </Center>
  )
}

