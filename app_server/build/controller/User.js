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
const Sequelize = require("sequelize");
const mailHelper_1 = require("../helper/mailHelper");
const EBindPhoneStatus_1 = require("../enum/EBindPhoneStatus");
const objectHelper_1 = require("../helper/objectHelper");
const MongoSyncBiz_1 = require("../biz/MongoSyncBiz");
class UserService {
    constructor(listenerService) {
        this.listenerService = listenerService;
        this._mailHelper = mailHelper_1.default.getInstance();
        this._areaHelper = areaHelper_1.default.getInstance();
        this.mongoSyncbiz = MongoSyncBiz_1.default.getInstance();
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
            return this.findUserByWxid(userModel.weixinid).then((user) => {
                if (user) {
                    return Bluebird.resolve(user);
                }
                return this.create(userModel);
            });
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
        return User_1.default.update(user, options).then(res => {
            if (res[0] > 0) {
                user.id = id;
                return this.mongoSyncbiz.updateByUser(user);
            }
            return res;
        });
    }
    create(user) {
        return User_1.default.create(user);
    }
    find(id) {
        return User_1.default.findById(id);
    }
    findInIds(ids) {
        return User_1.default.findAll({
            where: {
                id: {
                    [Sequelize.Op.in]: ids
                }
            }
        });
    }
    findUserByWxid(weixinid) {
        return User_1.default.find({
            where: {
                weixinid: weixinid
            }
        }).then(user => {
            if (user && user.role === ERole_1.ERole.Listener) {
                if (this.listenerService) {
                    return this.listenerService.findByUserid(user.id).then(listener => {
                        const userTemp = objectHelper_1.default.serialize(user);
                        userTemp.listener = objectHelper_1.default.serialize(listener);
                        userTemp.pricesettings = userTemp.listener.user.pricesettings;
                        delete userTemp.listener.user;
                        return userTemp;
                    });
                }
            }
            return user;
        });
    }
    findByWeixin(weixinid) {
        if (!weixinid) {
            return Bluebird.reject({ message: "微信id不能为空" });
        }
        return this.findUserByWxid(weixinid).then(user => {
            if (!user) {
                return Bluebird.reject(new ErrorMsg_1.default(false, "未找到对应用户"));
            }
            return user;
        });
    }
    /**
     * findByUserid 根据用户id查找
     */
    findByUserid(userid) {
        if (!userid) {
            return Bluebird.reject({ message: "用户id不能为空" });
        }
        return User_1.default.find({
            where: {
                id: userid
            }
        }).then(user => {
            if (!user) {
                return Bluebird.reject(new ErrorMsg_1.default(false, "未找到对应用户"));
            }
            if (user.role === ERole_1.ERole.Listener && this.listenerService) {
                return this.listenerService.findByUserid(user.id).then(listener => {
                    const userTemp = objectHelper_1.default.serialize(user);
                    userTemp.listener = objectHelper_1.default.serialize(listener);
                    userTemp.pricesettings = userTemp.listener.user.pricesettings;
                    delete userTemp.listener.user;
                    return userTemp;
                });
            }
            return user;
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
    static createInstance(listenerService) {
        UserService.getInstance(listenerService);
    }
    static getInstance(listenerService) {
        return this._instance || (this._instance = new this(listenerService));
    }
}
exports.default = UserService;
