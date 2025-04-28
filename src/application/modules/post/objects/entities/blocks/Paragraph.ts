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
    // Notion APIの仕様変更に対応: rich_textプロパティを優先的に使用し、存在しない場合はtextプロパティを使用
    const textSource = resp.paragraph.rich_text || resp.paragraph.text || [];
    textSource.map((text: NotionBlockInterfaces.IText) => {
      this.texts.push(new Text(text));
    });
    this.children = [];
    // childrenがundefinedまたは空配列の場合はデフォルト値を使用
    const children = resp.paragraph.children || { object: "list", results: [] };
    if (children.results?.length > 0) {
      const childBlockList = BlockList.deserialize(children.results, this.nest + 1);
      this.children = childBlockList.data;
    }
  }
}
