import { Block } from "application/modules/post/objects/entities/blocks/Block";

type Props = { blockList: Block[] };

export class PostDetailEntity {
  public blockList: Block[];

  constructor({ blockList }) {
    this.blockList = [];
    this.blockList = blockList;
  }
}