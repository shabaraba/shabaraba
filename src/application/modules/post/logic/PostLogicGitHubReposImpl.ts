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
    return await this._repository.getPageHeadBySlug(slug);
  }

  async getDetail(id: string): Promise<PostDetailEntity> {
    console.log(id);
    const slug = id;
    const postHeadDto = await this.getHeadBySlug(slug);
    const resp = await this._repository.getPostByTitle(postHeadDto.title);
    // const blockList: BlockList = BlockList.deserialize(resp.results);
    return new PostDetailEntity(blockList);
  }

  async getBlock(id: string): Promise<Block> {
    const block: BlockType = await this._repository.getBlockById(id)
    // return BlockFactory.make({target: block});
  }
};
