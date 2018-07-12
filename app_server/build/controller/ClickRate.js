"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MongoVisitRecord_1 = require("../model/mongo/MongoVisitRecord");
const MongoFavorite_1 = require("../model/mongo/MongoFavorite");
const User_1 = require("./User");
const objectHelper_1 = require("../helper/objectHelper");
const ErrorMsg_1 = require("../model/ErrorMsg");
class ClickRateService {
    constructor() {
        this.PAGE_SIZE = 20;
        this.userService = User_1.default.getInstance();
    }
    /**
     * 访问
     * @param pid
     * @param lid
     */
    recordClickRate(pid, lid) {
        return MongoVisitRecord_1.MongoVisitRecord.findOne({
            pid,
            lid
        }).then(res => {
            if (res) {
                return MongoVisitRecord_1.MongoVisitRecord.update({
                    pid,
                    lid
                }, {
                    ldate: new Date()
                });
            }
            return MongoVisitRecord_1.MongoVisitRecord.create({
                pid,
                lid,
                ldate: new Date()
            });
        });
    }
    /**
     * 收藏
     * @param pid
     * @param lid
     */
    addFavorite(pid, lid) {
        return MongoFavorite_1.MongoFavorite.findOne({
            pid,
            lid
        }).then(res => {
            if (res) {
                return MongoFavorite_1.MongoFavorite.update({
                    pid,
                    lid
                }, {
                    ldate: new Date()
                });
            }
            return MongoFavorite_1.MongoFavorite.create({
                pid,
                lid,
                ldate: new Date()
            });
        });
    }
    /**
     * 获取访问
     * @param lid
     */
    getVisitRecords(lid, page) {
        const tempPage = {
            start: 0,
            limit: this.PAGE_SIZE
        };
        if (page) {
            tempPage.start = page.start || 0;
            tempPage.limit = page.limit || 0;
        }
        const query = MongoVisitRecord_1.MongoVisitRecord.find({
            lid
        });
        return query.sort({
            ldate: -1
        }).skip(tempPage.start).limit(tempPage.limit).then(res => {
            const pids = res.map(item => item.pid);
            if (!pids.length) {
                return [];
            }
            return this.userService.findInIds(pids).then(data => {
                return data.map(item => {
                    const temp = objectHelper_1.default.serialize(item);
                    const current = res.find(item => item.pid === temp.id);
                    if (current) {
                        temp.clickdate = current.ldate ? new Date(current.ldate).format('yyyy-MM-dd hh:mm:ss') : '';
                        ;
                    }
                    return temp;
                });
            });
        });
    }
    /**
     * 获取点击
     * @param lid
     */
    getFavorites(lid, page) {
        const tempPage = {
            start: 0,
            limit: this.PAGE_SIZE
        };
        if (page) {
            tempPage.start = page.start || 0;
            tempPage.limit = page.limit || 0;
        }
        const query = MongoFavorite_1.MongoFavorite.find({
            lid
        });
        return query.sort({
            ldate: -1
        }).skip(tempPage.start).limit(tempPage.limit).then(res => {
            const pids = res.map(item => item.pid);
            if (!pids.length) {
                return [];
            }
            return this.userService.findInIds(pids).then(data => {
                return data.map(item => {
                    const temp = objectHelper_1.default.serialize(item);
                    const current = res.find(item => item.pid === temp.id);
                    if (current) {
                        temp.clickdate = current.ldate ? new Date(current.ldate).format('yyyy-MM-dd hh:mm:ss') : '';
                        ;
                    }
                    return temp;
                });
            });
        });
    }
    /**
     * 判断当前用户对应的点击用户是否关注过
     * @param userid
     * @param ids
     */
    getRecordInIds(userid, ids) {
        const maxlength = 100;
        if (!ids || !ids.length) {
            return Promise.resolve([]);
        }
        if (ids.length > maxlength) {
            return Promise.reject(new ErrorMsg_1.default(false, "用户数量过大"));
        }
        const where = {
            pid: {
                $in: ids
            },
            lid: userid
        };
        return MongoFavorite_1.MongoFavorite.find(where).then(res => {
            return ids.map(id => {
                return {
                    id: id,
                    record: !!res.find(item => item.pid === id) //找到表示关注过
                };
            });
        });
    }
    static createInstance() {
        ClickRateService.getInstance();
    }
    static getInstance() {
        return this._instance || (this._instance = new this());
    }
}
exports.default = ClickRateService;
