import * as NotionBlockInterfaces from '../interfaces/NotionApiResponses';
import { Block } from "./Block";


export class Embed extends Block {
  public url: string;

  constructor(resp: NotionBlockInterfaces.IEmbedBlock) {
    super(resp.id);
    this.type = "Embed";
    this.url = resp.embed.url;
  }

  public isTweet() {
    return this.url.match('twitter');
  }
}
