import { PostLogic } from "../logic/PostLogic";
import { PostLogicNotionImpl } from "../logic/PostLogicNotionImpl";
import { PostDetailDto } from "../objects/dtos/PostDetailDto";
import { PostDetailDxo } from "../objects/dxos/PostDetailDxo";

export class PostDetailService {
  private _postLogic: PostLogic;

  public constructor() {
    this._postLogic = new PostLogicNotionImpl();
  } 

  public async get(id: string): Promise<PostDetailDto> {
    const postDetailEntity = await this._postLogic.getDetail(id);
    return PostDetailDxo.convertToDto(postDetailEntity);
  }
}