import * as NotionBlockInterfaces from '../../../../../../core/types/NotionApiResponses';
import { Text } from "./Text";
import { Block } from "./Block";


export class Heading1 extends Block {
  public texts: Text[];

  constructor(resp: NotionBlockInterfaces.IHeading1Block) {
    super(resp.id);
    this.type = "Heading1";

    this.texts = [];
    // 新しいAPIでは rich_text フィールドを使用、旧APIとの後方互換性のために text フィールドもサポート
    const textArray = resp.heading_1.rich_text || resp.heading_1.text || [];
    textArray.map((text) => {
      this.texts.push(new Text(text));
    });
  }
}
