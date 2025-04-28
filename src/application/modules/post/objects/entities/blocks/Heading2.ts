import * as NotionBlockInterfaces from '../../../../../../core/types/NotionApiResponses';
import { Text } from "./Text";
import { Block } from "./Block";


export class Heading2 extends Block {
  public texts: Text[];

  constructor(resp: NotionBlockInterfaces.IHeading2Block) {
    super(resp.id);
    this.type = "Heading2";

    this.texts = [];
    // 新しいAPIでは rich_text フィールドを使用、旧APIとの後方互換性のために text フィールドもサポート
    const textArray = resp.heading_2.rich_text || resp.heading_2.text || [];
    textArray.map((text) => {
      this.texts.push(new Text(text));
    });
  }
}
