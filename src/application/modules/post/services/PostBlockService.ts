import { PostLogic } from "../logic/PostLogic";
import { PostLogicNotionImpl } from "../logic/PostLogicNotionImpl";
import { BlockDto } from "../objects/dtos/BlockDto";
import { BlockDxo } from "../objects/dxos/BlockDxo";
import { Image } from "../objects/entities/blocks/Image";

export class PostBlockService {
  private _postLogic: PostLogic;

  public constructor() {
    this._postLogic = new PostLogicNotionImpl();
  } 

  /**
   * 指定したblockを返します
   * @param id 
   * @returns 
   */
  public async getImageBlock(id: string): Promise<BlockDto> {
    const block = await this._postLogic.getBlock(id);
    return block instanceof Image ? BlockDxo.convertToDto(block) : null;
  }
}