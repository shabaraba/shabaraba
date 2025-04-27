import * as NotionBlockInterfaces from '../../../../../../core/types/NotionApiResponses';
import { Paragraph } from './Paragraph';
import { Text } from "./Text";


export class Callout extends Paragraph {
  public icon?: string;

  constructor(resp: NotionBlockInterfaces.ICalloutBlock) {
    const paragraph: NotionBlockInterfaces.IParagraphBlock = {
      object: 'block',
      id: resp.id,
      created_time: resp.created_time,
      last_edited_time: resp.last_edited_time,
      has_children: resp.has_children,
      archived: resp.archived,
      type: "paragraph",
      paragraph: {
        // Notion APIの仕様変更に対応: rich_textプロパティを優先的に使用し、存在しない場合はtextプロパティを使用
        rich_text: resp.callout.rich_text || resp.callout.text,
        text: resp.callout.text,
        children: resp.callout.children,
      }
    };
    super(paragraph);
    this.type = "Callout";

    this.texts = [];
    // Notion APIの仕様変更に対応: rich_textプロパティを優先的に使用し、存在しない場合はtextプロパティを使用
    const textSource = resp.callout.rich_text || resp.callout.text || [];
    textSource.map((text: NotionBlockInterfaces.IText) => {
      this.texts.push(new Text(text));
    });

    this.icon = null;
    if ('emoji' in resp.callout.icon) {
      this.icon = resp.callout.icon.emoji;
    }
  }
}
