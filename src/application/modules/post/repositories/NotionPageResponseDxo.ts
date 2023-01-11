import { IPageIcon, IPageCover, IPageHead, IPageTag } from "core/types/NotionPageApiResponses";

type NotionPageResponseType = {
  properties: {
    Name: any;
    Tags: any;
    Slug: any;
    Published_Time: any;
    Updated: any;
  };
  icon: IPageIcon;
  cover: IPageCover;
  id: string;
};

export class NotionPageResponseDxo {

  /**
   * notionからのレスポンスからPageHeadエンティティにコンバートします
   * @param response 
   * @returns 
   */
  public static convertToNotionPostHead(response: NotionPageResponseType): IPageHead {
    const properties = response?.properties
    const title: string = properties.Name.title[0]?.plain_text
    const tags: IPageTag[] = properties.Tags.multi_select
    const slug: string|null = properties.Slug.rich_text[0]?.plain_text ?? null
    const icon: IPageIcon = response.icon
    const cover: IPageCover = response.cover

    return {
      id: response.id,
      title: title,
      tags: tags,
      slug: slug,
      icon: icon,
      cover: cover,
      publishedAt: properties.Published_Time.date.start,
      updatedAt: properties.Updated?.last_edited_time,
    }
  }

}