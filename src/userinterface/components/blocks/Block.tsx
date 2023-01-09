import { OneBlockType } from 'core/types/PostBlockType'
import BlockComponents from '.'

export default function Block({entity}: {entity: OneBlockType}) {

  const BlockComponent = BlockComponents[entity.type]
  return <BlockComponent entity={ entity } />
}


