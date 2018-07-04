"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MongoSortFilterModel_1 = require("../model/mongo/MongoSortFilterModel");
const Bluebird = require("bluebird");
const moment = require("moment");
const ErrorMsg_1 = require("../model/ErrorMsg");
const Listener_1 = require("./Listener");
const ERecieveStatus_1 = require("../enum/ERecieveStatus");
class ListService {
    constructor() {
        this.pageSize = 20;
        this.listenerService = Listener_1.default.getInstance();
    }
    /**
     * getList
     */
    getList(filter) {
        //
        if (!filter) {
            return Bluebird.reject(new ErrorMsg_1.default(false, "筛选参数不能为空！"));
        }
        if (!filter.labelid) {
            return Bluebird.reject(new ErrorMsg_1.default(false, "标签id不能为空！"));
        }
        const whereOption = {
            labelids: filter.labelid
        };
        ["edu", "auth", "sex", "family"].forEach(item => {
            if (filter[item]) {
                whereOption[item] = filter[item];
            }
        });
        if (filter.minprice) {
            whereOption.generalprice = {
                '$gte': filter.minprice
            };
        }
        if (filter.maxprice) {
            whereOption.generalprice = {
                '$lte': filter.minprice
            };
        }
        if (filter.age) {
            whereOption.birthday = {};
            if (filter.age[0] && typeof filter.age[0] === "number") {
                const min = moment(new Date).subtract(filter.age[0], "year").toDate();
                whereOption.birthday["$gte"] = min;
            }
            if (filter.age[1] && typeof filter.age[1] === "number") {
                const max = moment(new Date).subtract(filter.age[1], "year").toDate();
                whereOption.birthday["$lt"] = max;
            }
        }
        whereOption.receivestatus = ERecieveStatus_1.ERecieveStatus.可接单;
        let query = MongoSortFilterModel_1.default.find(whereOption);
        if (filter.sort) {
            query = query.sort({ [filter.sort]: -1 });
        }
        else {
            query = query.sort({ praisepercent: -1, sealtimes: -1 });
        }
        const start = filter.start || 0;
        let pageSize = filter.page;
        if (!pageSize || typeof pageSize !== 'number') {
            pageSize = this.pageSize;
        }
        return query.skip(start).limit(pageSize).then(res => {
            return this.listenerService.findInUserids(res.map(item => item.uid));
        });
    }
    getSearch(name, page) {
        return this.listenerService.findByName(name, page);
    }
    static createInstance() {
        ListService.getInstance();
    }
    static getInstance() {
        return this._instance || (this._instance = new this());
    }
}
exports.default = ListService;
