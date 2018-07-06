import * as request from 'request';
import { IWeixinModel } from '../interface/IWeixinModel';
const wxconfig = require("../../config/wxconfig.json");
const appid = wxconfig.appid;
const appsecret = wxconfig.appsecret;

interface IAccessTokenModel{
    access_token:string,
    openid:string,
    expires_in:number,
    refresh_token:string,
    scope:string
}

export default class WeixinHelper{
    static getAccesstoken(code:string){
        if(!code){
            return Promise.reject({message:"code不能为空"});
        }
        return new Promise<IAccessTokenModel>((resolve,reject)=>{
            request(`https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appid}&secret=${appsecret}&code=${code}&grant_type=authorization_code`,
            function(err,response){
                if(err){
                    reject(err);
                    return;
                }
                if(response.statusCode != 200){
                    reject({success:false,message:"返回状态:"+response.statusCode});
                    return;
                }
                let body = response.body;
                let isError = false;
                try{
                    body = JSON.parse(response.body);
                }catch(e){
                    isError = true;
                }
                if(isError){
                    reject({success:false,message:"解析出错"});
                    return;
                }
                
                resolve(<IAccessTokenModel>body);
            });
        });
    }
    static getUserinfoByCode(code:string){
        return this.getAccesstoken(code).then(res=>this.getUserinfo(res.access_token,res.openid));
    }
    static getUserinfo(accesstoken:string,openid:string){
        if(!accesstoken){
            return Promise.reject({message:"accesstoken不能为空"});
        }
        if(!openid){
            return Promise.reject({message:"openid不能为空"})
        }
        return new Promise<IWeixinModel>((resolve,reject)=>{
            request(`https://api.weixin.qq.com/sns/userinfo?access_token=${accesstoken}&openid=${openid}&lang=zh_CN`,
            function(err,response){
                if(err){
                    reject(err);
                    return;
                }
                if(response.statusCode != 200){
                    reject({success:false,message:"返回状态:"+response.statusCode});
                    return;
                }
                let body = response.body;
                let isError = false;
                try{
                    body = JSON.parse(response.body);
                }catch(e){
                    isError = true;
                }
                if(isError){
                    reject({success:false,message:"解析出错"});
                    return;
                }
                
                resolve(<IWeixinModel>body);
            });
        });
    }
}