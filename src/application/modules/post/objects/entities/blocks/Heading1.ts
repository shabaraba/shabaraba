import * as NotionBlockInterfaces from '../../../../../../core/types/NotionApiResponses';
import { Text } from "./Text";
import { Block } from "./Block";


export class Heading1 extends Block {
  public texts: Text[];

  constructor(resp: NotionBlockInterfaces.IHeading1Block) {
    super(resp.id);
    this.type = "Heading1";

    this.texts = [];
    // Notion APIの仕様変更に対応: rich_textプロパティを優先的に使用し、存在しない場合はtextプロパティを使用
    const textSource = resp.heading_1.rich_text || resp.heading_1.text || [];
    textSource.map((text) => {
      this.texts.push(new Text(text));
    });
  }
}
