import { BlockType, IBookmarkBlock, IBulletedListItemBlock, ICalloutBlock, ICodeBlock, IEmbedBlock, IHeading1Block, IHeading2Block, IHeading3Block, INumberedListItemBlock, IParagraphBlock, IQuoteBlock, IImageBlock, IRetrieveBlockChildrenResponse } from "application/modules/post/objects/entities/types/NotionApiResponses";
import { IPageHead } from "application/modules/post/objects/entities/types/NotionPageApiResponses";
import { setOGPToBookmarkBlocks } from "application/modules/post/services/ogp";
import NotionRepository from "../repositories/NotionRepository";
import { PostLogic } from "./PostLogic";
import { BlockList } from "application/modules/post/objects/entities/blocks";
import { Embed } from "application/modules/post/objects/entities/blocks/Embed";
import { Bookmark } from "application/modules/post/objects/entities/blocks/Bookmark";
import { NumberedList, NumberedListItem } from "application/modules/post/objects/entities/blocks/NumberedList";
import { BulletedList, BulletedListItem } from "application/modules/post/objects/entities/blocks/BulletedList";
import { Quote } from "application/modules/post/objects/entities/blocks/Quote";
import { Callout } from "application/modules/post/objects/entities/blocks/Callout";
import { Image } from "application/modules/post/objects/entities/blocks/Image";
import { Code } from "application/modules/post/objects/entities/blocks/Code";
import { Heading3 } from "application/modules/post/objects/entities/blocks/Heading3";
import { Heading2 } from "application/modules/post/objects/entities/blocks/Heading2";
import { Heading1 } from "application/modules/post/objects/entities/blocks/Heading1";
import { Paragraph } from "application/modules/post/objects/entities/blocks/Paragraph";
import { PostDetailEntity } from "../objects/entities/PostDetailEntity";

export class PostLogicNotionImpl implements PostLogic {
  private readonly _repository: NotionRepository;

  constructor() {
    const _token: string = process.env.NOTION_TOKEN;
    const _databaseId: string = process.env.NOTION_BLOG_DATABASE;
    this._repository = new NotionRepository(_token, _databaseId);
  }

  async getList(): Promise<IPageHead[]> {
    return await this._repository.getPostList();
  }

  async getPathList(): Promise<string[]> {
    return (await this.getList()).map(post => post.slug);
  }

  async getHeadBySlug(slug: string): Promise<IPageHead> {
    const id = await this._repository.getPageIdBySlug(slug);
    return await this._repository.getPage(id);
  }

  async getDetail(id: string): Promise<PostDetailEntity> {
    const resp: IRetrieveBlockChildrenResponse = await this._repository.getPostBlockListById(id);
    const respWithOGP: IRetrieveBlockChildrenResponse = await setOGPToBookmarkBlocks(resp);
    const blockList: BlockList = this._deserialize(respWithOGP.results);
    return new PostDetailEntity(blockList);
  }

  private _deserialize(input: BlockType[], nest: number = 0): BlockList {
    let isInBulletedList: boolean = false
    let isInNumberedList: boolean = false

    let bulletedList = new BulletedList("id", nest)
    let numberedList = new NumberedList("id", nest)

    let blocks: BlockList = new BlockList()
    input.map((item: BlockType) => {

      if (isInBulletedList && item.type != 'bulleted_list_item') {
        isInBulletedList = false
        blocks.append(bulletedList)
        bulletedList = new BulletedList("id", nest)
      }
      if (isInNumberedList && item.type != 'numbered_list_item') {
        isInNumberedList = false
        blocks.append(numberedList)
        numberedList = new NumberedList("id", nest)
      }

      switch (item.type) {
        case 'paragraph':
          blocks.append(new Paragraph(item as IParagraphBlock));
          break;
        case 'heading_1':
          blocks.append(new Heading1(item as IHeading1Block));
          break;
        case 'heading_2':
          blocks.append(new Heading2(item as IHeading2Block));
          break;
        case 'heading_3':
          blocks.append(new Heading3(item as IHeading3Block));
          break;
        case 'callout':
          blocks.append(new Callout(item as ICalloutBlock));
          break;
        case 'code':
          blocks.append(new Code(item as ICodeBlock));
          break;
        case 'image':
          blocks.append(new Image(item as IImageBlock));
          break;
        case 'bookmark':
          blocks.append(new Bookmark(item as IBookmarkBlock));
          break;
        case 'bulleted_list_item':
          isInBulletedList = true
          bulletedList.appendItem(new BulletedListItem(item as IBulletedListItemBlock, nest))
          break;
        case 'numbered_list_item':
          isInNumberedList = true
          numberedList.appendItem(new NumberedListItem(item as INumberedListItemBlock, nest))
          break;
        case 'quote':
          blocks.append(new Quote(item as IQuoteBlock));
          break;
        case 'embed':
          blocks.append(new Embed(item as IEmbedBlock));
          break;
        // case 'table':
          // break;
        default:
          break;
      }
    })
    if (isInBulletedList) {
      isInBulletedList = false
      blocks.append(bulletedList)
    }
    if (isInNumberedList) {
      isInNumberedList = false
      blocks.append(numberedList)
    }

    return blocks;
  }
}