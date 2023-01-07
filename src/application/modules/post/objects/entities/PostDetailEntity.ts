import { BlockList } from "./blocks";


export class PostDetailEntity {
  public blockList: BlockList;

  constructor(blockList: BlockList) {
    this.blockList = blockList;
  }
}