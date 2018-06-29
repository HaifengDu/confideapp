import IFilterField from "../interface/IFilterField";
import MongoSortFilterModel from "../model/mongo/MongoSortFilterModel";
import * as Bluebird from "bluebird";
import * as moment from "moment";
import ErrorMsg from "../model/ErrorMsg";
import ListenerService from "./Listener";
import { IListener } from "../interface/model/IListener";
import { ERecieveStatus } from "../enum/ERecieveStatus";
import { IPager } from "../interface/IPager";

export default class ListService {

    private static _instance: ListService;

    private listenerService:ListenerService
    private readonly pageSize = 20;

    private constructor() {
        this.listenerService = ListenerService.getInstance();
    }

    /**
     * getList
     */
    public getList(filter:IFilterField) {
        //
        if(!filter){
            return Bluebird.reject(new ErrorMsg(false,"筛选参数不能为空！"));
        }
        if(!filter.labelid){
            return Bluebird.reject(new ErrorMsg(false,"标签id不能为空！"));
        }
        const whereOption:any = {
            labelids:filter.labelid
        };

        ["edu","auth","sex","family"].forEach(item=>{
            if(filter[item]){
                whereOption[item] = filter[item];
            }
        })
        
        if(filter.generalprice){
            whereOption.generalprice = {
                '$gte':filter.generalprice
            };
        }
        if(filter.age){
            whereOption.birthday = {

            }
            if(filter.age[0]&&typeof filter.age[0]==="number"){
                const min = moment(new Date).subtract(filter.age[0],"year").toDate();
                whereOption.birthday["$gte"]=min;
            }
            if(filter.age[1]&&typeof filter.age[1]==="number"){
                const max = moment(new Date).subtract(filter.age[1],"year").toDate();
                whereOption.birthday["$lt"]=max;
            }
        }
        whereOption.receivestatus = ERecieveStatus.可接单;
        let query = MongoSortFilterModel.find(whereOption);
        if(filter.sort){
            query = query.sort({ [filter.sort]: -1 });
        }else{
            query = query.sort({ praisepercent:-1,sealtimes:-1});
        }
        const start = filter.start || 0;
        let pageSize = filter.page;
        if(!pageSize||typeof pageSize!=='number'){
            pageSize = this.pageSize;
        }
        return <any>query.skip(start).limit(pageSize).then(res=>{
            return this.listenerService.findInUserids(res.map(item=>item.uid));
        }) as Bluebird<IListener[]>;
    }

    public getSearch(name:string,page:IPager){
        return this.listenerService.findByName(name,page);
    }

    static createInstance() {
        ListService.getInstance();
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

}