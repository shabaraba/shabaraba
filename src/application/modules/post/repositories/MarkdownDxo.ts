import {unified, Plugin} from "unified";
import {visit} from "unist-util-visit";
import remarkParse from "remark-parse";
import type {Root, Heading, PhrasingContent, Paragraph, Text} from "mdast";
import { Heading1 } from "../objects/entities/blocks/Heading1";
import { Heading2 } from "../objects/entities/blocks/Heading2";
import { Heading3 } from "../objects/entities/blocks/Heading3";
import { Callout } from "../objects/entities/blocks/Callout";
import { Code } from "../objects/entities/blocks/Code";
import { Image } from "../objects/entities/blocks/Image";
import { Bookmark } from "../objects/entities/blocks/Bookmark";
import { BulletedListItem, NumberedListItem } from "../objects/entities/blocks/ListItem";
import { Quote } from "../objects/entities/blocks/Quote";
import { Embed } from "../objects/entities/blocks/Embed";
import { makeHeading, makeParagraph } from "./factories/GitHubBlockFactory";
import { SomeoneBlockType } from "core/types/PostBlockType";

export class MarkdownDxo {

  // static convertToBlockList(input: BlockType[], nest: number = 0): BlockList {
  static convertNodeToBlock(node: Heading|Paragraph|Text|any, nest: number = 0): SomeoneBlockType {
    switch (node.type) {
      case "heading": {
        const depth = node.depth;
        const text = node.children.map((child: PhrasingContent) => child.type === "text" ? child.value : "").join("");
        return makeHeading({depth, text, nest});
      }
      case "paragraph": {
        // console.log(JSON.stringify(node, null, 2));
        const children = node.children;
        return makeParagraph({nest, children});
      }
      default:
        break;
    }
  } 
  static convertToBlockList(markdown: string, nest: number = 0): SomeoneBlockType[] {
    let isInBulletedList: boolean = false
    let isInNumberedList: boolean = false

    // let bulletedList = new BulletedList("id", nest)
    // let numberedList = new NumberedList("id", nest)

    let blocks: SomeoneBlockType[] = [];

    const tree = unified().use(remarkParse).parse(markdown);

    visit(tree, (node) => blocks.push(MarkdownDxo.convertNodeToBlock(node, nest)));
    // console.log(JSON.stringify(blocks, null, 2));

    // return jsonNodes;  

    // input.forEach((item: BlockType) => {

      // if (isInBulletedList && item.type != 'bulleted_list_item') {
      //   isInBulletedList = false
      //   blocks.append(bulletedList)
      //   bulletedList = new BulletedList("id", nest)
      // }
      // if (isInNumberedList && item.type != 'numbered_list_item') {
      //   isInNumberedList = false
      //   blocks.append(numberedList)
      //   numberedList = new NumberedList("id", nest)
      // }
      // const block = BlockFactory.make({target: item, nest: nest});
      // if (block == null) return;
      // if (item.type === "bulleted_list_item") {
      //     isInBulletedList = true
      //     bulletedList.appendItem(block as BulletedListItem);
      // } else if (item.type === "numbered_list_item") {
      //     isInNumberedList = true
      //     numberedList.appendItem(block as NumberedListItem);
      // } else {
      //   blocks.append(block);
      // }
    // })
    // if (isInBulletedList) {
    //   isInBulletedList = false
    //   blocks.append(bulletedList)
    // }
    // if (isInNumberedList) {
    //   isInNumberedList = false
    //   blocks.append(numberedList)
    // }

    return blocks;
  }

  private static markdownToJson (markdown: string) {
    const tree: Root = unified().use(remarkParse).parse(markdown);
    console.log(JSON.stringify(tree, null, 2));

    const jsonNodes: any[] = [];

    visit(tree, "heading",(node: Heading) => {
        jsonNodes.push({
          type: `h${node.depth}`,
          text: (node.children[0].type == "text") ? String(node.children[0].value) : "",
        });
    });

    return jsonNodes;  
  }
}
