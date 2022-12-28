import { Box, Divider } from "@chakra-ui/react"
import Block from "../blocks/Block"
import { v4 as uuidv4 } from 'uuid'
import * as NotionBlock from '../../../../entities/notion/blocks'

type Props = {
  blockList: NotionBlock.BlockList
}
export const PostDetail: React.FC<Props> = ({ blockList }: Props) => {

  return (
    <Box as='article' pl={{ lg: '15%', base: '0%' }} pr={{ lg: '15%', base: '0%' }}>
      {blockList.data.map((block: NotionBlock.Block) =>
        <Block
          key={uuidv4()}
          entity={block} />
      )}
      <Divider size="large" />
    </Box>
  )
}