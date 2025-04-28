import { IPageHead } from "core/types/NotionPageApiResponses";
import { Block } from "../objects/entities/blocks/Block";
import { PostDetailEntity } from "../objects/entities/PostDetailEntity";

export interface PostLogic {
    getList(): Promise<IPageHead[]>;
    getTrendingPosts(): Promise<IPageHead[]>;
    getPathList(): Promise<string[]>;
    getHeadBySlug(slug: string): Promise<IPageHead>;
    getDetail(id: string): Promise<PostDetailEntity>;
    getBlock(id: string): Promise<Block>;
};