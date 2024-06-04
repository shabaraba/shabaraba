type Props = { id: string; title: string; coverImageUrl: string; iconText: string; slug: string; tags: any; publishedAt: string; updatedAt: string; }

export class PostHeadDto {
  public id: string;
  public coverImageUrl: string;
  public iconText: string;
  public slug: string;
  public tags: Array<{name: string, color: string}>
  public title: string;
  public publishedAt: string;
  public updatedAt: string;

  constructor({ id, title, coverImageUrl, iconText, slug, tags, publishedAt, updatedAt }: Props) {
    this.id = id;
    this.title = title;
    this.coverImageUrl = coverImageUrl;
    this.iconText = iconText;
    this.slug = slug;
    this.tags = tags;
    this.publishedAt = publishedAt;
    this.updatedAt = updatedAt;
  }
}
