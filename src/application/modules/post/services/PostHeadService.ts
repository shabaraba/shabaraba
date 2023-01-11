import { PostLogic } from "../logic/PostLogic";
import { PostLogicNotionImpl } from "../logic/PostLogicNotionImpl";
import { PostHeadDto } from "../objects/dtos/PostHeadDto";
import { IPageHeadDxo } from "../objects/dxos/IPageHeadDxo";

export class PostHeadService {
  private _postLogic: PostLogic;

  public constructor() {
    this._postLogic = new PostLogicNotionImpl();
  }

  public async getBySlug(id: string): Promise<PostHeadDto> {
    const postHead = await this._postLogic.getHeadBySlug(id);
    return IPageHeadDxo.convertToDto(postHead);
  }

  public async getList(): Promise<PostHeadDto[]> {
    const postHeadList = await this._postLogic.getList();
    return postHeadList.map((postHead) => {
      return IPageHeadDxo.convertToDto(postHead);
    });
  }

  public async getPathParams(): Promise<{ params: { id: string } }[]> {
    const pathList = await this._postLogic.getPathList();
    return pathList.map(path => {
      return { params: { id: path } };
    });
  }

}