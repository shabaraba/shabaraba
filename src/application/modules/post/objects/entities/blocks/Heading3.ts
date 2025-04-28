import * as NotionBlockInterfaces from '../../../../../../core/types/NotionApiResponses';
import { Text } from "./Text";
import { Block } from "./Block";


export class Heading3 extends Block {
  public texts: Text[];

  constructor(resp: NotionBlockInterfaces.IHeading3Block) {
    super(resp.id);
    this.type = "Heading3";

    this.texts = [];
    // 新しいAPIでは rich_text フィールドを使用、旧APIとの後方互換性のために text フィールドもサポート
    const textArray = resp.heading_3.rich_text || resp.heading_3.text || [];
    textArray.map((text) => {
      this.texts.push(new Text(text));
    });
  }
}
