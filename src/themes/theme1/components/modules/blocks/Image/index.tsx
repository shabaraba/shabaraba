import NextjsImage from 'next/image'
import { Center, Skeleton } from '@chakra-ui/react'
import useSWRImmutable from 'swr/immutable'
import { ImageBlockType, ImageType } from 'core/types/PostBlockType';
import { PostImageUsecase } from 'application/usecases/PostImageUsecase';

type Props = { entity: ImageBlockType };

export const ImageComponent: React.FC<ImageType> = (image: ImageType) => {
  const caption = (image.captions?.length > 0) ? image.captions[0].content : ''

  const imageStyle = {
    src: image.url,
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

export const getStaticProps = async ({ entity }: Props) => {
  PostImageUsecase.getInPost(entity.id);
}
