const Payment = require('wechat-pay').Payment;
const fs = require("fs");
const wxconfig = require("../../config/wxconfig.json");
const globalconfig = require("../../config/globalconfig.json");
const origin = globalconfig.origin;
export const initConfig = {
    partnerKey: wxconfig.appkey,
    appId: wxconfig.appId,
    mchId: wxconfig.mch_id,
    notifyUrl: `${origin}/pay/payaction`,
    pfx: fs.readFileSync("<location-of-your-apiclient-cert.p12>")
};
const payment = new Payment(initConfig);

export default class WxPayHelper {

    private static _instance: WxPayHelper;

    /**
     * 支付
     * @param ip 
     * @param openid 
     * @param orderNo 
     * @param total_fee 
     */
    public pay(ip:string,openid:string,orderNo:number,total_fee:number){
        const order = {
            body: '千寻倾听支付',
            attach: '千寻倾听支付',
            out_trade_no: orderNo,
            total_fee: total_fee,
            spbill_create_ip: ip,
            openid: openid,
            trade_type: 'JSAPI'
        };
        return new Promise((resolve,reject)=>{
            payment.getBrandWCPayRequestParams(order, function(err, payargs){
                if(err){
                    reject(err);
                    return;
                }
                resolve(payargs);
            });
        });
    }

    /**
     * 退款
     * @param orderNo 
     * @param total_fee 
     */
    public refund(orderNo:number,total_fee:number){
        return new Promise((resolve,reject)=>{
            payment.refund({
                out_trade_no: orderNo,
                out_refund_no: orderNo+'_refund',
                total_fee: total_fee,
                refund_fee: total_fee
            }, function(err, result){
                /**
                 * 微信收到正确的请求后会给用户退款提醒
                 * 这里一般不用处理，有需要的话有err的时候记录一下以便排查
                 */
                if(err){
                    reject(err);
                    return;
                }
                resolve(result);
            });
        });
    }

    private constructor() {
    }

    static createInstance() {
        WxPayHelper.getInstance();
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

}