"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import UserModel from "../model/User";
const User_1 = require("../model/User");
const Bluebird = require("bluebird");
// import {Op} from "sequelize";
const weixinHelper_1 = require("../helper/weixinHelper");
const ERole_1 = require("../enum/ERole");
const areaHelper_1 = require("../helper/areaHelper");
const ErrorMsg_1 = require("../model/ErrorMsg");
const mailHelper_1 = require("../helper/mailHelper");
const EBindPhoneStatus_1 = require("../enum/EBindPhoneStatus");
class UserService {
    constructor() {
        this._mailHelper = mailHelper_1.default.getInstance();
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
    update(user, transtion) {
        if (!user.id) {
            return Bluebird.reject(new ErrorMsg_1.default(false, "用户id不能为空"));
        }
        const id = user.id;
        delete user.id;
        let options = {
            where: {
                id
            }
        };
        if (transtion) {
            options.transaction = transtion;
        }
        return User_1.default.update(user, options);
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
    findByPhone(phone) {
        return User_1.default.find({
            where: {
                phone: phone
            }
        });
    }
    getCheckCode(phone) {
        return this.findByPhone(phone).then(res => {
            if (res) {
                return Bluebird.reject(new ErrorMsg_1.default(false, "当前手机号已经绑定账号"));
            }
            return this._mailHelper.getCode(phone);
        });
    }
    bindPhoneCode(source, checkModel, userid) {
        const result = this._mailHelper.checkCode(source, checkModel);
        if (!result.success) {
            return Bluebird.reject(result);
        }
        return this.findByPhone(checkModel.phone).then(res => {
            if (res) {
                return Bluebird.reject(new ErrorMsg_1.default(false, "当前手机号已经绑定账号"));
            }
            return this.update({
                phone: checkModel.phone,
                phonebindstatus: EBindPhoneStatus_1.EBindPhoneStatus.已绑定,
                id: userid
            });
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
