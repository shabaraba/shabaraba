import axios from "axios"

import type {
  ListBlockChildrenResponse,
} from '@notionhq/client/build/src/api-endpoints.d'

import * as NotionBlock from '../entities/notion/blocks';
import * as NotionBlockInterfaces from '../interfaces/NotionApiResponses';

// export async function test() {
//   // Initializing a client
//   console.log("call axios");
//   axios.get(
//     '/.netlify/functions/notion_get_post_list',
//   ).then(res => {
//     console.log("catch: ");
//     console.log(res);
//   })
//   return 1;
// }

export function test(response) {
  console.log(response);
  console.log("-------------------");
  let blocks: Array<NotionBlock.Block> = [];
  response.results.map((item: any) => {
    let itemType = item.type;
    console.log("type: " + itemType);
    switch (itemType) {
      case 'paragraph':
        let paragraph: NotionBlockInterfaces.IParagraphBlock = item;
        blocks.push(new NotionBlock.Paragraph(paragraph));
        break;
      case 'heading_1':
        let heading1: NotionBlockInterfaces.IHeading1Block = item;
        blocks.push(new NotionBlock.Heading1(heading1));
        break;
      case 'heading_2':
        let heading2: NotionBlockInterfaces.IHeading2Block = item;
        blocks.push(new NotionBlock.Heading2(heading2));
        break;
      case 'heading_3':
        let heading3: NotionBlockInterfaces.IHeading3Block = item;
        blocks.push(new NotionBlock.Heading3(heading3));
        break;
      case 'callout':
        let callout: NotionBlockInterfaces.ICalloutBlock = item;
        blocks.push(new NotionBlock.Callout(callout));
        break;
      case 'code':
        let code: NotionBlockInterfaces.ICodeBlock = item;
        blocks.push(new NotionBlock.Code(code));
        break;
      case 'image':
        let image: NotionBlockInterfaces.IImageBlock = item;
        blocks.push(new NotionBlock.Image(image));
        break;
      default:
        break;
    }
  })
  return blocks;
}
