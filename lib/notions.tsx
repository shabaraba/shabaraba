import { Client } from "@notionhq/client"
import type {
  QueryDatabaseResponse,
  ListBlockChildrenResponse,
} from '@notionhq/client/build/src/api-endpoints.d'

import type {
  NotionPostHead,
  NotionTag,
  NotionIcon,
} from '../entities/notion_entities';

import * as NotionBlock from '../entities/notion/blocks';
import * as NotionBlockInterfaces from '../interfaces/NotionApiResponses';

export default class Notion {
  private _notion: Client;
  private _token: string;
  private _databaseId: string;

  constructor(token: string, databaseId: string) {
    this._token = token;
    this._databaseId = databaseId;

    this._notion = new Client({
      auth: this._token
    });
  }

  public async getPostList() {
    const response: QueryDatabaseResponse = await this._notion.databases.query({
      database_id: this._databaseId,
      filter: {
        and: [{
          property: 'Published',
          checkbox: { equals: true }
        }],
      },
      sorts: [
        {
            "timestamp": "created_time",
            "direction":"descending"
        }
      ]
    });
    const postList: NotionPostHead[] = response.results.map((item: any) => {
      let properties = item.properties;
      let title: string = properties.Name.title[0]?.plain_text;
      let tags: NotionTag[] = properties.Tags.multi_select;
      let slug: string|null = properties.Slug.rich_text[0]?.plain_text ?? null;
      // if (slug === null) {
      //   slug = item.id;
      // }
      let icon: NotionIcon = item.icon;
      return {
        id: item.id,
        title: title,
        tags: tags,
        slug: slug,
        icon: icon,
        createdAt: properties.Created?.created_time,
        updatedAt: properties.Updated?.last_edited_time,
      }
    });

    return postList;
  }

  public async getPostBlockListById(id: string) {
    const response: ListBlockChildrenResponse = await this._notion.blocks.children.list({
      block_id: id
    });
    return response;
  }

  public async getPostIdBySlug(slug: string) {
    const response: QueryDatabaseResponse = await this._notion.databases.query({
      database_id: this._databaseId,
      filter: {
        and: [{
          property: 'Slug',
          text: { equals: slug }
        },
        {
          property: 'Published',
          checkbox: { equals: true }
        }]
      }
    });
    console.log(response)
    return response.results[0]?.id;
  }

  static createBlockList(response: ListBlockChildrenResponse) {
    let blocks: Array<NotionBlock.Block> = [];
    response.results.map((item: any) => {
      let itemType = item.type;
      switch (itemType) {
        case 'paragraph':
          let paragraph: NotionBlockInterfaces.IParagraphBlock = item;
          blocks.push(new NotionBlock.Paragraph(paragraph));
          break;
        case 'heading_1':
          let heading1: NotionBlockInterfaces.IHeading1Block = item;
          blocks.push(new NotionBlock.Heading1(heading1));
          break;
        case 'heading_2':
          let heading2: NotionBlockInterfaces.IHeading2Block = item;
          blocks.push(new NotionBlock.Heading2(heading2));
          break;
        case 'heading_3':
          let heading3: NotionBlockInterfaces.IHeading3Block = item;
          blocks.push(new NotionBlock.Heading3(heading3));
          break;
        case 'callout':
          let callout: NotionBlockInterfaces.ICalloutBlock = item;
          blocks.push(new NotionBlock.Callout(callout));
          break;
        case 'code':
          let code: NotionBlockInterfaces.ICodeBlock = item;
          blocks.push(new NotionBlock.Code(code));
          break;
        case 'image':
          let image: NotionBlockInterfaces.IImageBlock = item;
          blocks.push(new NotionBlock.Image(image));
          break;
        default:
          break;
      }
    })
    return blocks;
  }
}

