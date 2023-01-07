import * as NotionBlockInterfaces from '../types/NotionApiResponses';
import { Block } from "./Block";


export class Bookmark extends Block {
  public siteTitle?: string;
  public pageTitle?: string;
  public pageDescription?: string;
  public siteUrl?: string;
  public thumbnailUrl?: string;

  constructor(resp: NotionBlockInterfaces.IBookmarkBlock) {
    super(resp.id);
    this.type = "Bookmark";
    this.siteUrl = resp.bookmark.url;
    this.siteTitle = resp.bookmark.ogp.siteTitle;
    this.pageTitle = resp.bookmark.ogp.pageTitle;
    this.pageDescription = resp.bookmark.ogp.pageDescription;
    this.thumbnailUrl = resp.bookmark.ogp.thumbnailUrl;
  }
}
