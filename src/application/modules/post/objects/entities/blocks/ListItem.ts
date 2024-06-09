import * as NotionBlockInterfaces from "application/modules/post/repositories/types/NotionApiResponses";
import { Paragraph } from "./Paragraph";

export class ListItem extends Paragraph {
  constructor(resp: NotionBlockInterfaces.IParagraphBlock, nest?: number) {
    super(resp, nest);
  }
}

export class BulletedListItem extends ListItem {
  constructor(resp: NotionBlockInterfaces.IBulletedListItemBlock, nest?: number) {
    const paragraph: NotionBlockInterfaces.IParagraphBlock = {
      object: 'block',
      id: resp.id,
      has_children: resp.has_children,
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

export class NumberedListItem extends ListItem {
  constructor(resp: NotionBlockInterfaces.INumberedListItemBlock, nest?: number) {
    const paragraph: NotionBlockInterfaces.IParagraphBlock = {
      object: 'block',
      id: resp.id,
      has_children: resp.has_children,
      type: "paragraph",
      paragraph: {
        text: resp.numbered_list_item.text,
        children: resp.numbered_list_item.children,
      }
    };
    super(paragraph, nest);
    this.type = "NumberedListItem";
  }
}
