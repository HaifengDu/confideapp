import { EBaseDataType } from "../enum/EBaseDataType";
import BaseDataHelper from "../helper/baseDataHelper";
import AreaHelper from "../helper/areaHelper";
import _ = require("lodash");

const area = require("../../config/area.json");
const edu = require("../../config/edu.json");
const family = require("../../config/family.json");
const job = require("../../config/job.json");

export default class BaseDataService {

    private static _instance: BaseDataService;

    private baseDataHelper:BaseDataHelper;
    private areaHelper:AreaHelper;

    private constructor() {
        this.baseDataHelper = BaseDataHelper.getInstance();
        this.areaHelper = AreaHelper.getInstance();
    }

    public getBaseData(type:EBaseDataType,id?:number|string){
        let result = null;
        switch(type){
            case EBaseDataType.Area:
                if(typeof id!=="undefined"){
                    result = this.areaHelper.getNode(id.toString());
                }else{
                    result = this.baseDataHelper.getArea();
                }
            break;
            case EBaseDataType.Job:
                result = this.baseDataHelper.getJob(<number>id);
            break;
            case EBaseDataType.Edu:
                result = this.baseDataHelper.getEdu(<number>id);
            break;
            case EBaseDataType.Family:
                result = this.baseDataHelper.getFamily(<number>id);
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