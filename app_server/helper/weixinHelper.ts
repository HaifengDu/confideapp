import * as request from 'request';
const crypto = require('crypto');
import * as xml2js from "xml2js";
import {stringify} from "querystring";
import { IWeixinModel } from '../interface/IWeixinModel';
import ErrorMsg from '../model/ErrorMsg';
const wxconfig = require("../../config/wxconfig.json");
const globalconfig = require("../../config/globalconfig.json");
const appid = wxconfig.appid;
const appsecret = wxconfig.appsecret;
const appkey = wxconfig.appkey;
const mch_id = wxconfig.mch_id;
const nonce_str = wxconfig.nonce_str;
const origin = globalconfig.origin;
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

    /**
     * 微信统一生成订单
     * https://www.jianshu.com/p/e7ab4641df73
     * @param openid 
     * @param orderNo 
     * @param total_fee 
     */
    static unifiedOrder(openid:string,orderNo:number,total_fee:number){
        //mch_id商户号
        //detail 支付详情
        //out_trade_no//商户订单号
        //spbill_create_ip//客户端id
        //total_fee//金额
        const url = "https://api.mch.weixin.qq.com/pay/unifiedorder";
        const bookingNo = orderNo.toString();
        const attach = "千寻倾听支付";
        const notify_url = `${origin}/wx/payok`;
        const body = "千寻倾听支付";
        let formData  = "<xml>";
        formData  += "<appid>"+appid+"</appid>";  //appid
        formData  += "<attach>"+attach+"</attach>"; //附加数据
        formData  += "<body>"+body+"</body>";
        formData  += "<mch_id>"+mch_id+"</mch_id>";  //商户号
        formData  += "<nonce_str>"+nonce_str+"</nonce_str>"; //随机字符串，不长于32位。
        formData  += "<notify_url>"+notify_url+"</notify_url>";
        formData  += "<openid>"+openid+"</openid>";
        formData  += "<out_trade_no>"+bookingNo+"</out_trade_no>";
        formData  += "<spbill_create_ip></spbill_create_ip>";
        formData  += "<total_fee>"+total_fee+"</total_fee>";
        formData  += "<trade_type>JSAPI</trade_type>";
        formData  += "<sign>"+this.paysignjsapi(appid,attach,body,mch_id,nonce_str,notify_url,openid,bookingNo,'',total_fee,'JSAPI')+"</sign>";
        formData  += "</xml>";

        return new Promise((resolve,reject)=>{
            request({url:url,method:'POST',body: formData,timeout:30000},(err,res)=>{
                if(err){
                    reject(err);
                    return;
                }
                if(res.statusCode!==200){
                    reject(new ErrorMsg(false,res.body));
                    return;
                }

                xml2js.parseString(res.body,(err,data)=>{
                    if(err){
                        reject(err);
                        return;
                    }
                    //prepay_id可能在CData块中
                    const timeStamp = Date.now();
                    const _paySignjs = this.paysignjs(appid,nonce_str,'prepay_id='+data.prepay_id,'MD5',timeStamp.toString());
                    resolve({
                        appid,
                        nonce_str,
                        prepay_id:data.prepay_id,
                        signType:"MD5",
                        timeStamp,
                        paySign:_paySignjs
                    });
                });
            });
        });
    }

    static recieve(req:Request,res:Response){
        /**
         * 
            <xml><appid><![CDATA[wxe6c6ab2ef372xxxx]]></appid>
            <attach><![CDATA[2&85&139&0]]></attach>
            <bank_type><![CDATA[CFT]]></bank_type>
            <cash_fee><![CDATA[1]]></cash_fee>
            <fee_type><![CDATA[CNY]]></fee_type>
            <is_subscribe><![CDATA[Y]]></is_subscribe>
            <mch_id><![CDATA[129933xxxx]]></mch_id>
            <nonce_str><![CDATA[6xj94ajjika3io01f50z2cf9658fhhtj]]></nonce_str>
            <openid><![CDATA[ojN41uHLEXYuHkrJg2_PaDvxxxxx]]></openid>
            <out_trade_no><![CDATA[129933950120170618102333]]></out_trade_no>
            <result_code><![CDATA[SUCCESS]]></result_code>
            <return_code><![CDATA[SUCCESS]]></return_code>
            <sign><![CDATA[5060B8EE326BD346B7808D9996594A79]]></sign>
            <time_end><![CDATA[20170618102338]]></time_end>
            <total_fee>1</total_fee>
            <trade_type><![CDATA[JSAPI]]></trade_type>
            <transaction_id><![CDATA[4001862001201706186249259476]]></transaction_id>
            </xml>
         */

        const body = res.body;
        if(!body){
            return Promise.reject(new ErrorMsg(false,"参数为空"));
        }
        xml2js.parseString(body,(err,data)=>{
            if(err){
               return Promise.reject(err);
            }
            if(!data||!data.xml){
                return Promise.reject(new ErrorMsg(false,"微信返回数据为空"))
            }
            const root = data.xml;
            if(!root.result_code&&!root.result_code.length){
                return Promise.reject(new ErrorMsg(false,"支付失败，未返回result_code"));
            }
            if(root.result_code[0]==='SUCCESS'){
                if(!this.checkSign(root)){
                    return Promise.reject(new ErrorMsg(false,"支付失败，返回签名失败"));
                }
                return Promise.resolve(new ErrorMsg(true,"支付成功"));
            }
            return Promise.reject(new ErrorMsg(false,"支付失败，返回签名失败"));
        });
    }

    /**
     * 服务器端签名
     * @param appid 
     * @param attach 
     * @param body 
     * @param mch_id 
     * @param nonce_str 
     * @param notify_url 
     * @param openid 
     * @param out_trade_no 
     * @param spbill_create_ip 
     * @param total_fee 
     * @param trade_type 
     */
    private static paysignjsapi(appid:string,attach:string,body:string,mch_id:string,nonce_str:string,notify_url:string,openid:string,out_trade_no:string,spbill_create_ip:string,total_fee:number,trade_type:string) {
        const ret = {
            appid: appid,
            attach: attach,
            body: body,
            mch_id: mch_id,
            nonce_str: nonce_str,
            notify_url:notify_url,
            openid:openid,
            out_trade_no:out_trade_no,
            spbill_create_ip:spbill_create_ip,
            total_fee:total_fee,
            trade_type:trade_type
        };
        let string = stringify(ret);
        string = string + '&key='+appkey;
        return crypto.createHash('md5').update(string,'utf8').digest('hex');
    };

    /**
     * 客户端签名
     * @param appid 
     * @param nonceStr 
     * @param pack 
     * @param signType 
     * @param timeStamp 
     */
    private static paysignjs(appid:string,nonceStr:string,pack:string,signType:string,timeStamp:string) {
        const ret = {
            appId: appid,
            nonceStr: nonceStr,
            package:pack,
            signType:signType,
            timeStamp:timeStamp
        };
        let string = stringify(ret);
        string = string + '&key='+appkey;
        return crypto.createHash('md5').update(string,'utf8').digest('hex');
    };

    /**
     * 验证微信返回的签名
     * @param map 
     */
    private static checkSign(map:any){
        const sign = map.sign[0];
        if(!sign){
            return new ErrorMsg(false,"签名为空");
        }
        const dic:any = {};
        for(let key in map){
            if(key!=='sign'&&map[key]&&map[key][0]&&map[key][0]!==""){
                dic[key] = map[key][0];
            }
        }
        const str = stringify(dic);
        const hash = crypto.createHash('md5').update(str,'utf8').digest('hex');
        return sign===hash;
    }
}