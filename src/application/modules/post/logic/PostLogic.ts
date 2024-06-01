import { PostHeadDto } from "../objects/dtos/PostHeadDto";
import { Block } from "../objects/entities/blocks/Block";
import { PostDetailEntity } from "../objects/entities/PostDetailEntity";

export interface PostLogic {
    getList(): Promise<PostHeadDto[]>;
    getPathList(): Promise<string[]>;
    getHeadBySlug(slug: string): Promise<PostHeadDto>;
    getDetail(id: string): Promise<PostDetailEntity>;
    getBlock(id: string): Promise<Block>;
};
