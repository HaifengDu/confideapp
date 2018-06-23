"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ESex_1 = require("../enum/ESex");
const ErrorMsg_1 = require("../model/ErrorMsg");
const objectHelper_1 = require("../helper/objectHelper");
const _ = require("lodash");
class ListenerBiz {
    constructor() {
    }
    checkSimpleData(obj, props) {
        for (let i = 0; i < props.length; i++) {
            let current = props[i];
            if (!obj[current.prop]) {
                return new ErrorMsg_1.default(false, `${current.key}不能为空`);
            }
            if (_.isNumber(obj[current.prop])) {
                return new ErrorMsg_1.default(false, `${current.key}数据格式不正确`);
            }
        }
        return new ErrorMsg_1.default(true);
    }
    checkBindListenerModel(listener) {
        if (!listener) {
            return { success: false, message: "参数不能为空" };
        }
        if (!listener.user) {
            return { success: false, message: "用户基本信息不能为空" };
        }
        const user = listener.user;
        if (!user.nickname) {
            return { success: false, message: "用户的昵称不能为空" };
        }
        if (user.nickname.length > 100) {
            return { success: false, message: "用户昵称太长" };
        }
        if (!user.sex) {
            return { success: false, message: "用户性别不能为空" };
        }
        if (!(user.sex in ESex_1.ESex)) {
            return { success: false, message: "用户性别不正确" };
        }
        if (!user.resume) {
            return { success: false, message: "用户简介不能为空" };
        }
        if (user.resume.length > 8000) {
            return { success: false, message: "用户简介最多8000字" };
        }
        const simpleResult = this.checkSimpleData(listener, [{
                prop: "job",
                key: "职位"
            }, {
                prop: "family",
                key: "家庭情况"
            }, {
                prop: "edu",
                key: "教育水平"
            }]);
        if (!simpleResult.success) {
            return simpleResult;
        }
        if (!listener.labelids) {
            return new ErrorMsg_1.default(false, "擅长话题不能为空");
        }
        const labelids = objectHelper_1.default.parseJSON(listener.labelids);
        if (!labelids || !(_.isArray(labelids)) || !labelids.length) {
            return new ErrorMsg_1.default(false, "擅长话题不能为空");
        }
        return new ErrorMsg_1.default(true);
    }
    static createInstance() {
        ListenerBiz.getInstance();
    }
    static getInstance() {
        return this._instance || (this._instance = new this());
    }
}
exports.default = ListenerBiz;
