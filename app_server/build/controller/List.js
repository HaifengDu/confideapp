"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MongoSortFilterModel_1 = require("../model/mongo/MongoSortFilterModel");
const Bluebird = require("bluebird");
const moment = require("moment");
const ErrorMsg_1 = require("../model/ErrorMsg");
const Listener_1 = require("./Listener");
const ERecieveStatus_1 = require("../enum/ERecieveStatus");
const objectHelper_1 = require("../helper/objectHelper");
const _ = require("lodash");
const util_1 = require("../helper/util");
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
        const whereOption = {};
        if (filter.labelid) {
            whereOption.labelids = filter.labelid;
        }
        ["edu", "auth", "sex", "family"].forEach(item => {
            if (filter[item]) {
                whereOption[item] = filter[item];
            }
        });
        if (filter.price) {
            const price = objectHelper_1.default.parseJSON(filter.price);
            if (price) {
                if (price.min && _.isNumber(price.min)) {
                    whereOption.generalprice = whereOption.generalprice || {};
                    whereOption.generalprice["$gte"] = price.min;
                }
                if (price.max && _.isNumber(price.max)) {
                    whereOption.generalprice = whereOption.generalprice || {};
                    whereOption.generalprice["$lte"] = price.max;
                }
            }
        }
        if (filter.age) {
            if (filter.age[0]) {
                const min = moment(new Date).subtract(filter.age[0], "year").toDate();
                whereOption.birthday = whereOption.birthday || {};
                whereOption.birthday["$lte"] = min;
            }
            if (filter.age[1]) {
                const max = moment(new Date).subtract(filter.age[1], "year").toDate();
                whereOption.birthday = whereOption.birthday || {};
                whereOption.birthday["$gte"] = max;
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
            const userids = res.map(item => item.uid);
            return this.listenerService.findInUserids(userids).then(listeners => {
                const arr = util_1.sortByArray(listeners, userids, (listener, userid) => {
                    return listener.uid === userid;
                });
                return [...arr, ...arr, ...arr, ...arr, ...arr, ...arr, ...arr, ...arr];
            });
        });
    }
    getListNotinIds(uids, count) {
        return MongoSortFilterModel_1.default.find({
            uid: {
                $nin: uids
            }
        }).sort({
            praisepercent: -1, sealtimes: -1
        }).limit(count);
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
