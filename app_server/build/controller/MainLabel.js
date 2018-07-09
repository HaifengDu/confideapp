"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import UserModel from "../model/User";
const MainLabel_1 = require("../model/MainLabel");
const Bluebird = require("bluebird");
const ELabelStatus_1 = require("../enum/ELabelStatus");
const ELabelType_1 = require("../enum/ELabelType");
const objectHelper_1 = require("../helper/objectHelper");
const _ = require("lodash");
const ErrorMsg_1 = require("../model/ErrorMsg");
class MainLabelService {
    constructor() {
        this._labelList = [];
        this._expList = [];
        this.initMainLabel();
    }
    findSystemLabel() {
        return this._labelList.filter(item => item.ctype === ELabelType_1.ELabelCType.Admin && item.status === ELabelStatus_1.ELabelStatus.正常) || [];
    }
    findLabelNoStatus(ids) {
        return this._labelList.filter(item => ids.indexOf(item.id) > -1) || [];
    }
    findLabel(ids) {
        return this._labelList.filter(item => item.status === ELabelStatus_1.ELabelStatus.正常 && ids.indexOf(item.id) > -1) || [];
    }
    findSystemLabelUnionUser(uid) {
        return this._labelList.filter(item => (item.ctype === ELabelType_1.ELabelCType.Admin || item.cuid === uid) && item.status === ELabelStatus_1.ELabelStatus.正常) || [];
    }
    /**
     * 查找自己的标签（包含审核中）
     * @param ids
     */
    findLabelByMyself(ids) {
        return this._labelList.filter(item => (item.status === ELabelStatus_1.ELabelStatus.正常 || item.status === ELabelStatus_1.ELabelStatus.审核中) && ids.indexOf(item.id) > -1) || [];
    }
    /**
     * 查找自己的经历（包含审核中）
     * @param ids
     */
    findExprienceNoStatus(ids) {
        return this._expList.filter(item => ids.indexOf(item.id) > -1) || [];
    }
    /**
     * 查找系统和包含用户自定义的标签
     * @param uid
     */
    findExprienceUnionUser(uid) {
        return this._expList.filter(item => (item.ctype === ELabelType_1.ELabelCType.Admin || item.cuid === uid) && item.status === ELabelStatus_1.ELabelStatus.正常) || [];
    }
    findExprience(ids) {
        return this._expList.filter(item => item.status === ELabelStatus_1.ELabelStatus.正常 && ids.indexOf(item.id) > -1) || [];
    }
    addLabel(model) {
        if (!model) {
            return Bluebird.reject({ message: "标签不能为空" });
        }
        return MainLabel_1.default.create(model).then(res => {
            let tempModel = objectHelper_1.default.serialize(res);
            if (tempModel) {
                if (model.stype === ELabelType_1.ELabelSType.Experience) {
                    this._expList.push(tempModel);
                }
                else {
                    this._labelList.push(tempModel);
                }
            }
            return Promise.resolve(res);
        });
    }
    update(model) {
        const promise = MainLabel_1.default.update(model, {
            where: {
                id: model.id
            }
        });
        promise.then(res => {
            let current;
            if (model.stype === ELabelType_1.ELabelSType.Label) {
                current = this._labelList.find(item => item.id === model.id);
            }
            else {
                current = this._expList.find(item => item.id === model.id);
            }
            if (current) {
                _.extend(current, model);
            }
        });
        ;
        return promise;
    }
    deleteLabel(id, stype) {
        let current;
        if (stype === ELabelType_1.ELabelSType.Label) {
            current = this._labelList.find(item => item.id === id);
        }
        else {
            current = this._expList.find(item => item.id === id);
        }
        if (!current) {
            return Bluebird.reject(new ErrorMsg_1.default(false, "未找到对应标签"));
        }
        let promise = Bluebird.resolve(current);
        //自定义状态删除
        if (current.ctype === ELabelType_1.ELabelCType.Custom) {
            promise = MainLabel_1.default.destroy({
                where: {
                    id: id
                }
            }).then(res => {
                let current;
                if (stype === ELabelType_1.ELabelSType.Label) {
                    current = _.remove(this._labelList, item => item.id === id)[0];
                }
                else {
                    current = _.remove(this._expList, item => item.id === id)[0];
                }
                return current;
            });
        }
        return promise;
    }
    initMainLabel() {
        MainLabel_1.default.findAll().then(res => {
            const list = JSON.parse(JSON.stringify(res)) || [];
            this._labelList = list.filter(item => item.stype === ELabelType_1.ELabelSType.Label);
            this._expList = list.filter(item => item.stype === ELabelType_1.ELabelSType.Experience);
        });
    }
    static createInstance() {
        MainLabelService.getInstance();
    }
    static getInstance() {
        return this._instance || (this._instance = new this());
    }
}
exports.default = MainLabelService;
MainLabelService.createInstance();
