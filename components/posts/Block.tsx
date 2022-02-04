import * as Blocks from './blocks'

// 文字列のままカスタムタグに指定するとhtmlタグとして読まれてしまう
// そのため文字列とコンポーネントを紐付ける層が必要
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
  console.log("rending block...")
  console.log(entity)
  const BlockComponent = Component[entity.type]
  console.log(BlockComponent)
  return <BlockComponent entity={ entity } />
}


