/// <reference path="../node_modules/@types/mongoose/index.d.ts" />
/// <reference types="mongoose" />
import { IListener } from "../interface/model/IListener";
import IUser from "../interface/model/IUser";
import ErrorMsg from "../model/ErrorMsg";
export default class MongoSyncBiz {
    private static _instance;
    private constructor();
    create(res: IListener): Promise<import("../interface/mongomodel/IMongoSortFilterModel").IMongoSortFilterModel>;
    updateByUser(user: IUser): import("mongoose").Query<any> | Promise<ErrorMsg>;
    updateByListener(listener: IListener): import("mongoose").Query<any> | Promise<ErrorMsg>;
    static createInstance(): void;
    static getInstance(): MongoSyncBiz;
}
//# sourceMappingURL=MongoSyncBiz.d.ts.map