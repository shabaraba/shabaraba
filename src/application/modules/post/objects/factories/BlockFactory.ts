import { BlockType, IParagraphBlock, IHeading1Block, IHeading2Block, IHeading3Block, ICalloutBlock, ICodeBlock, IImageBlock, IBookmarkBlock, IBulletedListItemBlock, INumberedListItemBlock, IQuoteBlock, IEmbedBlock } from "core/types/NotionApiResponses";
import { Block } from "../entities/blocks/Block";
import { Bookmark } from "../entities/blocks/Bookmark";
import { BulletedListItem } from "../entities/blocks/BulletedList";
import { Callout } from "../entities/blocks/Callout";
import { Code } from "../entities/blocks/Code";
import { Image } from "../entities/blocks/Image";
import { Embed } from "../entities/blocks/Embed";
import { Heading1 } from "../entities/blocks/Heading1";
import { Heading2 } from "../entities/blocks/Heading2";
import { Heading3 } from "../entities/blocks/Heading3";
import { NumberedListItem } from "../entities/blocks/NumberedList";
import { Paragraph } from "../entities/blocks/Paragraph";
import { Quote } from "../entities/blocks/Quote";

export class BlockFactory {
  /**
   * List系は呼び出し元で用意してもらい、必要に応じて　appendしてもらう
   */
  static make({ target, nest = 0 }: { target: BlockType, nest?: number }): Block {
    switch (target.type) {
      case 'paragraph':
        return (new Paragraph(target as IParagraphBlock));
      case 'heading_1':
        return (new Heading1(target as IHeading1Block));
      case 'heading_2':
        return (new Heading2(target as IHeading2Block));
      case 'heading_3':
        return (new Heading3(target as IHeading3Block));
      case 'callout':
        return (new Callout(target as ICalloutBlock));
      case 'code':
        return (new Code(target as ICodeBlock));
      case 'image':
        return (new Image(target as IImageBlock));
      case 'bookmark':
        return (new Bookmark(target as IBookmarkBlock));
      case 'bulleted_list_item':
        return (new BulletedListItem(target as IBulletedListItemBlock, nest))
      case 'numbered_list_item':
        return (new NumberedListItem(target as INumberedListItemBlock, nest))
      case 'quote':
        return (new Quote(target as IQuoteBlock));
      case 'embed':
        return (new Embed(target as IEmbedBlock));
      default:
        return null;
    }
  }
}