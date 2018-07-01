import { IListener } from "../interface/model/IListener";
import Axios, { AxiosResponse } from "axios";
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

    static createInstance() {
        ListenerService.getInstance();
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

}