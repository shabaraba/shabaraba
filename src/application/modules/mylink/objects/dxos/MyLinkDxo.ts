import { MyLinkDto } from "../dtos/MyLinkDto";
import { MyLinkEntity } from "../entities/MyLinkEntity";

export class MyLinkDxo {
  public static convert(entity: MyLinkEntity): MyLinkDto {
    return new MyLinkDto({
      id: entity.id,
      title: entity.title,
      url: entity.url,
      tags: entity.tags,
      ogp: entity.ogp.thumbnailUrl,
    });
  }
}