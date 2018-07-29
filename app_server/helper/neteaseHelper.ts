
import * as request from 'request';
import * as crypto from 'crypto';
import { createNonceStr } from './util';
import ObjectHelper from './objectHelper';
const {APP_KEY,APP_SECRET} = require("../../config/neteaseconfig.json");
export default class NeteaseHelper {

    private static readonly TOKEN_URL="https://api.netease.im/nimserver/user/create.action";
    private static _instance: NeteaseHelper;

    private constructor() {
    }

    static createInstance() {
        NeteaseHelper.getInstance();
    }

    getToken(uid:number){
        const curTime = Date.now()/1000;
        const nonce = createNonceStr();
        const array = [APP_SECRET, nonce, curTime];
        const hashCode = crypto.createHash('sha1');
        const checkSum = hashCode.update(array.join(""), 'utf8').digest('hex');
        return new Promise<any>((resolve,reject)=>{
            request(NeteaseHelper.TOKEN_URL,{
                headers:{
                    AppKey:APP_KEY,
                    Nonce:nonce,
                    CurTime:curTime,
                    CheckSum:checkSum,
                    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
                },
                form:{
                    accid:uid.toString()
                },
                method:"post"
            },(err,res)=>{
                //
                if(err){
                    reject(err);
                    return;
                }
                if(res.statusCode===200){
                    let result = ObjectHelper.parseJSON(res.body);
                    if(result){
                        if(result.code===200){
                            resolve(result.info);
                        }else{
                            reject(result);
                        }
                    }else{
                        reject({
                            success:false,
                            message:"解析出错"
                        });
                    }
                }else{
                    reject({
                        success:false,
                        message:res.statusCode
                    });
                }
            });
        });
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

}