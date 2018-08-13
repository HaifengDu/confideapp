import Axios, { AxiosPromise } from "axios";
import { IResponse } from "../interface/model/IResponse";
import { IRecommend } from "../interface/IRecommend";

export default class RecommendService{
    private static _instance: RecommendService;

    /**
     * 首页 倾听者好评率 所售时长
     */
    public getSummeryDatas(lids:number[]):AxiosPromise<IResponse<IRecommend[]>>{
      return Axios.get("/order/getSummeryDatas",{params:{lids:lids.join(',')}});
    }

    private constructor() {}

    public static getInstance() {
      return this._instance || (this._instance = new RecommendService());
    }
}
