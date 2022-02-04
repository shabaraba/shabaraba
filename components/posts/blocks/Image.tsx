import { Center, Text, Flex, Image as ChakraImage } from '@chakra-ui/react'
import type { Image as ImageEntity, } from '../../../entities/notion/blocks';

export function Image({entity}: {entity: ImageEntity}) {
  return (
    <Center>
      <ChakraImage 
        boxSize='80%'
        src={entity.url}
        objectFit="contain"
      />
    </Center>
  )
}


