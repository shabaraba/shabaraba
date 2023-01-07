import { PostDetailDto } from "../dtos/PostDetailDto";
import { PostDetailEntity } from "../entities/PostDetailEntity";

export class PostDetailDxo {
  public static convertToDto(entity: PostDetailEntity): PostDetailDto {
    return new PostDetailDto(entity.blockList.data);
  }
}