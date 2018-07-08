import Axios, { AxiosResponse, AxiosRequestConfig } from "axios";
export default class BaseDataService {

    private static _instance: BaseDataService;

    private constructor() {
    }

    /**
     * getAll
     */
    public getAll():Promise<any> {
        return Axios.get("/base/getAll",<AxiosRequestConfig>{cache:true});
    }

    static createInstance() {
        BaseDataService.getInstance();
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

}