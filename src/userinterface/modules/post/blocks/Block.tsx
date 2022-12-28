import BlockComponents from '.'

export default function Block({entity}: {entity: any}) {

  const BlockComponent = BlockComponents[entity.type]
  return <BlockComponent entity={ entity } />
}


