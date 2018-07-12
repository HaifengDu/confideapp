import { MongoVisitRecord } from "../model/mongo/MongoVisitRecord";
import { MongoFavorite } from "../model/mongo/MongoFavorite";
import UserService from "./User";
import ObjectHelper from "../helper/objectHelper";
import { IPager } from "../interface/IPager";
import ErrorMsg from "../model/ErrorMsg";
import { IUser } from "../interface/model/IUser";

export default class ClickRateService {

    private static _instance: ClickRateService;
    private readonly PAGE_SIZE = 20;
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
    public getVisitRecords(lid:number,page:IPager){
        const tempPage:IPager = {
            start:0,
            limit:this.PAGE_SIZE
        };
        if(page){
            tempPage.start = page.start||0;
            tempPage.limit = page.limit||0;
        }
        const query = MongoVisitRecord.find({
            lid
        });
        return query.sort({
            ldate:-1
        }).skip(tempPage.start).limit(tempPage.limit).then(res=>{
            const pids = res.map(item=>item.pid);
            if(!pids.length){
                return [];
            }
            return this.userService.findInIds(pids).then(data=>{
                return data.map(item=>{
                    const temp = ObjectHelper.serialize<IUser>(item);
                    const current = res.find(item=>item.pid===temp.id);
                    if(current){
                        (<any>temp).clickdate = current.ldate? (<any>new Date(current.ldate)).format('yyyy-MM-dd hh:mm:ss') : '';;
                    }
                    return temp;
                });
            });
        });
    }

    /**
     * 获取点击
     * @param lid 
     */
    public getFavorites(lid:number,page:IPager){
        const tempPage:IPager = {
            start:0,
            limit:this.PAGE_SIZE
        };
        if(page){
            tempPage.start = page.start||0;
            tempPage.limit = page.limit||0;
        }
        const query = MongoFavorite.find({
            lid
        });
        return query.sort({
            ldate:-1
        }).skip(tempPage.start).limit(tempPage.limit).then(res=>{
            const pids = res.map(item=>item.pid);
            if(!pids.length){
                return [];
            }
            return this.userService.findInIds(pids).then(data=>{
                return data.map(item=>{
                    const temp = ObjectHelper.serialize<IUser>(item);
                    const current = res.find(item=>item.pid===temp.id);
                    if(current){
                        (<any>temp).clickdate = current.ldate? (<any>new Date(current.ldate)).format('yyyy-MM-dd hh:mm:ss') : '';;
                    }
                    return temp;
                });
            });
        });
    }

    /**
     * 判断当前用户对应的点击用户是否关注过
     * @param userid 
     * @param ids 
     */
    public getRecordInIds(userid:number,ids:number[]){
        const maxlength = 100;
        if(!ids||!ids.length){
            return Promise.resolve([]);
        }
        if(ids.length>maxlength){
            return Promise.reject(new ErrorMsg(false,"用户数量过大"));
        }
        const where = {
            pid:{
                $in:ids
            },
            lid:userid
        };
        return MongoFavorite.find(where).then(res=>{
            return ids.map(id=>{
                return {
                    id:id,
                    record:!!res.find(item=>item.pid===id)//找到表示关注过
                }
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