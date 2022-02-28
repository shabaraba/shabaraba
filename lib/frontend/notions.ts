import { Client } from "@notionhq/client"
import type {
  QueryDatabaseResponse,
  ListBlockChildrenResponse,
} from '@notionhq/client/build/src/api-endpoints.d'

import type {
  NotionPostHead,
  NotionTag,
  NotionIcon,
} from '../../entities/notion_entities';

import axios from 'axios'

import * as NotionBlock from '../../entities/notion/blocks';
import * as NotionBlockInterfaces from '../../interfaces/NotionApiResponses';

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
    })

    const postList: NotionPostHead[] = response.results.map((item: any) => {
      return this._convertPageResponseToNotionPostHead(item)
    })

    return postList
  }

  private _convertPageResponseToNotionPostHead(response: any): NotionPostHead {
    const properties = response.properties
    const title: string = properties.Name.title[0]?.plain_text
    const tags: NotionTag[] = properties.Tags.multi_select
    const slug: string|null = properties.Slug.rich_text[0]?.plain_text ?? null
    const icon: NotionIcon = response.icon

    return {
      id: response.id,
      title: title,
      tags: tags,
      slug: slug,
      icon: icon,
      createdAt: properties.Created?.created_time,
      updatedAt: properties.Updated?.last_edited_time,
    }
  }

  public async getTitleBlock(id: string): Promise<NotionPostHead> {
    const response: any = await this._notion.pages.retrieve({
      page_id: id
    });
    return this._convertPageResponseToNotionPostHead(response)
  }

  public async getPostById(id: string): Promise<[NotionPostHead, any]> {
    const response: any = await this._notion.pages.retrieve({
      page_id: id
    });
    return [this._convertPageResponseToNotionPostHead(response), response]
  }

  public async getPostBlockListById(id: string): Promise<NotionBlockInterfaces.IRetrieveBlockChildrenResponse> {
    const response: ListBlockChildrenResponse = await this._notion.blocks.children.list({
      block_id: id
    });
    let blocks: NotionBlockInterfaces.IRetrieveBlockChildrenResponse = Notion.createInterfaceList(response);

    for(let block of blocks.results) {
      if (block.has_children === true) {
        block[block.type].children = await this.getPostBlockListById(block.id)
      }
    }
    return blocks
  }

  public async getPostIdBySlug(slug: string): Promise<string> {
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
    return response.results[0]?.id;
  }

  static createInterfaceList(response: ListBlockChildrenResponse): NotionBlockInterfaces.IRetrieveBlockChildrenResponse {
    let blocks: NotionBlockInterfaces.IRetrieveBlockChildrenResponse = {object: "list", results: []};
    response.results.map((item: NotionBlockInterfaces.BlockType) => {
      blocks.results.push(item)
    })
    return blocks
  }

  static convertPageResponseToNotionHeading1Block(response: any): NotionBlock.Heading1 {
    let heading1: NotionBlockInterfaces.IHeading1Block = {
      object: 'block',
      id: response.id,
      created_time: response.created_time,
      last_edited_time: response.last_edited_time,
      has_children: false,
      archived: response.archived,
      type: "heading_1",
      heading_1: {
        text: response.properties.Name.title,
      }
    }
    return new NotionBlock.Heading1(heading1)
  }
}

