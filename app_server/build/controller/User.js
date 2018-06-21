"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import UserModel from "../model/User";
const User_1 = require("../model/User");
const Bluebird = require("bluebird");
class UserService {
    constructor() {
    }
    create(user) {
        return User_1.default.create(user);
    }
    find(id) {
        return User_1.default.findById(id);
    }
    findByWeixin(weixinid) {
        if (!weixinid) {
            return Bluebird.reject("微信id不能为空");
        }
        return User_1.default.find({
            where: {
                weixinid: weixinid
            }
        });
    }
    delete(id) {
        return User_1.default.update({
            status: -1
        }, {
            where: {
                id: id
            }
        });
    }
    deleteByWeixin(weixinid) {
        if (!weixinid) {
            return Promise.reject("微信id不能为空");
        }
        return User_1.default.update({
            status: -1
        }, {
            where: {
                weixinid: weixinid
            }
        });
    }
    static createInstance() {
        UserService.getInstance();
    }
    static getInstance() {
        return this._instance || (this._instance = new this());
    }
}
exports.default = UserService;
