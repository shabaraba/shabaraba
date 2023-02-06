import { OGPEntity } from "./OGPEntity";

type Props = { id: string; title: string; url: string; tags: any; publishedAt: string; ogp?: OGPEntity }

export class MyLinkEntity {
  public id: string;
  public url: string;
  public tags: any; // TODO:
  public title: string;
  public ogp: OGPEntity;
  public publishedAt: string;

  constructor({ id, title, url, tags, publishedAt, ogp }: Props) {
    this.id = id;
    this.title = title;
    this.url = url;
    this.tags = tags;
    this.publishedAt = publishedAt;
    this.ogp = ogp ?? new OGPEntity();
  }
}