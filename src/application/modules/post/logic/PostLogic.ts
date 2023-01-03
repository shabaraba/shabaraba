import { IRetrieveBlockChildrenResponse } from "interfaces/NotionApiResponses";
import { IPageHead } from "interfaces/NotionPageApiResponses";

export interface PostLogic {
    getList(): Promise<IPageHead[]>;
    getPathList(): Promise<string[]>;
    getHeadBySlug(slug: string): Promise<IPageHead>;
    getDetail(id: string): Promise<IRetrieveBlockChildrenResponse>;

};