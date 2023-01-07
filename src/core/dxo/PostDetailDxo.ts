import { BlockList } from 'application/modules/post/objects/entities/blocks';
import { PostDetailDto } from 'application/modules/post/objects/dtos/PostDetailDto';
import { PostDetailEntity } from 'core/entities/PostDetailEntity';

export class PostDetailDxo {

  public static convertForPages(dto: PostDetailDto): any {
    return JSON.parse(JSON.stringify(dto));
    // return new PostDetailEntity(json.blockList);
  }
}