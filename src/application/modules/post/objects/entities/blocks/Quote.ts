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
        rich_text: resp.quote.rich_text,
        children: resp.quote.children,
      }
    };
    super(paragraph);
    this.type = "Quote";
  }
}
