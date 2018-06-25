import Axios, { AxiosPromise } from "axios";
import { EBaseDataType } from "../enum/EBaseDataType";

export default class BaseInfoService {
  private static _instance: BaseInfoService;

  /**
   * getArea
   */
  public getArea(type:EBaseDataType): AxiosPromise<any> {
    return Axios.get("base", { params:{
      type
    } });
  }

  /**
    * getUserBaseInfo
    weixinid:string
    */
  public getUserBaseInfo(userid: string): AxiosPromise<any> {
    return Axios.get("listener", { params: { userid } });
  }

  private constructor() {}

  public static getInstance() {
    return this._instance || (this._instance = new BaseInfoService());
  }
}
