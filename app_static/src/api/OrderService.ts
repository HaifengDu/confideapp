import Axios, { AxiosPromise } from "axios";
import ErrorMsg from "../model/ErrorMsg";
import { IResponse } from "../interface/model/IResponse";
import { IOrder } from "../interface/model/IOrder";

export default class OrderService {
    private static _instance: OrderService;

    /**
    * 生成订单
    */
    public placeOrder(params:any):AxiosPromise<any>{
        if(!params){
            return Promise.reject(new ErrorMsg(false,"参数不正确"));
        }
        //TODO:后期去掉这里的userid
        return Axios.post("/order?userid=3", {data:JSON.stringify(params)});
    }

    public checkHasOrder(uid:number,lid:number):AxiosPromise<IResponse<IOrder>>{
        return Axios.get("/order/checkHasOrder",{
            params:{uid,lid}
        });
    }
   

    private constructor() {}

    public static getInstance() {
      return this._instance || (this._instance = new OrderService());
    }
  }
