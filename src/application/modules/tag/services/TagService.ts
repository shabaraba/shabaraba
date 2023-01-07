import { IPageHead, IPageTag } from "application/modules/post/objects/entities/types/NotionPageApiResponses";
import { TagLogic } from "../logic/TagLogic";

export class TagService {
  private _tagLogic: TagLogic;

  public constructor() {
    // this._tagLogic = new TagLogicNotionImpl();
  } 

  public getListByPost(post: IPageHead): IPageTag[] {
    return post.tags;
  }
}
