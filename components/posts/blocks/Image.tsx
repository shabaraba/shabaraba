import { useState } from 'react'
import { Center, Skeleton, Image as ChakraImage } from '@chakra-ui/react'
import useSWRImmutable from 'swr/immutable'
import axios from 'axios'

import { Image as ImageEntity, } from '../../../entities/notion/blocks';

const SkeletonImage = () => {
  return (
    <Skeleton h={300}/>
  )
}

export function Image({entity}: {entity: ImageEntity}) {
  const [shouldFetch, setShouldFetch] = useState(false)
  const fetcher = async (url:string) => {
    console.log('fetching... -> ' + url)
    const result = await axios.get(url)
    console.log('result... -> ' + JSON.stringify(result))
    return result.data
  }

  const { data: fetchedBlockImage } = useSWRImmutable(shouldFetch ? `/api/notion/blocks/${entity.id}` : null, fetcher)

  if (!fetchedBlockImage) {
    console.log('unfetched')
    return (
      <Center
        filter='drop-shadow(3px 3px 3px rgba(0,0,0,0.2))'
      >
        <ChakraImage
          boxSize='80%'
          src={entity.url}
          objectFit="contain"
          onError={(e) => setShouldFetch(true)}
          fallback={<SkeletonImage />}
        />
      </Center>
    )
  } else {
    console.log('fetched')
    const fetchedImageEntity: ImageEntity = new ImageEntity(fetchedBlockImage)
    return (
      <Center
        filter='drop-shadow(3px 3px 3px rgba(0,0,0,0.2))'
      >
        <ChakraImage
          boxSize='80%'
          src={fetchedImageEntity.url}
          objectFit="contain"
          fallback={<SkeletonImage />}
        />
      </Center>
    )
  }
}

