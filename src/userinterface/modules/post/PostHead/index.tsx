import { LinkBox, Box } from '@chakra-ui/react'
import { FC } from 'react'
import { EyeChatch } from './_EyeCatch'
import { Description } from './_Description'
import { PublishDate } from '../../../components/PublishDate'
import { PostHeadEntity } from 'core/entities/PostHeadEntity'

type Props = { postHead: PostHeadEntity };

export const PostHead: FC<Props> = ({ postHead }) => {
  const style = {
    marginTop: 5,
    display: { md: "flex" },
    borderRadius: 10,
    overflow: 'hidden',
    filter: 'drop-shadow(3px 3px 3px rgba(0,0,0,0.2))',
    _hover: {
      filter: 'drop-shadow(10px 10px 10px rgba(0,0,0,0.4))',
      transition: 'all .3s',
    },
    bg: '#FFF5F3',
    height: { md: 120 },
    width: '100%',
  };

  return (
    <LinkBox as="article" position='relative' {...style}>
      <EyeChatch eyeCatchUrl={postHead.coverImageUrl} iconText={postHead.iconText} />
      <Description url={`/posts/${postHead.slug}`} title={postHead.title} tagList={postHead.tags} />
      <Box fontSize={{ base: '12px', sm: '14px' }} textAlign={['right']} position='absolute' bottom={{ md: 2 }} right={{ md: 2 }} >
        <PublishDate publishedAt={postHead.publishedAt} updatedAt={postHead.updatedAt} />
      </Box>
    </LinkBox>
  )
} 
