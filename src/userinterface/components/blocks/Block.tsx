import { SomeoneBlockType } from 'core/types/PostBlockType'
import BlockComponents from '.'

export default function BlockComponent({ entity }: { entity: SomeoneBlockType }) {

  const _BlockComponent = BlockComponents[entity.type]
  return <_BlockComponent entity={entity} />
}
