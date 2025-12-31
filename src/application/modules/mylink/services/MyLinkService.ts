import { MyLinkLogic } from "../logic/MyLinkLogic";
import { MyLinkLogicNotionImpl } from "../logic/MyLinkLogicNotionImpl";
import { MyLinkDto } from "../objects/dtos/MyLinkDto";
import { MyLinkDxo } from "../objects/dxos/MyLinkDxo";
import { MyLinkEntity } from "../objects/entities/MyLinkEntity";
import { getOGP } from "./OGPService";

// バッチ処理のサイズ（同時リクエスト数を制限）
const BATCH_SIZE = 5;

export class MyLinkService {
  private _mylinkLogic: MyLinkLogic;

  public constructor() {
    this._mylinkLogic = new MyLinkLogicNotionImpl();
  }

  public async getList(): Promise<MyLinkDto[]> {
    const list: MyLinkEntity[] = await this._mylinkLogic.getList();
    const dtos: MyLinkDto[] = [];

    // バッチ処理で並列リクエスト数を制限
    for (let i = 0; i < list.length; i += BATCH_SIZE) {
      const batch = list.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.all(batch.map(async (v) => {
        v.ogp = await getOGP(v.url);
        return MyLinkDxo.convert(v);
      }));
      dtos.push(...batchResults);
    }

    return dtos;
  }
}