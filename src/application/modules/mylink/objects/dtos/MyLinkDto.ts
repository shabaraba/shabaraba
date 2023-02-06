type Props = { id: string; title: string; url: string; tags: any; ogp: string }

export class MyLinkDto {
  public id: string;
  public url: string;
  public tags: any; // TODO:
  public title: string;
  public ogp: string;

  constructor({ id, title, url, tags, ogp }: Props) {
    this.id = id;
    this.title = title;
    this.url = url;
    this.tags = tags;
    this.ogp = ogp;
  }
}