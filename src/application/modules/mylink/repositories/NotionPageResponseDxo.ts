import { IPageIcon, IPageTag } from "core/types/NotionPageApiResponses";
import { MyLinkEntity } from "../objects/entities/MyLinkEntity";

type NotionPageResponseType = {
  properties: {
    Name: any;
    Tags: any;
    Url: any;
    Published_Time: any;
  };
  icon: IPageIcon;
  id: string;
};

export class NotionPageResponseDxo {

  /**
   * notionからのレスポンスからPageHeadエンティティにコンバートします
   * @param response 
   * @returns 
   */
  public static convert(response: NotionPageResponseType): MyLinkEntity {
    const properties = response?.properties;
    const title: string = properties.Name.title[0]?.plain_text ?? "undefined title";
    const tags: IPageTag[] = properties.Tags.multi_select;
    const url: string|null = properties.Url.url ?? null;

    return new MyLinkEntity({
      id: response.id,
      title: title,
      tags: tags,
      url: url,
      publishedAt: properties.Published_Time.created_time,
    })
  }

}