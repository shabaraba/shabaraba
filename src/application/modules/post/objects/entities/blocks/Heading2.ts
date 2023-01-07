import * as NotionBlockInterfaces from '../interfaces/NotionApiResponses';
import { Text } from "./Text";
import { Block } from "./Block";


export class Heading2 extends Block {
  public texts: Text[];

  constructor(resp: NotionBlockInterfaces.IHeading2Block) {
    super(resp.id);
    this.type = "Heading2";

    this.texts = [];
    resp.heading_2.text.map((text) => {
      this.texts.push(new Text(text));
    });
  }
}
