import { PostLogicNotionImpl } from './../logic/PostLogicNotionImpl';
import { IPageHead } from "interfaces/NotionPageApiResponses";
import NotionRepository from "../repositories/NotionRepository";
import { PostLogic } from '../logic/PostLogic';
import { IHeading1Block } from 'interfaces/NotionApiResponses';

export class PostHeadService {
  private _postLogic: PostLogic;

  public constructor() {
    this._postLogic = new PostLogicNotionImpl();
  }

  public async getBySlug(id: string): Promise<IPageHead> {
    return await this._postLogic.getHeadBySlug(id);
  }

  public async getList(): Promise<IPageHead[]> {
    return await this._postLogic.getList();
  }

  public async getPathParams(): Promise<{ params: { id: string } }[]> {
    const pathList = await this._postLogic.getPathList();
    return pathList.map(path => {
      return { params: { id: path } };
    });
  }

}