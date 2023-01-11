import * as NotionBlockInterfaces from '../../../../../../core/types/NotionApiResponses';
import { Paragraph } from './Paragraph';
import { Block } from "./Block";


export class List extends Block {
  public listItem: ListItem[] = [];

  constructor(id: string, nest: number) {
    super(id, nest);
  }

  public appendItem(item: ListItem) {
    this.listItem.push(item);
  }
}

export class ListItem extends Paragraph {
  constructor(resp: NotionBlockInterfaces.IParagraphBlock, nest?: number) {
    super(resp, nest);
  }
}
