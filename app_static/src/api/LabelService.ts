import Axios, { AxiosResponse } from "axios";
import { IMainLabel } from "../interface/model/IMainLabel";
import { IResponse } from "../interface/model/IResponse";
import ErrorMsg from "../model/ErrorMsg";
import { ELabelSType } from "../enum/ELabelType";

export default class LabelService {

    private static _instance: LabelService;

    private constructor() {
    }

    public getSystemLabel():Promise<AxiosResponse<{success:boolean,data:IMainLabel[]}>>{
        return Axios.get("/base/label");
    }

    public addLabel(data:IMainLabel):Promise<AxiosResponse<IResponse<IMainLabel>>>{
        if(!data){
            return Promise.reject(new ErrorMsg(false,"数据不能为空"));
        }
        data.stype = ELabelSType.Label;
        return Axios.put("/base/label",data);
    }

    public updateLabel(id:number,name:string):Promise<AxiosResponse<IResponse<String>>>{
        if(!id||!name){
            return Promise.reject(new ErrorMsg(false,"参数不正确"));
        }
        return Axios.post("/base/label",{
            id,
            name
        });
    }

    static createInstance() {
        LabelService.getInstance();
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

}