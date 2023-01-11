import { IPageHead } from "core/types/NotionPageApiResponses";
import { PostHeadDto } from "../dtos/PostHeadDto";

export class IPageHeadDxo {
  public static convertToDto(entity: IPageHead): PostHeadDto {
    let coverImageUrl: string | null = entity.cover?.file?.url ?? entity.cover?.external?.url ?? null
    let iconText: string | null = entity.icon?.emoji ?? null
    return new PostHeadDto({
      id: entity.id,
      title: entity.title,
      slug: entity.slug,
      tags: entity.tags,
      coverImageUrl: coverImageUrl,
      iconText: iconText,
      publishedAt: entity.publishedAt,
      updatedAt: entity.updatedAt,
    });

  }
}