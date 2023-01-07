import * as NotionBlockInterfaces from '../types/NotionApiResponses';
import { Text } from "./Text";
import { Block } from "./Block";


export class Heading1 extends Block {
  public texts: Text[];

  constructor(resp: NotionBlockInterfaces.IHeading1Block) {
    super(resp.id);
    this.type = "Heading1";

    this.texts = [];
    resp.heading_1.text.map((text) => {
      this.texts.push(new Text(text));
    });
  }
}
