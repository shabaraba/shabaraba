import { PostHeadType } from "core/types/PostHeadType";

type Props = PostHeadType;

export class PostHeadEntity {
  public id: string;
  public coverImageUrl: string;
  public iconText: string;
  public slug: string;
  public tags: any; // TODO:
  public title: string;
  public publishedAt: Date;
  public updatedAt: Date;

  constructor({ id, title, coverImageUrl, iconText, slug, tags, publishedAt, updatedAt }: Props) {
    this.id = id;
    this.title = title;
    this.coverImageUrl = coverImageUrl;
    this.iconText = iconText;
    this.slug = slug;
    this.tags = tags;
    this.publishedAt = new Date(publishedAt);
    this.updatedAt = new Date(updatedAt);
  }
}