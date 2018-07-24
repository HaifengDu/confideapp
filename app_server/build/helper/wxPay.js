"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorMsg_1 = require("../model/ErrorMsg");
const queryString = require('querystring');
const crypto = require('crypto');
const request = require('request');
const xml2js = require('xml2js');
const logHelper_1 = require("./logHelper");
const util_1 = require("./util");
// 引入项目的配置信息
const wxconfig = require("../../config/wxconfig.json");
const globalconfig = require("../../config/globalconfig.json");
const appid = wxconfig.appid;
const appkey = wxconfig.appkey;
const mch_id = wxconfig.mch_id;
const origin = globalconfig.origin;
const logHelper = logHelper_1.default.getInstance();
/**
 * 支付回调
 * @param req
 */
function recieve(req) {
    const body = req.body;
    if (!body) {
        logHelper.errorOrder({
            ip: util_1.getClientIp(req),
            body: body,
            message: "请求体为空"
        });
        return Promise.reject(new ErrorMsg_1.default(false, "请求体为空"));
    }
    return new Promise((resolve, reject) => {
        xml2js.parseString(req.body, (err, data) => {
            if (err) {
                logHelper.errorOrder({
                    ip: util_1.getClientIp(req),
                    body: body,
                    message: err.message,
                    stack: err.stack
                });
                reject(new ErrorMsg_1.default(false, err.message, err));
                return;
            }
            if (!data || !data.xml) {
                logHelper.errorOrder({
                    ip: util_1.getClientIp(req),
                    body: body,
                    message: "请求体未包含xml"
                });
                reject(new ErrorMsg_1.default(false, "请求体未包含xml"));
                return;
            }
            const xml = data.xml;
            if (xml.result_code && xml.result_code[0] === 'SUCCESS' && xml.return_code && xml.return_code[0] === 'SUCCESS') {
                logHelper.appendOrder({
                    ip: util_1.getClientIp(req),
                    body: body,
                    message: "支付成功"
                });
                resolve(Object.assign({ data: xml }, new ErrorMsg_1.default(true, "支付成功")));
            }
            else {
                logHelper.errorOrder({
                    ip: util_1.getClientIp(req),
                    body: body,
                    message: "支付失败"
                });
                reject(new ErrorMsg_1.default(false, "支付失败"));
            }
        });
    });
    // <xml><appid><![CDATA[wxe6c6ab2ef372xxxx]]></appid>
    // <attach><![CDATA[2&85&139&0]]></attach>
    // <bank_type><![CDATA[CFT]]></bank_type>
    // <cash_fee><![CDATA[1]]></cash_fee>
    // <fee_type><![CDATA[CNY]]></fee_type>
    // <is_subscribe><![CDATA[Y]]></is_subscribe>
    // <mch_id><![CDATA[129933xxxx]]></mch_id>
    // <nonce_str><![CDATA[6xj94ajjika3io01f50z2cf9658fhhtj]]></nonce_str>
    // <openid><![CDATA[ojN41uHLEXYuHkrJg2_PaDvxxxxx]]></openid>
    // <out_trade_no><![CDATA[129933950120170618102333]]></out_trade_no>
    // <result_code><![CDATA[SUCCESS]]></result_code>
    // <return_code><![CDATA[SUCCESS]]></return_code>
    // <sign><![CDATA[5060B8EE326BD346B7808D9996594A79]]></sign>
    // <time_end><![CDATA[20170618102338]]></time_end>
    // <total_fee>1</total_fee>
    // <trade_type><![CDATA[JSAPI]]></trade_type>
    // <transaction_id><![CDATA[4001862001201706186249259476]]></transaction_id>
    // </xml>
}
exports.recieve = recieve;
function wxPay(openid, orderNo, total_fee) {
    return unifiedOrder(openid, orderNo, total_fee).then(data => {
        const prepay_id = data.prepay_id;
        const jsParams = {
            "appId": appid,
            "timeStamp": parseInt((new Date().getTime() / 1000).toString()).toString(),
            "nonceStr": util_1.createNonceStr(),
            // 通过统一下单接口获取
            "package": "prepay_id=" + prepay_id,
            "signType": "MD5",
        };
        jsParams.paySign = getSign(jsParams); //微信支付签名
        return { jsParams, prepay_id };
    });
}
exports.wxPay = wxPay;
/**
 * 统一下单
 */
