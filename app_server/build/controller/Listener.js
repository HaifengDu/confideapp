"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import UserModel from "../model/User";
const Listener_1 = require("../model/Listener");
const Bluebird = require("bluebird");
const User_1 = require("../model/User");
const objectHelper_1 = require("../helper/objectHelper");
const MainLabel_1 = require("./MainLabel");
const edu = require("../../config/edu.json");
class ListenerService {
    constructor() {
        this.mainlabelService = MainLabel_1.default.getInstance();
    }
    create(user) {
        return Listener_1.default.create(user);
    }
    find(id) {
        return Listener_1.default.findById(id);
    }
    findByUserid(id) {
        return Listener_1.default.find({
            include: [{
                    model: User_1.default,
                    as: 'user',
                    where: { id: id }
                }]
        }).then(res => {
            if (!res.user) {
                Bluebird.reject({ message: "未查到对应的用户" });
                return;
            }
            if (res.maintitles) {
                const labelids = objectHelper_1.default.parseJSON(res.maintitles) || [];
                const labels = this.mainlabelService.findLabelByUser(labelids, res.id);
                objectHelper_1.default.merge(res, {
                    labels: labels
                });
            }
            if (res) {
                objectHelper_1.default.mergeChildToSource(res);
            }
            return Promise.resolve(res);
        });
    }
    delete(id) {
        return Listener_1.default.update({
            status: -1
        }, {
            where: {
                id: id
            }
        });
    }
    static createInstance() {
        ListenerService.getInstance();
    }
    static getInstance() {
        return this._instance || (this._instance = new this());
    }
}
exports.default = ListenerService;
