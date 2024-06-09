import { BlockList } from "../objects/entities/blocks"
import { Block } from "../objects/entities/blocks/Block"
import { BulletedList, NumberedList } from "../objects/entities/blocks/List"
import { BulletedListItem, NumberedListItem } from "../objects/entities/blocks/ListItem"
import { BlockFactory } from "./factories/NotionBlockFactory"
import { BlockType } from "./types/NotionApiResponses"

export const convertToBlockList = (input: BlockType[], nest: number = 0): Block[] => {
    let isInBulletedList: boolean = false
    let isInNumberedList: boolean = false

    let bulletedList = new BulletedList("id", nest)
    let numberedList = new NumberedList("id", nest)

    let blocks: BlockList = [];
    input.forEach((item: BlockType) => {

      if (isInBulletedList && item.type != 'bulleted_list_item') {
        isInBulletedList = false
        blocks.push(bulletedList)
        bulletedList = new BulletedList("id", nest)
      }
      if (isInNumberedList && item.type != 'numbered_list_item') {
        isInNumberedList = false
        blocks.push(numberedList)
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
        blocks.push(block);
      }
    })
    if (isInBulletedList) {
      isInBulletedList = false
      blocks.push(bulletedList)
    }
    if (isInNumberedList) {
      isInNumberedList = false
      blocks.push(numberedList)
    }

    return blocks;
  }
