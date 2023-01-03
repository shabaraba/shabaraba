import { IPageHead, IPageTag } from "interfaces/NotionPageApiResponses";
import { TagLogic } from "../logic/TagLogic";
import { TagLogicNotionImpl } from "../logic/TagLogicNotionImpl";

export class TagService {
  private _tagLogic: TagLogic;

  public constructor() {
    this._tagLogic = new TagLogicNotionImpl();
  } 

  public getListByPost(post: IPageHead): IPageTag[] {
    return post.tags;
  }
}
