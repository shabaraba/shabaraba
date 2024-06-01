import { PostLogic } from "../logic/PostLogic";
import { PostLogicGitHubReposImpl } from "../logic/PostLogicGitHubReposImpl";
import { PostLogicNotionImpl } from "../logic/PostLogicNotionImpl";
import { PostHeadDto } from "../objects/dtos/PostHeadDto";

export class PostHeadService {
  private _postLogic: PostLogic;
  private _postLogicTmp: PostLogic;

  public constructor() {
    this._postLogicTmp = new PostLogicNotionImpl();
    this._postLogic = new PostLogicGitHubReposImpl();
  }

  public async getBySlug(id: string): Promise<PostHeadDto> {
    return await this._postLogicTmp.getHeadBySlug(id);
  }

  public async getList(): Promise<PostHeadDto[]> {
    return await this._postLogic.getList();
  }

  public async getPathParams(): Promise<{ params: { id: string } }[]> {
    const pathList = await this._postLogicTmp.getPathList();
    return pathList.map(path => {
      return { params: { id: path } };
    });
  }

}
