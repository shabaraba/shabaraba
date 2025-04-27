import * as NotionBlockInterfaces from '../../../../../../core/types/NotionApiResponses';
import { List } from './List';
import { Paragraph } from './Paragraph';


export class NumberedList extends List {
  constructor(id: string, nest: number) {
    super(id, nest);
    this.type = "NumberedList";
  }
}

export class NumberedListItem extends Paragraph {
  constructor(resp: NotionBlockInterfaces.INumberedListItemBlock, nest?: number) {
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
        rich_text: resp.numbered_list_item.rich_text || resp.numbered_list_item.text,
        text: resp.numbered_list_item.text,
        children: resp.numbered_list_item.children,
      }
    };
    super(paragraph, nest);
    this.type = "NumberedListItem";
  }
}
