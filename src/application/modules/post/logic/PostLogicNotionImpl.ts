import { IRetrieveBlockChildrenResponse } from "interfaces/NotionApiResponses";
import { IPageHead } from "interfaces/NotionPageApiResponses";
import { setOGPToBookmarkBlocks } from "lib/backend/ogp";
import NotionRepository from "../repositories/NotionRepository";
import { PostLogic } from "./PostLogic";

export class PostLogicNotionImpl implements PostLogic {
  private readonly _repository: NotionRepository;

  constructor() {
    const _token: string = process.env.NOTION_TOKEN;
    const _databaseId: string = process.env.NOTION_BLOG_DATABASE;
    this._repository = new NotionRepository(_token, _databaseId);
  }

  async getList(): Promise<IPageHead[]> {
    return await this._repository.getPostList();
  }

  async getPathList(): Promise<string[]> {
    return (await this.getList()).map(post => post.slug);
  }

  async getHeadBySlug(slug: string): Promise<IPageHead> {
    const id = await this._repository.getPageIdBySlug(slug);
    return await this._repository.getPage(id);
  }

  async getDetail(id: string): Promise<IRetrieveBlockChildrenResponse> {
    const blocks = await this._repository.getPostBlockListById(id);
    return await setOGPToBookmarkBlocks(blocks)
  }

}