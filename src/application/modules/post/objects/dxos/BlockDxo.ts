import { BlockDto } from "../dtos/BlockDto";
import { PostDetailDto } from "../dtos/PostDetailDto";
import { Block } from "../entities/blocks/Block";
import { List, ListItem } from "../entities/blocks/List";
import { Paragraph } from "../entities/blocks/Paragraph";

export class BlockDxo {
  public static convertToDto(entity: Block): BlockDto {
    const copyEntity = JSON.parse(JSON.stringify(entity));
    const id = copyEntity.id;
    const type = copyEntity.type;
    const nest = copyEntity.nest;
    delete copyEntity.id;
    delete copyEntity.type;
    delete copyEntity.nest;

    if (entity instanceof Paragraph) {
      const childrenContent = entity.children.map(child => BlockDxo.convertToDto(child));
      copyEntity.children = childrenContent;
    }
    if (entity instanceof List) {
      const itemContent = entity.listItem.map((item: ListItem) => BlockDxo.convertToDto(item));
      copyEntity.listItem = itemContent;
    }
    return new BlockDto({
      id: id,
      type: type,
      nest: nest,
      content: copyEntity
    });
  }

}