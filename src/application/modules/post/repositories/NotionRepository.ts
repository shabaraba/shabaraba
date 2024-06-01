import { QueryDatabaseResponse, ListBlockChildrenResponse } from "@notionhq/client/build/src/api-endpoints";
import { BlockType, IRetrieveBlockChildrenResponse, IText } from "./types/NotionApiResponses";
import { IPageHead } from "./types/NotionPageApiResponses";
import { BaseNotionRepository } from "lib/BaseNotionRepository";
import { NotionPageResponseDxo } from "./NotionPageResponseDxo";

export default class NotionRepository extends BaseNotionRepository {

  public async getPostList(): Promise<IPageHead[]> {
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

    const postList: IPageHead[] = response.results.map((item: any) => {
      return NotionPageResponseDxo.convertToNotionPostHead(item)
    })

    return postList
  }

  public async getTitleBlock(id: string): Promise<IPageHead> {
    const response: any = await this._notion.pages.retrieve({
      page_id: id
    });
    return NotionPageResponseDxo.convertToNotionPostHead(response)
  }

  public async getPage(id: string): Promise<IPageHead> {
    const response: any = await this._notion.pages.retrieve({
      page_id: id
    });
    return NotionPageResponseDxo.convertToNotionPostHead(response)
  }

  public async getBlockById(id: string): Promise<BlockType> {
    const response: any = await this._notion.blocks.retrieve({
      block_id: id
    });

    const result: BlockType = response

    return result
  }

  public async getPostBlockListById(id: string): Promise<IRetrieveBlockChildrenResponse> {
    const response: ListBlockChildrenResponse = await this._notion.blocks.children.list({
      block_id: id
    });
    let blocks: IRetrieveBlockChildrenResponse = NotionRepository.createInterfaceList(response);

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
      let block = result as BlockType
      if (block.type === 'paragraph') {
        block.paragraph.text.forEach((textObject: IText) => {
          openingSentence += textObject.plain_text
        })
      }
      if (openingSentence.length >= 80) {
        break
      }
    }

    return openingSentence.substring(0, 80)
  }

  static createInterfaceList(response: ListBlockChildrenResponse): IRetrieveBlockChildrenResponse {
    let blocks: IRetrieveBlockChildrenResponse = {object: "list", results: []};
    response.results.map((item: BlockType) => {
      blocks.results.push(item)
    })
    return blocks
  }
}


