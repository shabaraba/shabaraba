import { QueryDatabaseResponse, ListBlockChildrenResponse, GetPageResponse, GetBlockResponse } from "@notionhq/client/build/src/api-endpoints";
import { BlockType, IRetrieveBlockChildrenResponse, IText, IPageResponse, IParagraphBlock } from "core/types/NotionApiResponses";
import { IPageHead } from "core/types/NotionPageApiResponses";
import { BaseNotionRepository } from "lib/BaseNotionRepository";
import { NotionPageResponseDxo, NotionPageResponseType } from "./NotionPageResponseDxo";

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
    });

    const postList: IPageHead[] = response.results.map((item) => {
      return NotionPageResponseDxo.convertToNotionPostHead(item as NotionPageResponseType);
    });

    return postList;
  }

  public async getTitleBlock(id: string): Promise<IPageHead> {
    const response: GetPageResponse = await this._notion.pages.retrieve({
      page_id: id
    });
    return NotionPageResponseDxo.convertToNotionPostHead(response as NotionPageResponseType);
  }

  public async getPage(id: string): Promise<IPageHead> {
    const response: GetPageResponse = await this._notion.pages.retrieve({
      page_id: id
    });
    return NotionPageResponseDxo.convertToNotionPostHead(response as NotionPageResponseType);
  }

  public async getBlockById(id: string): Promise<BlockType> {
    const response: GetBlockResponse = await this._notion.blocks.retrieve({
      block_id: id
    });

    return response as BlockType;
  }

  public async getPostBlockListById(id: string): Promise<IRetrieveBlockChildrenResponse> {
    const response: ListBlockChildrenResponse = await this._notion.blocks.children.list({
      block_id: id
    });
    const blocks: IRetrieveBlockChildrenResponse = NotionRepository.createInterfaceList(response);

    for (const block of blocks.results) {
      if (block.has_children === true) {
        block[block.type].children = await this.getPostBlockListById(block.id);
      }
    }
    return blocks;
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
    let openingSentence = '';

    const resp: ListBlockChildrenResponse = await this._notion.blocks.children.list({
      block_id: blockId,
    });

    for (let result of resp.results) {
      const block = result as BlockType;
      if (block.type === 'paragraph') {
        const paragraphBlock = block as unknown as IParagraphBlock;
        // Notionの新しいAPIではtextではなくrich_textを使用するようになった
        const textItems = paragraphBlock.paragraph.rich_text || paragraphBlock.paragraph.text || [];
        
        textItems.forEach((textObject: IText) => {
          openingSentence += textObject.plain_text;
        });
      }
      if (openingSentence.length >= 80) {
        break;
      }
    }

    return openingSentence.substring(0, 80);
  }

  static createInterfaceList(response: ListBlockChildrenResponse): IRetrieveBlockChildrenResponse {
    const blocks: IRetrieveBlockChildrenResponse = {object: "list", results: []};
    response.results.forEach((item) => {
      blocks.results.push(item as BlockType);
    });
    return blocks;
  }
}


