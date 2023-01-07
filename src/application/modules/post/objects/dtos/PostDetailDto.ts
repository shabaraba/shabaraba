import { Block } from "../entities/blocks/Block";

export class PostDetailDto {
  public blockList: Block[];

  constructor(blocks: Block[]) {
    this.blockList = blocks;
  }
}