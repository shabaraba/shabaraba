import * as NotionBlockInterfaces from '../../../../../../core/types/NotionApiResponses';
import { List, ListItem } from './List';


export class BulletedList extends List {
  constructor(id: string, nest: number) {
    super(id, nest);
    this.type = "BulletedList";
  }
}

export class BulletedListItem extends ListItem {
  constructor(resp: NotionBlockInterfaces.IBulletedListItemBlock, nest?: number) {
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
        rich_text: resp.bulleted_list_item.rich_text || resp.bulleted_list_item.text,
        text: resp.bulleted_list_item.text,
        // childrenがundefinedの場合、空のリストオブジェクトに置き換える
        children: resp.bulleted_list_item.children || {
          object: "list",
          results: []
        },
      }
    };
    super(paragraph, nest);
    this.type = "BulletedListItem";
  }
}
