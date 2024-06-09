import { Block } from "./Block";
import { ListItem } from './ListItem';


export class List extends Block {
  public listItem: ListItem[] = [];

  constructor(id: string, nest: number) {
    super(id, nest);
  }

  public appendItem(item: ListItem) {
    this.listItem.push(item);
  }
}

export class NumberedList extends List {
  constructor(id: string, nest: number) {
    super(id, nest);
    this.type = "NumberedList";
  }
}

export class BulletedList extends List {
  constructor(id: string, nest: number) {
    super(id, nest);
    this.type = "BulletedList";
  }
}

