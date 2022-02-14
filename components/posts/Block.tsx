import BlockComponents from './blocks'

export default function Block({entity}: {entity: any}) {
  // console.log(entity)
  const BlockComponent = BlockComponents[entity.type]
  return <BlockComponent entity={ entity } />
}


