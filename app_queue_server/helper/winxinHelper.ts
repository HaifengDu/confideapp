const wxconfig = require("../../config/wxconfig.json");
const appid = wxconfig.appid;
const appsecret = wxconfig.appsecret;
const fs = require("fs");
import * as request from "request";
export default class WinxinHelper {

    private static _instance: WinxinHelper;
    private static downloadFileUrl = "http://file.api.weixin.qq.com/cgi-bin/media/get?access_token=${ACCESS_TOKEN}&media_id=${MEDIA_ID}";
    private static getAccessTokenUrl = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${appsecret}`;
    private constructor() {
    }

    static createInstance() {
        WinxinHelper.getInstance();
    }

    public getAccessToken(){
        return new Promise<any>(function(resolve,reject){
            request.get(WinxinHelper.getAccessTokenUrl,(err,res)=>{
                if(err){
                    reject(err);
                    return;
                }
                if(res.statusCode!=200){
                    reject(res);
                    return;
                }
                let body = res.body;
                let isError = false;
                try{
                    body = JSON.parse(res.body);
                }catch(e){
                    isError = true;
                }
                if(isError){
                    reject({success:false,message:"解析出错"});
                    return;
                }
                if(body.errcode===0){
                    resolve(body);
                }else{
                    reject(body);
                }
            })
        });
    }

    public downLoadFile(access_token:string,roomid:string,media_id:string){
        return new Promise(function(resolve,reject){
            const url = WinxinHelper.downloadFileUrl.replace("${ACCESS_TOKEN}",access_token).replace("${MEDIA_ID}",media_id);
            const file = fs.createWriteStream(`../public/audio/${roomid}/${media_id}.mp3`);
            request.get(url,(err,res)=>{
                if(err){
                    reject(err);
                    return;
                }
                if(res.statusCode!=200){
                    reject(res);
                    return;
                }
                res.pipe(file);
                res.on("error",err=>reject(err));
                res.on("end",()=>{
                    resolve();
                });
            });
        });
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

}