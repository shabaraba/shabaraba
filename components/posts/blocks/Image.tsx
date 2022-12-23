import NextjsImage from 'next/image'
import { Center, Skeleton, Stack } from '@chakra-ui/react'
import useSWRImmutable from 'swr/immutable'
import axios from 'axios'

import { Image as ImageEntity, } from '../../../entities/notion/blocks';

export function Image({entity}: {entity: ImageEntity}) {
  const fetcher = async (url:string) => {

    const result = await axios.get(url)

    return result.data
  }

  const { data: fetchedBlockImage } = useSWRImmutable(`/api/notion/blocks/${entity.id}`, fetcher)

  if (!fetchedBlockImage) return <Skeleton height={400} />

  const fetchedImageEntity: ImageEntity = new ImageEntity(fetchedBlockImage)
  const caption = (fetchedImageEntity.captions?.length > 0) ? fetchedImageEntity.captions[0].content : ''

  return (
    <Center
      filter='drop-shadow(3px 3px 3px rgba(0,0,0,0.2))'
    >
      <NextjsImage
        src={fetchedImageEntity.url}
        height={600}
        width={800}
        loading='lazy'
        alt={caption}
        objectFit="contain"
      />
    </Center>
  )
}
// export function Image({entity}: {entity: ImageEntity}) {
//   const [shouldFetch, setShouldFetch] = useState(false)
//   const fetcher = async (url:string) => {

//     const result = await axios.get(url)

//     return result.data
//   }

//   const { data: fetchedBlockImage } = useSWRImmutable(shouldFetch ? `/api/notion/blocks/${entity.id}` : null, fetcher)

//   if (!fetchedBlockImage) {

//     return (
//       <Center
//         filter='drop-shadow(3px 3px 3px rgba(0,0,0,0.2))'
//       >
//         <NextjsImage
//           src={entity.url}
//           height={600}
//           width={800}
//           alt="image"
//           loading='lazy'
//           objectFit="contain"
//           onError={(e) => setShouldFetch(true)}
//           // fallback={<SkeletonImage />}
//         />
//       </Center>
//     )
//   } else {

//     const fetchedImageEntity: ImageEntity = new ImageEntity(fetchedBlockImage)
//     return (
//       <Center
//         filter='drop-shadow(3px 3px 3px rgba(0,0,0,0.2))'
//       >
//         <NextjsImage
//           src={fetchedImageEntity.url}
//           height={600}
//           width={800}
//           loading='lazy'
//           alt="newImage"
//           objectFit="contain"
//           // fallback={<SkeletonImage />}
//         />
//       </Center>
//     )
//   }
// }

