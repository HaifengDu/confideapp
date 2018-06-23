"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import UserModel from "../model/User";
const User_1 = require("../model/User");
const Bluebird = require("bluebird");
// import {Op} from "sequelize";
const weixinHelper_1 = require("../helper/weixinHelper");
const ERole_1 = require("../enum/ERole");
const areaHelper_1 = require("../helper/areaHelper");
class UserService {
    constructor() {
        this._areaHelper = areaHelper_1.default.getInstance();
    }
    bindUser(code) {
        return weixinHelper_1.default.getUserinfoByCode(code).then(res => {
            const userModel = {
                weixinid: res.openid,
                role: ERole_1.ERole.Pourouter,
                nickname: res.nickname,
                headimgurl: res.headimgurl,
                address: this._areaHelper.getCode(res.city),
                sex: res.sex
            };
            //查看是否绑定了微信
            return this.findByWeixin(userModel.weixinid).then(res => {
                if (res) {
                    return Bluebird.resolve(res);
                }
                return this.create(userModel);
            });
            // return this.create(userModel);
        });
    }
    create(user) {
        return User_1.default.create(user);
    }
    find(id) {
        return User_1.default.findById(id);
    }
    findByWeixin(weixinid) {
        if (!weixinid) {
            return Bluebird.reject({ message: "微信id不能为空" });
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
            return Promise.reject({ message: "微信id不能为空" });
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
