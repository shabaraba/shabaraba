import { MyLinkLogic } from "../logic/MyLinkLogic";
import { MyLinkLogicNotionImpl } from "../logic/MyLinkLogicNotionImpl";
import { MyLinkDto } from "../objects/dtos/MyLinkDto";
import { MyLinkDxo } from "../objects/dxos/MyLinkDxo";
import { MyLinkEntity } from "../objects/entities/MyLinkEntity";

export class MyLinkService {
  private _mylinkLogic: MyLinkLogic;

  public constructor() {
    this._mylinkLogic = new MyLinkLogicNotionImpl();
  }

  public async getList(): Promise<MyLinkDto[]> {
    const list: MyLinkEntity[] = await this._mylinkLogic.getList();
    return list.map((mylink) => {
      return MyLinkDxo.convert(mylink);
    });
  }
}