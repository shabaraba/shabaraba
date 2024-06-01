import { Block } from "../objects/entities/blocks/Block";
import { PostDetailEntity } from "../objects/entities/PostDetailEntity";
import { PostLogic } from "./PostLogic";
import GitHubRepository from "../repositories/GitHubRepository";
import { PostHeadDto } from "../objects/dtos/PostHeadDto";

export class PostLogicGitHubReposImpl implements PostLogic {
  private readonly _repository: GitHubRepository;

  constructor() {
    const _token: string = process.env.NOTION_TOKEN;
    const _databaseId: string = process.env.NOTION_BLOG_DATABASE;
    this._repository = new GitHubRepository();
  }

  async getList(): Promise<PostHeadDto[]> {
    return await this._repository.getPostList();
  }

  async getPathList(): Promise<string[]> {
    return (await this.getList()).map(post => post.slug);
  }

  async getHeadBySlug(slug: string): Promise<PostHeadDto> {
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
};
