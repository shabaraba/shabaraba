import { IPageHead } from "core/types/NotionPageApiResponses";
import { PostDetailEntity } from "../objects/entities/PostDetailEntity";

export interface PostLogic {
    getList(): Promise<IPageHead[]>;
    getPathList(): Promise<string[]>;
    getHeadBySlug(slug: string): Promise<IPageHead>;
    getDetail(id: string): Promise<PostDetailEntity>;
};