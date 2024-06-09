import * as NotionBlockInterfaces from '../../../../../../core/types/NotionApiResponses';
import { Text } from "./Text";
import { Block } from "./Block";

export class Heading1 extends Block {
  public texts: Text[];

  constructor(resp: Prop) {
    super(resp.id);
    this.type = "Heading1";

    this.texts = [];
    resp.text.map((text) => {
      this.texts.push(new Text(text));
    });
  }
}
