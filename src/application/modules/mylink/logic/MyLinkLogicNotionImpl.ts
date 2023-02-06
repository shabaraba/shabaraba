import { MyLinkEntity } from "../objects/entities/MyLinkEntity";
import NotionRepository from "../repositories/NotionRepository";
import { MyLinkLogic } from "./MyLinkLogic";

export class MyLinkLogicNotionImpl implements MyLinkLogic {
  private readonly _repository: NotionRepository;

  constructor() {
    const _token: string = process.env.NOTION_TOKEN;
    const _databaseId: string = process.env.NOTION_MYLINK_DATABASE;
    this._repository = new NotionRepository(_token, _databaseId);
  }

  async getList(): Promise<MyLinkEntity[]> {
    return await this._repository.getPostList();
  }

}