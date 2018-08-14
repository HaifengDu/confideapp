import Axios, { AxiosPromise } from "axios";
import ErrorMsg from "../model/ErrorMsg";
import { IResponse } from "../interface/model/IResponse";
import { IOrder } from "../interface/model/IOrder";

export default class EvaluteService {

    private static _instance: EvaluteService;

    /**
    * 获取评价列表
    */
    public getEvaList(params:any):AxiosPromise<any>{
        return Axios.get("/evaluate/list",{
            params:params
        });
    }

    /**
    * 获取评价分数及好评率数据
    */
    public getEvaDatas(lid:number):AxiosPromise<any>{
        return Axios.get("/evaluate/getaggregate",{
            params:{lid}
        });
    }

    /**
    * 新增评论
    */
    public addEva(params:any):AxiosPromise<any>{
        return Axios.put("/evaluate",params);
    }

    /**
    * 回复评论
    */
    public replyEva(params:any):AxiosPromise<any>{
        return Axios.post("/evaluate/reply",params);
    }

    private constructor() {}

    public static getInstance() {
      return this._instance || (this._instance = new EvaluteService());
    }
  }
