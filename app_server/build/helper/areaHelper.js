"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
// import * as areaConfig from "../config/area.json"
const data = require('../../config/area.json');
class AreaHelper {
    constructor() {
        this.analisyArea(data);
    }
    analisyArea(data) {
        Object.keys(data).forEach(item => {
            let tempData = data[item];
            if (_.isString(tempData)) {
                AreaHelper._arealist.push({
                    code: item,
                    name: tempData
                });
            }
            else {
                AreaHelper._arealist.push({
                    code: item,
                    name: tempData.name
                });
                if (tempData.child) {
                    this.analisyArea(tempData.child);
                }
            }
        });
    }
    getCode(name) {
        const current = AreaHelper._arealist.find(item => item.name.indexOf(name) > -1);
        return current ? current.code : "";
    }
    getName(code) {
        const current = AreaHelper._arealist.find(item => item.code === code);
        return current ? current.name : "";
    }
    static createInstance() {
        AreaHelper.getInstance();
    }
    static getInstance() {
        return this._instance || (this._instance = new this());
    }
}
AreaHelper._arealist = [];
exports.default = AreaHelper;
