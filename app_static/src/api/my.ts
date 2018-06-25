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

    private constructor() {}

    public static getInstance() {
      return this._instance || (this._instance = new MyService());
    }
  }
