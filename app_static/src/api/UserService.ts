import Axios, { AxiosPromise } from "axios";

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
    private constructor() {}

    public static getInstance() {
      return this._instance || (this._instance = new MyService());
    }
  }
