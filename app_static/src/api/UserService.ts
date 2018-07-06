import Axios, { AxiosPromise } from "axios";
import { EBaseDataType } from "../enum/EBaseDataType";
import ErrorMsg from "../model/ErrorMsg";

export default class MyService {
    private static _instance: MyService;

    /**
    * getUserInfo
    */
    public getUserInfo(code: string): AxiosPromise<any> {
      return Axios.put("user", { code });
    }

    /**
    * getUserInfobyWXid
    weixinid:string
    */
    public getUserInfobyWXid(weixinid: string): AxiosPromise<any> {
      return Axios.get("user", {
        params: { weixinid }
      });
    }
    /**
    * 获取验证码
    */
    public getCode(phone:string):AxiosPromise<any>{
      return Axios.get("/user/getCheckCode", { params: { phone } });
    }
    /**
    * 绑定手机号
    */
    public bindPhone(code:string,phone:string):AxiosPromise<any>{
      return Axios.post("/user/bindphone",  { code,phone });
    }
    /**
    * 获取经历
    */
    public getBase(type: EBaseDataType): AxiosPromise<any> {
      return Axios.get("base", {
        params: {
          type
        }
      });
    }
    /**
     * 修改个人信息
     */
    public updateUserInfo(baseInfo:any): AxiosPromise<ErrorMsg> {
      const temp = Object.assign({},baseInfo);
      delete temp.listener;
      delete temp.pricesettings;
      return Axios.post("user", {
        ...temp
      });
    }

    public updateListenerOther(data:any):AxiosPromise<ErrorMsg>{
      return Axios.post("user/updateOther", data);
    }
    private constructor() {}

    public static getInstance() {
      return this._instance || (this._instance = new MyService());
    }
  }
