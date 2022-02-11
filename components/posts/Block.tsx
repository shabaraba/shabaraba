import * as Blocks from './blocks'

const Component = {
  Paragraph: Blocks.Paragraph,
  Heading1: Blocks.Heading1,
  Heading2: Blocks.Heading2,
  Heading3: Blocks.Heading3,
  Code: Blocks.Code,
  Callout: Blocks.Callout,
  Image: Blocks.Image,
}

export default function Block({entity}: {entity: any}) {
  const BlockComponent = Component[entity.type]
  return <BlockComponent entity={ entity } />
}


