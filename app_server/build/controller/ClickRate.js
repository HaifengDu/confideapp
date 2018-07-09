"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MongoVisitRecord_1 = require("../model/mongo/MongoVisitRecord");
const MongoFavorite_1 = require("../model/mongo/MongoFavorite");
const User_1 = require("./User");
const objectHelper_1 = require("../helper/objectHelper");
class ClickRateService {
    constructor() {
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
    getVisitRecords(lid) {
        const query = MongoVisitRecord_1.MongoVisitRecord.find({
            lid
        });
        return query.sort({
            ldate: -1
        }).then(res => {
            const pids = res.map(item => item.pid);
            if (!pids.length) {
                return [];
            }
            return this.userService.findInIds(pids).then(data => {
                return data.map(item => {
                    const temp = objectHelper_1.default.serialize(item);
                    const current = res.find(item => item.pid === temp.id);
                    if (current) {
                        temp.clickdate = current.ldate;
                    }
                });
            });
        });
    }
    /**
     * 获取点击
     * @param lid
     */
    getFavorites(lid) {
        const query = MongoFavorite_1.MongoFavorite.find({
            lid
        });
        return query.sort({
            ldate: -1
        }).then(res => {
            const pids = res.map(item => item.pid);
            if (!pids.length) {
                return [];
            }
            return this.userService.findInIds(pids).then(data => {
                return data.map(item => {
                    const temp = objectHelper_1.default.serialize(item);
                    const current = res.find(item => item.pid === temp.id);
                    if (current) {
                        temp.clickdate = current.ldate;
                    }
                });
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
