import { Block } from "application/modules/post/objects/entities/blocks/Block";
import { BlockList } from "../../application/modules/post/objects/entities/blocks";

type Props = { blockList: Block[] };

export class PostDetailEntity {
  public blockList: Block[];

  constructor({ blockList }) {
    this.blockList = blockList;
  }
}