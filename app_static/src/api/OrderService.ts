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
        return Axios.post("/order", {data:JSON.stringify(params)});
    }

    public checkHasOrder(uid:number,lid:number):AxiosPromise<IResponse<IOrder>>{
        return Axios.get("/order/checkHasOrder",{
            params:{uid,lid}
        });
    }

    /**
     * 聊天完成订单
     * @param orderid 
     * @param servicetime 
     */
    public chatComplete(orderid?:number,servicetime?:number):AxiosPromise<IResponse<IOrder>>{
        return Axios.post("/order/chatComplete",{
            orderid,
            servicetime
        });
    }
   
    /**
     * 更新服务时长
     * @param orderid 
     * @param servicetime 
     */
    public updateServicetime(orderid?:number,servicetime?:number):AxiosPromise<IResponse<IOrder>>{
        return Axios.post("/order/updateServicetime",{
            orderid,
            servicetime
        });
    }

    /**
     * 更新订单为服务中
     */
    public updateServicing(orderid:number):AxiosPromise<IResponse<IOrder>> {
        return Axios.post("/order/updateServicing",{
            orderid:orderid
        });
    }   

    /**
     * 获取订单列表
     * @param params 
     */
    public getOrderList(params:any):AxiosPromise<IResponse<IOrder>>{
        return Axios.get("/order/getOrderList",{params:params});
    }

    /**
     * 退款
     */
    public refound(orderid:number):AxiosPromise<IResponse<IOrder>> {
        return Axios.post("/order/refound",{
            orderid:orderid
        });
    }  

    /**
     * 支付订单   支付待支付的单子，不需要创建订单，直接支付
     */
    public pay(orderid:number):AxiosPromise<IResponse<IOrder>> {
        return Axios.post("/order/pay",{
            orderid:orderid
        });
    } 

    private constructor() {}

    public static getInstance() {
      return this._instance || (this._instance = new OrderService());
    }
  }
