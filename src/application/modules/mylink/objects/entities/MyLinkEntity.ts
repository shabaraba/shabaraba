type Props = { id: string; title: string; url: string; tags: any; publishedAt: string; }

export class MyLinkEntity {
  public id: string;
  public url: string;
  public tags: any; // TODO:
  public title: string;
  public publishedAt: string;


  constructor({ id, title, url, tags, publishedAt }: Props) {
    this.id = id;
    this.title = title;
    this.url = url;
    this.tags = tags;
    this.publishedAt = publishedAt;
  }
}