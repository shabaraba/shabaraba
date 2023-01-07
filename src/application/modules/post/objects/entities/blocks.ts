import * as NotionBlockInterfaces from './interfaces/NotionApiResponses';
import { Bookmark } from './blocks/Bookmark';
import { BulletedList, BulletedListItem } from './blocks/BulletedList';
import { Callout } from './blocks/Callout';
import { Code } from './blocks/Code';
import { Embed } from './blocks/Embed';
import { Heading1 } from './blocks/Heading1';
import { Heading2 } from './blocks/Heading2';
import { Heading3 } from './blocks/Heading3';
import { Image } from './blocks/Image';
import { NumberedList, NumberedListItem } from './blocks/NumberedList';
import { Paragraph } from './blocks/Paragraph';
import { Quote } from './blocks/Quote';
import { Block } from './blocks/Block';

export class BlockList {
  public data:Block[]

  constructor(data?: Block[]) {
    if (data == null) {
      this.data = []
    } else {
      this.data = data
    }
  }

  public append(block: Block) {
    this.data.push(block)
  }

  public serialize() {
    return JSON.stringify(this.data)
  }

  static deserialize(input: NotionBlockInterfaces.BlockType[], nest: number = 0): BlockList {
    let isInBulletedList: boolean = false
    let isInNumberedList: boolean = false

    let bulletedList = new BulletedList("id", nest)
    let numberedList = new NumberedList("id", nest)

    let blocks: BlockList = new BlockList()
    input.map((item: NotionBlockInterfaces.BlockType) => {

      if (isInBulletedList && item.type != 'bulleted_list_item') {
        isInBulletedList = false
        blocks.append(bulletedList)
        bulletedList = new BulletedList("id", nest)
      }
      if (isInNumberedList && item.type != 'numbered_list_item') {
        isInNumberedList = false
        blocks.append(numberedList)
        numberedList = new NumberedList("id", nest)
      }

      switch (item.type) {
        case 'paragraph':
          blocks.append(new Paragraph(item as NotionBlockInterfaces.IParagraphBlock));
          break;
        case 'heading_1':
          blocks.append(new Heading1(item as NotionBlockInterfaces.IHeading1Block));
          break;
        case 'heading_2':
          blocks.append(new Heading2(item as NotionBlockInterfaces.IHeading2Block));
          break;
        case 'heading_3':
          blocks.append(new Heading3(item as NotionBlockInterfaces.IHeading3Block));
          break;
        case 'callout':
          blocks.append(new Callout(item as NotionBlockInterfaces.ICalloutBlock));
          break;
        case 'code':
          blocks.append(new Code(item as NotionBlockInterfaces.ICodeBlock));
          break;
        case 'image':
          blocks.append(new Image(item as NotionBlockInterfaces.IImageBlock));
          break;
        case 'bookmark':
          blocks.append(new Bookmark(item as NotionBlockInterfaces.IBookmarkBlock));
          break;
        case 'bulleted_list_item':
          isInBulletedList = true
          bulletedList.appendItem(new BulletedListItem(item as NotionBlockInterfaces.IBulletedListItemBlock, nest))
          break;
        case 'numbered_list_item':
          isInNumberedList = true
          numberedList.appendItem(new NumberedListItem(item as NotionBlockInterfaces.INumberedListItemBlock, nest))
          break;
        case 'quote':
          blocks.append(new Quote(item as NotionBlockInterfaces.IQuoteBlock));
          break;
        case 'embed':
          blocks.append(new Embed(item as NotionBlockInterfaces.IEmbedBlock));
          break;
        // case 'table':
          // break;
        default:
          break;
      }
    })
    if (isInBulletedList) {
      isInBulletedList = false
      blocks.append(bulletedList)
    }
    if (isInNumberedList) {
      isInNumberedList = false
      blocks.append(numberedList)
    }

    return blocks;
  }
}
