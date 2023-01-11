import { BlockDto } from './BlockDto';

export class PostDetailDto {
  public blockList: BlockDto[];

  constructor(blocks: BlockDto[]) {
    this.blockList = blocks;
  }
}