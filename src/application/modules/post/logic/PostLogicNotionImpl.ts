import { setOGPToBookmarkBlocks } from "application/modules/post/services/ogp";
import NotionRepository from "../repositories/NotionRepository";
import { PostLogic } from "./PostLogic";
import { BlockList } from "application/modules/post/objects/entities/blocks";
import { PostDetailEntity } from "../objects/entities/PostDetailEntity";
import { BlockType, IRetrieveBlockChildrenResponse } from "core/types/NotionApiResponses";
import { IPageHead } from "core/types/NotionPageApiResponses";
import { Block } from "../objects/entities/blocks/Block";
import { BlockFactory } from "../objects/factories/BlockFactory";

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

  async getTrendingPosts(): Promise<IPageHead[]> {
    return await this._repository.getTrendingPosts();
  }

  async getPathList(): Promise<string[]> {
    return (await this.getList()).map(post => post.slug);
  }

  async getHeadBySlug(slug: string): Promise<IPageHead> {
    const id = await this._repository.getPageIdBySlug(slug);
    return await this._repository.getPage(id);
  }

  async getDetail(id: string): Promise<PostDetailEntity> {
    const resp: IRetrieveBlockChildrenResponse = await this._repository.getPostBlockListById(id);
    const respWithOGP: IRetrieveBlockChildrenResponse = await setOGPToBookmarkBlocks(resp);
    const blockList: BlockList = BlockList.deserialize(respWithOGP.results);
    return new PostDetailEntity(blockList);
  }

  async getBlock(id: string): Promise<Block> {
    const block: BlockType = await this._repository.getBlockById(id)
    return BlockFactory.make({target: block});
  }

}