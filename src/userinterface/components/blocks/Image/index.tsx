import NextjsImage from 'next/image'
import { Center, Skeleton } from '@chakra-ui/react'
import useSWRImmutable from 'swr/immutable'
import axios from 'axios'

import { Image as ImageEntity } from "../../../../application/modules/post/objects/entities/blocks/Image";

type Props = { entity: ImageEntity };

export const ImageComponent: React.FC<Props> = ({ entity }: Props) => {
  const fetcher = async (url: string) => {
    const result = await axios.get(url)
    return result.data
  }

  const { data: fetchedBlockImage } = useSWRImmutable(`/api/notion/blocks/${entity.id}`, fetcher)

  if (!fetchedBlockImage) return <Skeleton height={400} />

  const fetchedImageEntity: ImageEntity = new ImageEntity(fetchedBlockImage)
  const caption = (fetchedImageEntity.captions?.length > 0) ? fetchedImageEntity.captions[0].content : ''

  const imageStyle = {
    src: fetchedImageEntity.url,
    height: 600,
    width: 800,
    alt: caption,
    objectFit: "contain",
  }

  return (
    <Center filter='drop-shadow(3px 3px 3px rgba(0,0,0,0.2))' >
      <NextjsImage {...imageStyle} />
    </Center>
  )
}
