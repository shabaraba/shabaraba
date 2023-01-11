import { SomeoneBlockType } from 'core/types/PostBlockType'
import BlockComponents from '.'

export default function BlockComponent({ entity }: { entity: SomeoneBlockType }) {

  const _BlockComponent = BlockComponents[entity.type]
  console.log(_BlockComponent)
  return <_BlockComponent entity={entity} />
}
