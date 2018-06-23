// import UserModel from "../model/User";
import UserModel from "../model/User";
import { IUser } from "../interface/model/IUser";
import * as Bluebird from "bluebird";
// import {Op} from "sequelize";
import WeixinHelper from "../helper/weixinHelper";
import { ERole } from "../enum/ERole";
import AreaHelper from "../helper/areaHelper";
import ErrorMsg from "../model/ErrorMsg";
import * as Sequelize from "sequelize";
import MailHelper from "../helper/mailHelper";
import { IMailCode } from "../interface/IMailCode";
import { EBindPhoneStatus } from "../enum/EBindPhoneStatus";

export default class UserService {

    private static _instance: UserService;
    private _areaHelper:AreaHelper;
    private _mailHelper:MailHelper;

    private constructor() {
        this._mailHelper = MailHelper.getInstance();
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

    public update(user:IUser,transtion?:Sequelize.Transaction){
        if(!user.id){
            return Bluebird.reject(new ErrorMsg(false,"用户id不能为空"));
        }
        const id = user.id;
        delete user.id;
        let options:Sequelize.UpdateOptions = {
            where:{
                id
            }
        }
        if(transtion){
            options.transaction = transtion;
        }
        return UserModel.update(user,options);
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

    private findByPhone(phone:string){
        return UserModel.find({
            where:{
                phone:phone
            }
        });
    }

    public getCheckCode(phone:string){
        return this.findByPhone(phone).then(res=>{
            if(res){
                return Bluebird.reject(new ErrorMsg(false,"当前手机号已经绑定账号"));
            }            
            return this._mailHelper.getCode(phone);
        })
    }

    public bindPhoneCode(source:IMailCode,checkModel:IMailCode,userid:number){
        const result = this._mailHelper.checkCode(source,checkModel);
        if(!result.success){
            return Bluebird.reject(result);
        }
        return this.findByPhone(checkModel.phone).then(res=>{
            if(res){
                return Bluebird.reject(new ErrorMsg(false,"当前手机号已经绑定账号"));
            }
            return this.update({
                phone:checkModel.phone,
                phonebindstatus:EBindPhoneStatus.已绑定,
                id:userid
            });
        })
    }

    static createInstance() {
        UserService.getInstance();
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

}