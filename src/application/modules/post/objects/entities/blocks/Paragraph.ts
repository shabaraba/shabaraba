import * as NotionBlockInterfaces from '../../../../../../core/types/NotionApiResponses';
import { BlockList } from '../blocks';
import { Text } from "./Text";
import { Block } from "./Block";


export class Paragraph extends Block {
  public texts: Text[];
  public children: Block[];

  constructor(resp: NotionBlockInterfaces.IParagraphBlock, nest?: number) {
    super(resp.id, nest);
    this.type = "Paragraph";

    this.texts = [];
    // 新しいAPIでは rich_text フィールドを使用、旧APIとの後方互換性のために text フィールドもサポート
    const textArray = resp.paragraph.rich_text || resp.paragraph.text || [];
    textArray.map((text: NotionBlockInterfaces.IText) => {
      this.texts.push(new Text(text));
    });
    this.children = [];
    if (resp.paragraph.children?.results?.length > 0) {
      const childBlockList = BlockList.deserialize(resp.paragraph.children.results, this.nest + 1);
      this.children = childBlockList.data;
    }
  }
}
