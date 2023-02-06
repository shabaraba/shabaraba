import { MyLinkLogic } from "../logic/MyLinkLogic";
import { MyLinkLogicNotionImpl } from "../logic/MyLinkLogicNotionImpl";
import { MyLinkDto } from "../objects/dtos/MyLinkDto";
import { MyLinkDxo } from "../objects/dxos/MyLinkDxo";
import { MyLinkEntity } from "../objects/entities/MyLinkEntity";
import { getOGP } from "./OGPService";

export class MyLinkService {
  private _mylinkLogic: MyLinkLogic;

  public constructor() {
    this._mylinkLogic = new MyLinkLogicNotionImpl();
  }

  public async getList(): Promise<MyLinkDto[]> {
    const list: MyLinkEntity[] = await this._mylinkLogic.getList();
    const dtos: MyLinkDto[] = await Promise.all(list.map(async (v) => {
      v.ogp = await getOGP(v.url);
      return MyLinkDxo.convert(v);
    }));
    return dtos;
  }
}