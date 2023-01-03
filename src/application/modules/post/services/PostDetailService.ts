import { IRetrieveBlockChildrenResponse } from "interfaces/NotionApiResponses";
import { IPageHead } from "interfaces/NotionPageApiResponses";
import { PostLogic } from "../logic/PostLogic";
import { PostLogicNotionImpl } from "../logic/PostLogicNotionImpl";

export class PostDetailService {
  private _postLogic: PostLogic;

  public constructor() {
    this._postLogic = new PostLogicNotionImpl();
  } 

  public async get(id: string): Promise<IRetrieveBlockChildrenResponse> {
    return await this._postLogic.getDetail(id);
  }
}