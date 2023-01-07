import * as NotionBlockInterfaces from '../interfaces/NotionApiResponses';
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
        text: resp.callout.text,
        children: resp.callout.children,
      }
    };
    super(paragraph);
    this.type = "Callout";

    this.texts = [];
    resp.callout.text.map((text: NotionBlockInterfaces.IText) => {
      this.texts.push(new Text(text));
    });

    this.icon = null;
    if ('emoji' in resp.callout.icon) {
      this.icon = resp.callout.icon.emoji;
    }
  }
}
