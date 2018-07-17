import { IListener} from "../interface/model/IListener";
import { IListenLabel } from "../interface/model/IMainLabel";
import { IPriceSetting} from "../interface/model/IPriceSetting";
import Axios, { AxiosResponse } from "axios";
import ErrorMsg from "../model/ErrorMsg";
import { IResponse } from "../interface/model/IResponse";
import {EGeneralStatus} from "../enum/EGeneralStatus";

export default class ListenerService {

    private static _instance: ListenerService;

    private constructor() {
    }

    applyListener(data:IListener,files:Blob[]):Promise<AxiosResponse<IResponse<string>>>{
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
        const formData = new FormData();
        Array.prototype.slice.call(files).forEach((item:any)=>{
            formData.append("files",item);
        }); 
        formData.append("data",JSON.stringify(data));
        return Axios.post("/listener",formData,config);
    }

    updateLabels(labels:Array<IListenLabel>):Promise<AxiosResponse<IResponse<any>>>{
        if(!labels){
            return Promise.reject(new ErrorMsg(false,"参数不正确"));
        }
        let data = JSON.stringify(labels);
        return Axios.post("/listener/updateLabels",{labels:data});
    }

    /**
     * 获取倾听者文字及通话服务价格设置信息
     * @param params 
     */
    getPrice(params:IPriceSetting):Promise<AxiosResponse<IResponse<any>>>{
        if(!params){
            return Promise.reject(new ErrorMsg(false,"参数不正确"));
        }
        return Axios.get("/listener/price",{params:params});
    }

    /**
     * 更新倾听者文字及通话服务价格设置信息
     * @param params 
     */
    updatePrice(prices:any):Promise<AxiosResponse<IResponse<any>>>{
        if(!prices){
            return Promise.reject(new ErrorMsg(false,"参数不正确"));
        }
        return Axios.post("/listener/setprice",prices);
    }

    /**
     * 设置倾听者接单状态
     * @param params 
     */
    setReceiveStatus(status:any):Promise<AxiosResponse<IResponse<any>>>{
        if(!status){
            return Promise.reject(new ErrorMsg(false,"参数不正确"));
        }
        return Axios.post("/listener/setrecievestatus",status);
    }

    public updateExp(id:number,desc:string):Promise<AxiosResponse<IResponse<any>>>{
        if(!id){
            return Promise.reject(new ErrorMsg(false,"参数不正确"));
        }
        return Axios.post("/listener/updateExp",{
            exp:JSON.stringify({id,desc})
        });
    }

    public uploadcert(files:any):Promise<AxiosResponse<IResponse<any>>>{
        if(!files){
            return Promise.reject(new ErrorMsg(false,"参数不正确"));
        }
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
        const formData = new FormData();
        Array.prototype.slice.call(files).forEach((item:any)=>{
            formData.append("files",item);
        }); 
        return Axios.post("/listener/uploadcert",formData,config);
    }

    /**
     * 获取推广单价相关数据
     */
    getGeneralsetting():Promise<AxiosResponse<IResponse<any>>>{
        return Axios.get("/listener/generalsetting");
    }

    /**
     * 设置推广配置
     * @param params 
     */
    setGeneralsetting(params:any):Promise<AxiosResponse<IResponse<any>>>{
        if(!params){
            return Promise.reject(new ErrorMsg(false,"参数不正确"));
        }
        return Axios.post("/listener/generalsetting",{data:JSON.stringify(params)});
    }

    /**
     * 设置推广状态
     * @param params 
     */
    setGeneralstatus(status:EGeneralStatus):Promise<AxiosResponse<IResponse<any>>>{
        if(!status){
            return Promise.reject(new ErrorMsg(false,"参数不正确"));
        }
        return Axios.post("/listener/setgeneralstatus",{status:status});
    }

    static createInstance() {
        ListenerService.getInstance();
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

}