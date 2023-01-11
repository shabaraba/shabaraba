import * as NotionBlockInterfaces from '../../../../../../core/types/NotionApiResponses';
import { Text } from "./Text";
import { Block } from "./Block";


export class Image extends Block {
  public captions: Text[];
  public url: string;

  constructor(resp: NotionBlockInterfaces.IImageBlock) {
    super(resp.id);
    this.type = "Image";

    const fileType = resp.image.type;
    this.url = resp.image[fileType].url;
    this.captions = [];
    resp.image.caption?.map((caption: NotionBlockInterfaces.IText) => {
      this.captions.push(new Text(caption));
    });
  }
}
