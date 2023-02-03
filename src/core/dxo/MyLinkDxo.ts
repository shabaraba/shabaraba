import { MyLinkDto } from "application/modules/mylink/objects/dtos/MyLinkDto";
import { MyLinkType } from "core/types/MyLinkType";

export class MyLinkDxo {

  public static convertForPages(dto: MyLinkDto): MyLinkType {
    return {
      id: dto.id,
      title: dto.title,
      tags: dto.tags,
      url: dto.url,
    };
  }
}