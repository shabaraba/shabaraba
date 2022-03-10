import { Client } from "@notionhq/client"

import type {
  QueryDatabaseResponse,
  ListBlockChildrenResponse,
} from '@notionhq/client/build/src/api-endpoints.d'

import axios from 'axios'
import { JSDOM } from "jsdom"

import * as NotionBlock from '../../entities/notion/blocks';
import * as NotionBlockInterfaces from '../../interfaces/NotionApiResponses';
import * as NotionPageType from '../../interfaces/NotionPageApiResponses';

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
            "timestamp": "created_time",
            "direction":"descending"
        }
      ]
    })
    console.log(JSON.stringify(response, null, ' '))

    const postList: NotionPageType.IPageHead[] = response.results.map((item: any) => {
      return this._convertPageResponseToNotionPostHead(item)
    })

    return postList
  }

  private _convertPageResponseToNotionPostHead(response: any): NotionPageType.IPageHead {
    const properties = response.properties
    const title: string = properties.Name.title[0]?.plain_text
    const tags: NotionPageType.IPageTag[] = properties.Tags.multi_select
    const slug: string|null = properties.Slug.rich_text[0]?.plain_text ?? null
    const icon: NotionPageType.IPageIcon = response.icon
    const cover: NotionPageType.IPageCover = response.cover

    return {
      id: response.id,
      title: title,
      tags: tags,
      slug: slug,
      icon: icon,
      cover: cover,
      createdAt: properties.Created?.created_time,
      updatedAt: properties.Updated?.last_edited_time,
    }
  }

  public async getTitleBlock(id: string): Promise<NotionPageType.IPageHead> {
    const response: any = await this._notion.pages.retrieve({
      page_id: id
    });
    return this._convertPageResponseToNotionPostHead(response)
  }

  public async getPostById(id: string): Promise<[NotionPageType.IPageHead, any]> {
    const response: any = await this._notion.pages.retrieve({
      page_id: id
    });
    return [this._convertPageResponseToNotionPostHead(response), response]
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

  static async setOGPToBookmarkBlocks(blockList: NotionBlockInterfaces.IRetrieveBlockChildrenResponse)
  : Promise<NotionBlockInterfaces.IRetrieveBlockChildrenResponse> {

    const blocks: NotionBlockInterfaces.IRetrieveBlockChildrenResponse = {object: "list", results: []};
    for (let item of blockList.results) {
      if (item.has_children === true) { 
        item[item.type].children = await this.setOGPToBookmarkBlocks(item[item.type].children)
      }
      if (item.type === 'bookmark') {
        let ogp:NotionBlockInterfaces.IOgp = await Notion.getOGP(item.bookmark.url)
        item.bookmark.ogp = ogp
      }
      blocks.results.push(item)
    }
    return blocks
  }

  static async getOGP(url: string): Promise<NotionBlockInterfaces.IOgp> {
    const response = await axios.get(url)
    const data = response.data
    const dom = new JSDOM(data)
    const metaList = dom.window.document.getElementsByTagName("meta");
    let ogp:NotionBlockInterfaces.IOgp = {siteUrl: url}
    Array.from(metaList).map((meta: HTMLMetaElement) => {
      let name = meta.getAttribute("name")
      if (typeof name == "string") {
        if (name.match("site_name")) ogp.siteTitle = meta.getAttribute("content")
        if (name.match("title")) ogp.pageTitle = meta.getAttribute("content")
        if (name.match("description")) ogp.pageDescription = meta.getAttribute("content")
        if (name.match("image")) ogp.thumbnailUrl = meta.getAttribute("content")
      }
      let property = meta.getAttribute("property"); // OGPが設定されるのはpropertyなのでこちらが優先
      if (property === "og:site_name") ogp.siteTitle = meta.getAttribute("content")
      if (property === "og:title") ogp.pageTitle = meta.getAttribute("content")
      if (property === "og:description") ogp.pageDescription = meta.getAttribute("content")
      if (property === "og:image") ogp.thumbnailUrl = meta.getAttribute("content")
    })
    return ogp
  }
}


