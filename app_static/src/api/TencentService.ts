import Axios, { AxiosPromise } from "axios";
import { IResponse } from "../interface/model/IResponse";

export class TencentService {

    private static _instance: TencentService;

    private constructor() {
    }

    public getUserSig():AxiosPromise<IResponse<string>>{
        return Axios.get("/tencent/getSig");
    }

    public genPrivateMapKey(roomid:string):AxiosPromise<IResponse<string>>{
        return Axios.get("/tencent/genPrivateMapKey",{
            params:{
                roomid
            }
        });
    }

    static createInstance() {
        TencentService.getInstance();
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

}

export default TencentService;