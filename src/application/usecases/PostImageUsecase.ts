import { PostBlockService } from './../modules/post/services/PostBlockService';
import { ImageType } from '../../core/types/PostBlockType';

export class PostImageUsecase {
  public static async getInPost(imageId: string): Promise<ImageType|null> {
    const postBlockService = new PostBlockService();
    const block = await postBlockService.getImageBlock(imageId);
    return block.type === 'Image' ? block.content as ImageType : null;
  }
}