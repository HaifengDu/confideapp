import Axios, { AxiosPromise } from "axios";
import { IResponse } from "../interface/model/IResponse";
import { IListener } from "../interface/model/IListener";

export default class HomeService {

    private static _instance: HomeService;

    private constructor() {
    }

    public getRecommendList():AxiosPromise<IResponse<IListener[]>>{
        return Axios.get('/recommend/home');
    }

    static createInstance() {
        HomeService.getInstance();
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

}