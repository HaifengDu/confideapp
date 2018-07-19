import Axios, { AxiosPromise } from "axios";
import ErrorMsg from "../model/ErrorMsg";

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
   

    private constructor() {}

    public static getInstance() {
      return this._instance || (this._instance = new OrderService());
    }
  }
