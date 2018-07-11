import { MongoVisitRecord } from "../model/mongo/MongoVisitRecord";
import { MongoFavorite } from "../model/mongo/MongoFavorite";
import UserService from "./User";
import ObjectHelper from "../helper/objectHelper";

export default class ClickRateService {

    private static _instance: ClickRateService;
    private userService:UserService;

    private constructor() {
        this.userService = UserService.getInstance();
    }

    /**
     * 访问
     * @param pid 
     * @param lid 
     */
    public recordClickRate(pid:number,lid:number){
        return MongoVisitRecord.findOne({
            pid,
            lid
        }).then(res=>{
            if(res){
                return MongoVisitRecord.update({
                    pid,
                    lid
                },{
                    ldate:new Date()
                });
            }
            return MongoVisitRecord.create({
                pid,
                lid,
                ldate:new Date()
            });
        });
    }

    /**
     * 收藏
     * @param pid 
     * @param lid 
     */
    public addFavorite(pid:number,lid:number){
        return MongoFavorite.findOne({
            pid,
            lid
        }).then(res=>{
            if(res){
                return MongoFavorite.update({
                    pid,
                    lid
                },{
                    ldate:new Date()
                });
            }
            return MongoFavorite.create({
                pid,
                lid,
                ldate:new Date()
            });
        });
    }

    /**
     * 获取访问
     * @param lid 
     */
    public getVisitRecords(lid:number){
        const query = MongoVisitRecord.find({
            lid
        });
        return query.sort({
            ldate:-1
        }).then(res=>{
            const pids = res.map(item=>item.pid);
            if(!pids.length){
                return [];
            }
            return this.userService.findInIds(pids).then(data=>{
                return data.map(item=>{
                    const temp = ObjectHelper.serialize<any>(item);
                    const current = res.find(item=>item.pid===temp.id);
                    if(current){
                        temp.clickdate = current.ldate;
                    }
                });
            });
        });
    }

    /**
     * 获取点击
     * @param lid 
     */
    public getFavorites(lid:number){
        const query = MongoFavorite.find({
            lid
        });
        return query.sort({
            ldate:-1
        }).then(res=>{
            const pids = res.map(item=>item.pid);
            if(!pids.length){
                return [];
            }
            return this.userService.findInIds(pids).then(data=>{
                return data.map(item=>{
                    const temp = ObjectHelper.serialize<any>(item);
                    const current = res.find(item=>item.pid===temp.id);
                    if(current){
                        temp.clickdate = current.ldate;
                    }
                });
            });
        });
    }

    static createInstance() {
        ClickRateService.getInstance();
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

}