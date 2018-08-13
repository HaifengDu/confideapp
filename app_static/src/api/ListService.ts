import Axios,{AxiosPromise} from "axios";
import { IFilterField } from "../interface/IFilterField";
import { IResponse } from "../interface/model/IResponse";
import { IListener } from "../interface/model/IListener";
export default class ListService {

    private static _instance: ListService;

    private constructor() {
    }

    /**
     * getSearchResult
     */
    public getSearchResult(filter:IFilterField) :AxiosPromise<IResponse<IListener[]>>{
        return Axios.post("/list",{data:JSON.stringify(filter)});
    }
    public searchList(name:string,start:number,limit:number):AxiosPromise<any>{
      return Axios.get('/list/search',{params:{name,start,limit}})
    }

    static createInstance() {
        ListService.getInstance();
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

}
