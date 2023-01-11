import { PostDetailDto } from "../dtos/PostDetailDto";
import { PostDetailEntity } from "../entities/PostDetailEntity";
import { BlockDxo } from "./BlockDxo";

export class PostDetailDxo {
  public static convertToDto(entity: PostDetailEntity): PostDetailDto {
    // console.log('dxo')
    // entity.blockList.data.map(data => {
    //   console.log(BlockDxo.convertToDto(data));
    // });
    return new PostDetailDto(entity.blockList.data.map(data => BlockDxo.convertToDto(data)));
  }
}