function unifiedOrder(openid, orderNo, total_fee) {
    //mch_id商户号
    //detail 支付详情
    //out_trade_no//商户订单号
    //spbill_create_ip//客户端id
    //total_fee//金额
    const url = "https://api.mch.weixin.qq.com/pay/unifiedorder";
    const orderNoStr = orderNo.toString();
    const attach = "千寻倾听支付";
    const notify_url = `${origin}/wx/payaction`;
    const body = "千寻倾听支付";
    let formData = "<xml>";
    const nonce_str = util_1.createNonceStr();
    formData += "<appid>" + appid + "</appid>"; //appid
    formData += "<attach>" + attach + "</attach>"; //附加数据
    formData += "<body>" + body + "</body>";
    formData += "<mch_id>" + mch_id + "</mch_id>"; //商户号
    formData += "<nonce_str>" + nonce_str + "</nonce_str>"; //随机字符串，不长于32位。
    formData += "<notify_url>" + notify_url + "</notify_url>";
    formData += "<openid>" + openid + "</openid>";
    formData += "<out_trade_no>" + orderNoStr + "</out_trade_no>";
    formData += "<spbill_create_ip></spbill_create_ip>";
    formData += "<total_fee>" + total_fee + "</total_fee>";
    formData += "<trade_type>JSAPI</trade_type>";
    formData += "<sign>" + getSign({
        appid,
        attach,
        body,
        mch_id,
        nonce_str: nonce_str,
        notify_url,
        openid,
        out_trade_no: orderNoStr,
        spbill_create_ip: '',
        total_fee,
        trade_type: 'JSAPI'
    }) + "</sign>";
    formData += "</xml>";
    return new Promise((resolve, reject) => {
        request({ url: url, method: 'POST', body: formData, timeout: 30000 }, (err, res) => {
            if (err) {
                reject(err);
                return;
            }
            if (res.statusCode !== 200) {
                reject(new ErrorMsg_1.default(false, "返回状态不正确"));
                return;
            }
            xml2js.parseString(res.body, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                let prepay_id = "";
                if (data.xml.prepay_id) {
                    prepay_id = data.xml.prepay_id[0];
                }
                //判断data.return_code == 'SUCCESS' && data.result_code == 'SUCCESS'
                resolve(Object.assign({ prepay_id: prepay_id }, new ErrorMsg_1.default(true)));
            });
        });
    });
    /**
     * const UnifiedorderParams:any = {
            appid : config.wxappid,
            attach : obj.attach,
            body : obj.body,
            mch_id : config.mch_id,
            nonce_str: this.createNonceStr(),
            notify_url : obj.notify_url,// 微信付款后的回调地址
            openid : this.userInfo.openid,
            out_trade_no : obj.out_trade_no,//new Date().getTime(), //订单号
            spbill_create_ip : obj.spbill_create_ip,
            total_fee : obj.total_fee,
            trade_type : 'JSAPI',
            // sign : getSign(),
        };
     */
}
/**
 * 签名
 * @param signParams
 */
