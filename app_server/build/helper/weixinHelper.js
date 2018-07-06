"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
const wxconfig = require("../../config/wxconfig.json");
const appid = wxconfig.appid;
const appsecret = wxconfig.appsecret;
class WeixinHelper {
    static getAccesstoken(code) {
        if (!code) {
            return Promise.reject({ message: "code不能为空" });
        }
        return new Promise((resolve, reject) => {
            request(`https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appid}&secret=${appsecret}&code=${code}&grant_type=authorization_code`, function (err, response) {
                if (err) {
                    reject(err);
                    return;
                }
                if (response.statusCode != 200) {
                    reject({ success: false, message: "返回状态:" + response.statusCode });
                    return;
                }
                let body = response.body;
                let isError = false;
                try {
                    body = JSON.parse(response.body);
                }
                catch (e) {
                    isError = true;
                }
                if (isError) {
                    reject({ success: false, message: "解析出错" });
                    return;
                }
                resolve(body);
            });
        });
    }
    static getUserinfoByCode(code) {
        return this.getAccesstoken(code).then(res => this.getUserinfo(res.access_token, res.openid));
    }
    static getUserinfo(accesstoken, openid) {
        if (!accesstoken) {
            return Promise.reject({ message: "accesstoken不能为空" });
        }
        if (!openid) {
            return Promise.reject({ message: "openid不能为空" });
        }
        return new Promise((resolve, reject) => {
            request(`https://api.weixin.qq.com/sns/userinfo?access_token=${accesstoken}&openid=${openid}&lang=zh_CN`, function (err, response) {
                if (err) {
                    reject(err);
                    return;
                }
                if (response.statusCode != 200) {
                    reject({ success: false, message: "返回状态:" + response.statusCode });
                    return;
                }
                let body = response.body;
                let isError = false;
                try {
                    body = JSON.parse(response.body);
                }
                catch (e) {
                    isError = true;
                }
                if (isError) {
                    reject({ success: false, message: "解析出错" });
                    return;
                }
                resolve(body);
            });
        });
    }
}
exports.default = WeixinHelper;
