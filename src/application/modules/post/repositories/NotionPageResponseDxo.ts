import { IPageIcon, IPageCover, IPageHead, IPageTag } from "core/types/NotionPageApiResponses";
import { 
  IPageResponse, 
  ITitlePropertyValue, 
  IMultiSelectPropertyValue, 
  IRichTextPropertyValue,
  IDatePropertyValue,
  ILastEditedTimePropertyValue,
  ICheckboxPropertyValue,
  ISelectPropertyValue
} from "core/types/NotionApiResponses";

export type NotionPageResponseType = Partial<IPageResponse> & {
  properties: {
    Name: ITitlePropertyValue;
    Tags: IMultiSelectPropertyValue;
    Slug: IRichTextPropertyValue;
    Published_Time: IDatePropertyValue;
    Updated?: ILastEditedTimePropertyValue;
    Trend?: ICheckboxPropertyValue;
    Series?: ISelectPropertyValue;
    [key: string]: any; // その他のプロパティにも対応
  };
  icon?: IPageIcon;
  cover?: IPageCover;
  id: string;
};

export class NotionPageResponseDxo {

  /**
   * notionからのレスポンスからPageHeadエンティティにコンバートします
   * @param response 
   * @returns 
   */
  public static convertToNotionPostHead(response: NotionPageResponseType): IPageHead {
    const properties = response?.properties;
    
    console.log('Converting page response:', response.id, properties);
    
    // 必須プロパティの安全な取得
    const title: string = properties.Name.title[0]?.plain_text || 'Untitled';
    
    // タグ情報の安全な取得と変換
    const tags: IPageTag[] = properties.Tags.multi_select.map(tag => ({
      id: parseInt(tag.id, 10) || 0,
      name: tag.name,
      color: tag.color
    }));
    
    // スラッグの安全な取得
    const slug: string|null = properties.Slug.rich_text[0]?.plain_text ?? null;
    
    // オプショナルなプロパティの安全な取得
    const icon: IPageIcon | undefined = response.icon;
    const cover: IPageCover | undefined = response.cover;
    
    // 日付関連の安全な取得
    const publishedAt: string = properties.Published_Time.date?.start || new Date().toISOString();
    const updatedAt: string | undefined = properties.Updated?.last_edited_time;
    
    // Trendプロパティの安全な取得
    const trend: boolean = properties.Trend?.checkbox || false;
    console.log('Trend property for', title, ':', properties.Trend);
    
    // Seriesプロパティの安全な取得
    const series: string | null = properties.Series?.select?.name || null;
    console.log('Series property for', title, ':', properties.Series);

    const result = {
      id: response.id,
      title,
      tags,
      slug,
      ...(icon && { icon }),
      ...(cover && { cover }),
      publishedAt,
      updatedAt,
      trend,
      ...(series && { series }),
    };
    
    console.log('Converted page:', result);
    
    return result;
  }

}