function getSign(signParams) {
    // 按 key 值的ascll 排序
    let keys = Object.keys(signParams);
    keys = keys.sort();
    const newArgs = {};
    keys.forEach(function (val, key) {
        if (signParams[val]) {
            newArgs[val] = signParams[val];
        }
    });
    const string = queryString.stringify(newArgs) + '&key=' + appkey;
    // 生成签名
    return crypto.createHash('md5').update(queryString.unescape(string), 'utf8').digest("hex").toUpperCase();
}
// function  createNonceStr() {
//     return Math.random().toString(36).substr(2, 15);
// };
// // wechat 支付类 (使用 es6 的语法)
// class WechatPay {
//     /**
//      * 构造函数
//      * @param params 传递进来的方法
//      */
//     constructor( userInfo ){
//         this.userInfo = userInfo;
//     }
//     /**
//      * 获取微信统一下单参数
//      */
//     getUnifiedorderXmlParams(obj){
//         const body = '<xml> ' +
//             '<appid>'+config.wxappid+'</appid> ' +
//             '<attach>'+obj.attach+'</attach> ' +
//             '<body>'+obj.body+'</body> ' +
//             '<mch_id>'+config.mch_id+'</mch_id> ' +
//             '<nonce_str>'+obj.nonce_str+'</nonce_str> ' +
//             '<notify_url>'+obj.notify_url+'</notify_url>' +
//             '<openid>'+obj.openid+'</openid> ' +
//             '<out_trade_no>'+obj.out_trade_no+'</out_trade_no>'+
//             '<spbill_create_ip>'+obj.spbill_create_ip+'</spbill_create_ip> ' +
//             '<total_fee>'+obj.total_fee+'</total_fee> ' +
//             '<trade_type>'+obj.trade_type+'</trade_type> ' +
//             '<sign>'+obj.sign+'</sign> ' +
//             '</xml>';
//         return body;
//     }
//     /**
//      * 获取微信统一下单的接口数据
//      */
//     getPrepayId(obj){
//         const that = this;
//         // 生成统一下单接口参数
//         const UnifiedorderParams:any = {
//             appid : config.wxappid,
//             attach : obj.attach,
//             body : obj.body,
//             mch_id : config.mch_id,
//             nonce_str: this.createNonceStr(),
//             notify_url : obj.notify_url,// 微信付款后的回调地址
//             openid : this.userInfo.openid,
//             out_trade_no : obj.out_trade_no,//new Date().getTime(), //订单号
//             spbill_create_ip : obj.spbill_create_ip,
//             total_fee : obj.total_fee,
//             trade_type : 'JSAPI',
//             // sign : getSign(),
//         };
//         // 返回 promise 对象
//         return  new Promise(function (resolve, reject) {
//             // 获取 sign 参数
//             UnifiedorderParams.sign = that.getSign(UnifiedorderParams);
//             const url = 'https://api.mch.weixin.qq.com/pay/unifiedorder';
//             request.post({url : url, body:JSON.stringify(that.getUnifiedorderXmlParams(UnifiedorderParams))}, function (error, response, body) {
//                 let prepay_id = '';
//                 if (!error && response.statusCode == 200) {
//                     // 微信返回的数据为 xml 格式， 需要装换为 json 数据， 便于使用
//                     xml2jsparseString(body, {async:true}, function (error, result) {
//                         prepay_id = result.xml.prepay_id[0];
//                         // 放回数组的第一个元素
//                         resolve(prepay_id);
//                     });
//                 } else {
//                     reject(body);
//                 }
//             });
//         })
//     }
//     /**
//      * 获取微信支付的签名
//      * @param payParams
//      */
//     getSign(signParams){
//         // 按 key 值的ascll 排序
//         let keys = Object.keys(signParams);
//         keys = keys.sort();
//         const newArgs = {};
//         keys.forEach(function (val, key) {
//             if (signParams[val]){
//                 newArgs[val] = signParams[val];
//             }
//         })
//         const string = queryString.stringify(newArgs)+'&key='+config.wxpaykey;
//         // 生成签名
//         return crypto.createHash('md5').update(queryString.unescape(string), 'utf8').digest("hex").toUpperCase();
//     }
//     /**
//      * 微信支付的所有参数
//      * @param req 请求的资源, 获取必要的数据
//      * @returns {{appId: string, timeStamp: Number, nonceStr: *, package: string, signType: string, paySign: *}}
//      */
//     getBrandWCPayParams( obj, callback ){
//         const that = this;
//         const prepay_id_promise = that.getPrepayId(obj);
//         prepay_id_promise.then(function (prepay_id) {
//             const prepay_id = prepay_id;
//             const wcPayParams = {
//                 "appId" : config.wxappid,     //公众号名称，由商户传入
//                 "timeStamp" : parseInt(new Date().getTime() / 1000).toString(),         //时间戳，自1970年以来的秒数
//                 "nonceStr" : that.createNonceStr(), //随机串
//                 // 通过统一下单接口获取
//                 "package" : "prepay_id="+prepay_id,
//                 "signType" : "MD5",         //微信签名方式：
//             };
//             wcPayParams.paySign = that.getSign(wcPayParams); //微信支付签名
//             callback(null, wcPayParams);
//         },function (error) {
//             callback(error);
//         });
//     }
//     /**
//      * 获取随机的NonceStr
//      */
//     createNonceStr() {
//         return Math.random().toString(36).substr(2, 15);
//     };
//     /**
//      * 获取微信的 AccessToken
//      */
//     getAccessToken(obj, cb){
//         const that = this;
//         const getAccessTokenUrl = "https://api.weixin.qq.com/sns/oauth2/access_token?appid="+config.wxappid+"&secret="+config.wxappsecret+"&code="+that.userInfo.code+"&grant_type=authorization_code";
//         request.post({url : getAccessTokenUrl}, function (error, response, body) {
//             if (!error && response.statusCode == 200){
//                 if (40029 == body.errcode) {
//                     cb(error, body);
//                 } else {
//                     body = JSON.parse(body);
//                     that.userInfo.access_token = body.access_token;
//                     that.userInfo.expires_in = body.expires_in;
//                     that.userInfo.refresh_token = body.refresh_token;
//                     that.userInfo.openid = body.openid;
//                     that.userInfo.scope = body.scope;
//                     // console.log(that.userInfo);
//                     // 拼接微信的支付的参数
//                     that.getBrandWCPayParams(obj, function (error, responseData) {
//                         if (error) {
//                             cb(error);
//                         } else {
//                             cb(null, responseData);
//                         }
//                     });
//                 }
//             } else {
//                 cb(error);
//             }
//         });
//     }
// }
// module.exports = WechatPay;
