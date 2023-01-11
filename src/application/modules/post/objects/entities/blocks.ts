import { BulletedList, BulletedListItem } from './blocks/BulletedList';
import { NumberedList, NumberedListItem } from './blocks/NumberedList';
import { Block } from './blocks/Block';
import { BlockType } from 'core/types/NotionApiResponses';
import { BlockFactory } from '../factories/BlockFactory';

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

  static deserialize(input: BlockType[], nest: number = 0): BlockList {
    let isInBulletedList: boolean = false
    let isInNumberedList: boolean = false

    let bulletedList = new BulletedList("id", nest)
    let numberedList = new NumberedList("id", nest)

    let blocks: BlockList = new BlockList()
    input.forEach((item: BlockType) => {

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
      const block = BlockFactory.make({target: item, nest: nest});
      if (block == null) return;
      if (item.type === "bulleted_list_item") {
          isInBulletedList = true
          bulletedList.appendItem(block as BulletedListItem);
      } else if (item.type === "numbered_list_item") {
          isInNumberedList = true
          numberedList.appendItem(block as NumberedListItem);
      } else {
        blocks.append(block);
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
