"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import UserModel from "../model/User";
const MainLabel_1 = require("../model/MainLabel");
const Bluebird = require("bluebird");
const ELabelStatus_1 = require("../enum/ELabelStatus");
const ELabelType_1 = require("../enum/ELabelType");
const objectHelper_1 = require("../helper/objectHelper");
class MainLabelService {
    constructor() {
        this._labelList = [];
        this._expList = [];
        this.initMainLabel();
    }
    findLabel(ids) {
        return this._labelList.filter(item => item.status === ELabelStatus_1.ELabelStatus.正常 && ids.indexOf(item.id) > 1) || [];
    }
    findExprience(ids) {
        return this._expList.filter(item => item.status === ELabelStatus_1.ELabelStatus.正常 && ids.indexOf(item.id) > 1) || [];
    }
    addLabel(model) {
        if (!model) {
            return Bluebird.reject({ message: "标签不能为空" });
        }
        MainLabel_1.default.create(model).then(res => {
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
        MainLabel_1.default.update(model, {
            where: {
                id: model.id
            }
        });
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
