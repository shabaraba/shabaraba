import { PostHeadDto } from 'application/modules/post/objects/dtos/PostHeadDto';

export type PostHeadType = {
  id: string;
  title: string;
  coverImageUrl: string;
  iconText: string;
  tags: string;
  slug: string;
  publishedAt: string;
  updatedAt: string;
}

export class PostHeadDxo {

  public static convertForPages(dto: PostHeadDto): PostHeadType {
    return {
      id: dto.id,
      title: dto.title,
      coverImageUrl: dto.coverImageUrl,
      iconText: dto.iconText,
      tags: dto.tags,
      slug: dto.slug,
      publishedAt: dto.publishedAt,
      updatedAt: dto.updatedAt,
    };
  }
}