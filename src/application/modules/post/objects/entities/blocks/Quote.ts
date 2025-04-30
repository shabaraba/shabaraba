import * as NotionBlockInterfaces from '../../../../../../core/types/NotionApiResponses';
import { Paragraph } from './Paragraph';


export class Quote extends Paragraph {
  constructor(resp: NotionBlockInterfaces.IQuoteBlock) {
    const paragraph: NotionBlockInterfaces.IParagraphBlock = {
      object: 'block',
      id: resp.id,
      created_time: resp.created_time,
      last_edited_time: resp.last_edited_time,
      has_children: resp.has_children,
      archived: resp.archived,
      type: "paragraph",
      paragraph: {
        // Notion APIの仕様変更に対応: rich_textプロパティを優先的に使用し、存在しない場合はtextプロパティを使用
        rich_text: resp.quote.rich_text || resp.quote.text,
        text: resp.quote.text,
        // childrenがundefinedの場合、空のリストオブジェクトに置き換える
        children: resp.quote.children || {
          object: "list",
          results: []
        },
      }
    };
    super(paragraph);
    this.type = "Quote";
  }
}
