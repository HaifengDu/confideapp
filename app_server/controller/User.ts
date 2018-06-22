// import UserModel from "../model/User";
import UserModel from "../model/User";
import { IUser } from "../interface/model/IUser";
import * as Bluebird from "bluebird";
// import {Op} from "sequelize";
import WeixinHelper from "../helper/weixinHelper";
import { ERole } from "../enum/ERole";
import AreaHelper from "../helper/areaHelper";

export default class UserService {

    private static _instance: UserService;
    private _areaHelper:AreaHelper;

    private constructor() {
        this._areaHelper = AreaHelper.getInstance();
    }

    public bindUser(code:string){
        return WeixinHelper.getUserinfoByCode(code).then(res=>{
            const userModel:IUser = {
                weixinid:res.openid,
                role:ERole.Pourouter,
                nickname:res.nickname,
                headimgurl:res.headimgurl,
                address:this._areaHelper.getCode(res.city),
                sex:res.sex
            }
            //查看是否绑定了微信
            return this.findByWeixin(userModel.weixinid).then(res=>{
                if(res){
                    return Bluebird.resolve(res);
                }
                return this.create(userModel);
            })
            // return this.create(userModel);
        });
    }

    private create(user:IUser){
        return UserModel.create(user);
    }

    public find(id:number){
        return UserModel.findById(id);
    }

    public findByWeixin(weixinid:string){
        if(!weixinid){
            
            return Bluebird.reject({message:"微信id不能为空"});
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
            return Promise.reject({message:"微信id不能为空"});
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