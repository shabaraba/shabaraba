import * as NotionBlockInterfaces from '../../../../../../core/types/NotionApiResponses';
import { Text } from "./Text";
import { Block } from "./Block";


export class Heading2 extends Block {
  public texts: Text[];

  constructor(resp: NotionBlockInterfaces.IHeading2Block) {
    super(resp.id);
    this.type = "Heading2";

    this.texts = [];
    // Notion APIの仕様変更に対応: rich_textプロパティを優先的に使用し、存在しない場合はtextプロパティを使用
    const textSource = resp.heading_2.rich_text || resp.heading_2.text || [];
    textSource.map((text) => {
      this.texts.push(new Text(text));
    });
  }
}
