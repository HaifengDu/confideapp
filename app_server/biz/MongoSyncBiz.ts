import MongoSortFilterModel from "../model/mongo/MongoSortFilterModel";
import { IListener } from "../interface/model/IListener";
import ObjectHelper from "../helper/objectHelper";
import IUser from "../interface/model/IUser";
import ErrorMsg from "../model/ErrorMsg";

export default class MongoSyncBiz {

    private static _instance: MongoSyncBiz;

    private constructor() {
    }

    public create(res:IListener){
        return MongoSortFilterModel.create({
            uid:res.uid,
            generalprice:res.minprice,
            auth:res.authstatus,
            praisepercent:0,
            sex:res.user.sex,
            family:res.family,
            address:res.user.address,
            birthday:res.user.birthday,
            edu:res.edu,
            sealtimes:0,
            receivestatus:res.recievestatus,
            labelids:res.labelids
        });
    }

    public updateByUser(user:IUser){
        const doc:any = {};
        if('sex' in user){
            doc.sex = user.sex;
        }
        if("birthday" in user){
            doc.birthday = user.birthday;
        }
        if("address" in user){
            doc.address = user.address;
        }
        if(Object.keys(doc).length>0){
            return MongoSortFilterModel.update({
                uid:user.id,
            },doc);
        }
        return Promise.resolve(new ErrorMsg(true));
    }

    public updateByListener(listener:IListener){
        const doc:any = {};
        if("minprice" in listener){
            doc.generalprice = listener.minprice;
        }
        if("auth" in listener){
            doc.auth = (<IListener>listener).authstatus;
        }
        if("family" in listener){
            doc.family = (<IListener>listener).family;
        } 
        if("edu" in listener){
            doc.edu = (<IListener>listener).edu;
        }
        if("recievestatus" in listener){
            doc.receivestatus = (<IListener>listener).recievestatus;
        }
        if("labelids" in listener){
            doc.labelids = ObjectHelper.parseJSON(<string>listener.labelids);
        }
        if(Object.keys(doc).length>0){
            return MongoSortFilterModel.update({
                uid:listener.uid,
            },doc);
        }
        return Promise.resolve(new ErrorMsg(true));
    }

    static createInstance() {
        MongoSyncBiz.getInstance();
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

}