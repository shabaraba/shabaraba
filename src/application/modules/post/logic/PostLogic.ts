import { IPageHead } from "application/modules/post/objects/entities/interfaces/NotionPageApiResponses";
import { PostDetailEntity } from "../objects/entities/PostDetailEntity";

export interface PostLogic {
    getList(): Promise<IPageHead[]>;
    getPathList(): Promise<string[]>;
    getHeadBySlug(slug: string): Promise<IPageHead>;
    getDetail(id: string): Promise<PostDetailEntity>;
};