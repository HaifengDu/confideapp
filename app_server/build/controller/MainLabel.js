"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import UserModel from "../model/User";
const MainLabel_1 = require("../model/MainLabel");
const Bluebird = require("bluebird");
const ELabelStatus_1 = require("../enum/ELabelStatus");
const ELabelType_1 = require("../enum/ELabelType");
class MainLabelService {
    constructor() {
        this._list = [];
        this.initMainLabel();
    }
    findLabel(ids) {
        return this._list.filter(item => item.status === ELabelStatus_1.ELabelStatus.正常 && ids.indexOf(item.id) > 1);
    }
    findLabelByUser(ids, listenerid) {
        return this.findLabel(ids).filter(item => item.type === ELabelType_1.ELabelType.Admin || item.cuid === listenerid);
    }
    addLabel(model) {
        if (!model) {
            return Bluebird.reject({ message: "标签不能为空" });
        }
        MainLabel_1.default.create(model).then(res => {
            this._list.push(model);
        });
    }
    initMainLabel() {
        MainLabel_1.default.findAll().then(res => {
            this._list = JSON.parse(JSON.stringify(res));
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
