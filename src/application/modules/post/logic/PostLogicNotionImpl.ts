import { setOGPToBookmarkBlocks } from "application/modules/post/services/ogp";
import NotionRepository from "../repositories/NotionRepository";
import { PostLogic } from "./PostLogic";
import { BlockList } from "application/modules/post/objects/entities/blocks";
import { PostDetailEntity } from "../objects/entities/PostDetailEntity";
import { Block } from "../objects/entities/blocks/Block";
import { BlockFactory } from "../objects/factories/BlockFactory";
import { PostHeadDto } from "application/modules/post/objects/dtos/PostHeadDto";
import { IPageHeadDxo } from "../objects/dxos/IPageHeadDxo";

export class PostLogicNotionImpl implements PostLogic {
  private readonly _repository: NotionRepository;

  constructor() {
    const _token: string = process.env.NOTION_TOKEN;
    const _databaseId: string = process.env.NOTION_BLOG_DATABASE;
    this._repository = new NotionRepository(_token, _databaseId);
  }

  async getList(): Promise<PostHeadDto[]> {
    const pageHeadList = await this._repository.getPostList();
    return pageHeadList.map(pageHead => IPageHeadDxo.convertToDto(pageHead));
  }

  async getPathList(): Promise<string[]> {
    return (await this.getList()).map(post => post.slug);
  }

  async getHeadBySlug(slug: string): Promise<PostHeadDto> {
    const id = await this._repository.getPageIdBySlug(slug);
    const pageHead = await this._repository.getPage(id);
    return IPageHeadDxo.convertToDto(pageHead);
  }

  async getDetail(id: string): Promise<PostDetailEntity> {
    const resp = await this._repository.getPostBlockListById(id);
    const respWithOGP = await setOGPToBookmarkBlocks(resp);
    const blockList: BlockList = BlockList.deserialize(respWithOGP.results);
    return new PostDetailEntity(blockList);
  }

  async getBlock(id: string): Promise<Block> {
    const block = await this._repository.getBlockById(id)
    return BlockFactory.make({target: block});
  }

}
