import { MyLinkEntity } from "../objects/entities/MyLinkEntity";

export interface MyLinkLogic {
    getList(): Promise<MyLinkEntity[]>;
};