import { IListener} from "../interface/model/IListener";
import { IListenLabel } from "../interface/model/IMainLabel";
import Axios, { AxiosResponse } from "axios";
import ErrorMsg from "../model/ErrorMsg";
import { IResponse } from "../interface/model/IResponse";

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

    static createInstance() {
        ListenerService.getInstance();
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

}