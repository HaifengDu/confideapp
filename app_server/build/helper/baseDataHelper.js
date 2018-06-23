"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const areaHelper_1 = require("./areaHelper");
const edu = require("../../config/edu.json");
const family = require("../../config/family.json");
const job = require("../../config/job.json");
class BaseDataHelper {
    constructor() {
        this.areaHelper = areaHelper_1.default.getInstance();
    }
    getArea() {
        return this.areaHelper.getArea();
    }
    getTreeNode(root, id) {
        let result = null;
        for (let i = 0, length = root.length; i < length; i++) {
            if (root[i].id === id) {
                result = root[i];
                break;
            }
            if (root[i].children && root[i].children.length) {
                result = this.getTreeNode(root[i].children, id);
                if (result) {
                    break;
                }
            }
        }
        return result;
    }
    getJob(id) {
        if (typeof id !== 'undefined') {
            return this.getTreeNode(job, id);
        }
        return job;
    }
    getFamily(id) {
        if (typeof id !== 'undefined') {
            return family.find(item => item.id === id);
        }
        return family;
    }
    getEdu(id) {
        if (typeof id !== 'undefined') {
            return edu.find(item => item.id === id);
        }
        return edu;
    }
    static createInstance() {
        BaseDataHelper.getInstance();
    }
    static getInstance() {
        return this._instance || (this._instance = new this());
    }
}
exports.default = BaseDataHelper;
