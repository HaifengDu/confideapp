import Axios, { AxiosPromise } from "axios";
import { EBaseDataType } from "../enum/EBaseDataType";
import ErrorMsg from "../model/ErrorMsg";
import { IResponse } from "../interface/model/IResponse";
import { IUser } from "../interface/model/IUser";

export default class MyService {
    private static _instance: MyService;

    /**
     * 根据id获取用户
     * @param id
     */
    public getUser(id:number):AxiosPromise<IResponse<IUser>>{
      return Axios.get("user/byid",{
        params:{
          uid:id
        }
      });
    }

    /**
    * getUserInfo
    */
    public getUserInfo(code: string): AxiosPromise<IResponse<IUser>> {
      return Axios.put("user", { code });
    }

    /**
    * getUserInfobyWXid
    weixinid:string
    */
    public getUserInfobyWXid(weixinid: string): AxiosPromise<IResponse<IUser>> {
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
    /**
     * 职业等信息修改
     */
    public updateListenerOther(data:any):AxiosPromise<ErrorMsg>{
      return Axios.post("user/updateOther", data);
    }

    /**
     * 获取访客数据
     */
    public getVisitVecords(params:any):AxiosPromise<any>{
      return Axios.get("/user/getvisitrecords", {params});
    }

    /**
     * 获取关注列表数据
     */
    public getFavorites(params:any):AxiosPromise<any>{
      return Axios.get("/user/getfavorites", {params});
    }

    /**
     * 获取每个用户对应的关注数据
     */
    public getCheckRecord(ids:Array<number>):AxiosPromise<any>{
      return Axios.get("/user/getcheckrecord", {params:{lids:JSON.stringify(ids)}});
    }

    /**
     * 关注
     */
    public addfavorite(id:number):AxiosPromise<any>{
      return Axios.get("/user/addfavorite", {params:{lid:id}});
    }

    /**
     * 取消关注
     */
    public delfavorite(id:number):AxiosPromise<any>{
      return Axios.get("/user/delfavorite", {params:{lid:id}});
    }

    /**
     * 倾听者好评率|已售时长|最新评论等
     */
    public getSummaryData(lid:number):AxiosPromise<any>{
      return Axios.get("/order/getSummaryData", {params:{lid}});
    }

    private constructor() {}

    public static getInstance() {
      return this._instance || (this._instance = new MyService());
    }
  }
