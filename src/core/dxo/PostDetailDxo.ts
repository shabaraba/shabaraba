import { PostDetailType } from './../types/PostDetailType';
import { PostDetailDto } from 'application/modules/post/objects/dtos/PostDetailDto';

export class PostDetailDxo {

  public static convertForPages(dto: PostDetailDto): PostDetailType {
    return JSON.parse(JSON.stringify(dto));
  }
}