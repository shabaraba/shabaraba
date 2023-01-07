import { Box, Divider } from "@chakra-ui/react"
import Block from "../blocks/Block"
import { v4 as uuidv4 } from 'uuid'
import { Block as BlockEntity } from "../../../../application/modules/post/objects/entities/blocks/Block"
import { PostDetailEntity } from "core/entities/PostDetailEntity"

type Props = {
  postDetail: PostDetailEntity
}
export const PostDetail: React.FC<Props> = ({ postDetail }: Props) => {

  return (
    <Box as='article' pl={{ lg: '15%', base: '0%' }} pr={{ lg: '15%', base: '0%' }}>
      {postDetail.blockList.map((block: BlockEntity) =>
        <Block
          key={uuidv4()}
          entity={block} />
      )}
      <Divider size="large" />
    </Box>
  )
}