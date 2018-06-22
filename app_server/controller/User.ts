// import UserModel from "../model/User";
import UserModel from "../model/User";
import { IUser } from "../interface/model/IUser";
import * as Bluebird from "bluebird";
import {Op} from "sequelize";

export default class UserService {

    private static _instance: UserService;

    private constructor() {
    }

    public create(user:IUser){
        return UserModel.create(user);
    }

    public find(id:number){
        return UserModel.findById(id);
    }

    public findByWeixin(weixinid:string){
        if(!weixinid){
            
            return Bluebird.reject("微信id不能为空");
        }
        return UserModel.find({
            where:{
                weixinid:weixinid
            }
        })
    }

    public delete(id:number){
        return UserModel.update({
            status:-1
        },{
            where:{
                id:id
            }
        });
    }

    public deleteByWeixin(weixinid:string){
        if(!weixinid){
            return Promise.reject("微信id不能为空");
        }
        return UserModel.update({
            status:-1
        },{
            where:{
                weixinid:weixinid
            }
        });
    }

    static createInstance() {
        UserService.getInstance();
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

}