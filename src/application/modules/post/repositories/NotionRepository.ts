import { Container } from '@chakra-ui/react';
import { BaseNotionRepository } from './../../../../lib/BaseNotionRepository';
import type {
  QueryDatabaseResponse,
  ListBlockChildrenResponse,
} from '@notionhq/client/build/src/api-endpoints.d'

import * as NotionBlock from '../objects/entities/blocks';
import { Heading1 as Heading1Entity} from "../objects/entities/blocks/Heading1";
import * as NotionBlockInterfaces from '../objects/entities/interfaces/NotionApiResponses';
import * as NotionPageType from '../objects/entities/interfaces/NotionPageApiResponses';
import { NotionPageResponseDxo } from "./NotionPageResponseDxo";

export default class NotionRepository extends BaseNotionRepository {

  public async getPostList(): Promise<NotionPageType.IPageHead[]> {
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
            // "timestamp": "created_time",
            "property": "Published_Time",
            "direction":"descending"
        }
      ]
    })

    const postList: NotionPageType.IPageHead[] = response.results.map((item: any) => {
      return NotionPageResponseDxo.convertToNotionPostHead(item)
    })

    return postList
  }

  public async getTitleBlock(id: string): Promise<NotionPageType.IPageHead> {
    const response: any = await this._notion.pages.retrieve({
      page_id: id
    });
    return NotionPageResponseDxo.convertToNotionPostHead(response)
  }

  public async getPage(id: string): Promise<NotionPageType.IPageHead> {
    const response: any = await this._notion.pages.retrieve({
      page_id: id
    });
    return NotionPageResponseDxo.convertToNotionPostHead(response)
  }

  public async getBlockById(id: string): Promise<NotionBlockInterfaces.BlockType> {
    const response: any = await this._notion.blocks.retrieve({
      block_id: id
    });

    const result: NotionBlockInterfaces.BlockType = response

    return result
  }

  public async getPostBlockListById(id: string): Promise<NotionBlockInterfaces.IRetrieveBlockChildrenResponse> {
    const response: ListBlockChildrenResponse = await this._notion.blocks.children.list({
      block_id: id
    });
    let blocks: NotionBlockInterfaces.IRetrieveBlockChildrenResponse = NotionRepository.createInterfaceList(response);

    for(let block of blocks.results) {
      if (block.has_children === true) {
        block[block.type].children = await this.getPostBlockListById(block.id)
      }
    }
    return blocks
  }

  public async getPageIdBySlug(slug: string): Promise<string> {
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

  /// 冒頭80字を返す。存在しなかったらnullを返す
  public async getOpeningSentence(blockId: string): Promise<string> {
    let openingSentence = ''

    const resp = await this._notion.blocks.children.list({
      block_id: blockId,
    })

    for (let result of resp.results) {
      let block = result as NotionBlockInterfaces.BlockType
      if (block.type === 'paragraph') {
        block.paragraph.text.forEach((textObject: NotionBlockInterfaces.IText) => {
          openingSentence += textObject.plain_text
        })
      }
      if (openingSentence.length >= 80) {
        break
      }
    }

    return openingSentence.substring(0, 80)
  }

  static createInterfaceList(response: ListBlockChildrenResponse): NotionBlockInterfaces.IRetrieveBlockChildrenResponse {
    let blocks: NotionBlockInterfaces.IRetrieveBlockChildrenResponse = {object: "list", results: []};
    response.results.map((item: NotionBlockInterfaces.BlockType) => {
      blocks.results.push(item)
    })
    return blocks
  }

  static convertPageResponseToNotionHeading1Block(response: any): Heading1Entity {
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
    return new Heading1Entity(heading1);
  }
}


