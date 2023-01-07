import * as NotionBlockInterfaces from '../interfaces/NotionApiResponses';
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
        text: resp.bulleted_list_item.text,
        children: resp.bulleted_list_item.children,
      }
    };
    super(paragraph, nest);
    this.type = "BulletedListItem";
  }
}
