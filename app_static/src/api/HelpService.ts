import Axios, { AxiosPromise } from "axios";
import IHelp from "../interface/model/IHelp";
import IResponse from "../interface/model/IResponse";
import ErrorMsg from "../model/ErrorMsg";
import { regTest } from "../helper/RegexHelper";

export class HelpService {

    private static _instance: HelpService;

    private constructor() {
    }

    public create(model:IHelp):AxiosPromise<IResponse<IHelp>>{
        if(!model){
            return Promise.reject(new ErrorMsg(false,"求助不能为空"));
        }
        if(regTest('intege1',model.money as string)){
            return Promise.reject(new ErrorMsg(false,"金额设置非法"));
        }
        if(regTest('intege1',model.labelid as string)){
            return Promise.reject(new ErrorMsg(false,"话题类别设置非法"));
        }
        if(!model.content){
            return Promise.reject(new ErrorMsg(false,"求助内容不能为空"));
        }
        if(model.content.length>2000){
            return Promise.reject(new ErrorMsg(false,"请求内容过长"));
        }
        return Axios.put("/help",model);
    }

    static createInstance() {
        HelpService.getInstance();
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

}
export default HelpService;