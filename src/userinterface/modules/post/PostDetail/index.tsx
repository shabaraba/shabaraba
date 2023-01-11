import { Box, Divider } from "@chakra-ui/react"
import BlockComponent from "../../../components/blocks/Block"
import { v4 as uuidv4 } from 'uuid'
import { PostDetailType } from "core/types/PostDetailType"
import { SomeoneBlockType } from "core/types/PostBlockType"

type Props = {
  postDetail: PostDetailType
}
export const PostDetail: React.FC<Props> = ({ postDetail }: Props) => {

  return (
    <Box as='article' pl={{ lg: '15%', base: '0%' }} pr={{ lg: '15%', base: '0%' }}>
      {postDetail.blockList.map((block: SomeoneBlockType) =>
        <BlockComponent
          key={uuidv4()}
          entity={block} />
      )}
      <Divider size="large" />
    </Box>
  )
}