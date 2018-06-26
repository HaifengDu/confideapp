"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EBaseDataType_1 = require("../enum/EBaseDataType");
const baseDataHelper_1 = require("../helper/baseDataHelper");
const areaHelper_1 = require("../helper/areaHelper");
class BaseDataService {
    constructor() {
        this.baseDataHelper = baseDataHelper_1.default.getInstance();
        this.areaHelper = areaHelper_1.default.getInstance();
    }
    getBaseData(type, id) {
        let result = null;
        switch (type) {
            case EBaseDataType_1.EBaseDataType.Area:
                if (typeof id !== "undefined") {
                    result = this.areaHelper.getNode(id.toString());
                }
                else {
                    result = this.baseDataHelper.getArea();
                }
                break;
            case EBaseDataType_1.EBaseDataType.Job:
                result = this.baseDataHelper.getJob(id);
                break;
            case EBaseDataType_1.EBaseDataType.Edu:
                result = this.baseDataHelper.getEdu(id);
                break;
            case EBaseDataType_1.EBaseDataType.Family:
                result = this.baseDataHelper.getFamily(id);
                break;
        }
        return result;
    }
    static createInstance() {
        BaseDataService.getInstance();
    }
    static getInstance() {
        return this._instance || (this._instance = new this());
    }
}
exports.default = BaseDataService;
