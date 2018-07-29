"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
const crypto = require("crypto");
const util_1 = require("./util");
const objectHelper_1 = require("./objectHelper");
const { APP_KEY, APP_SECRET } = require("../../config/neteaseconfig.json");
class NeteaseHelper {
    constructor() {
    }
    static createInstance() {
        NeteaseHelper.getInstance();
    }
    getToken(uid) {
        const curTime = Date.now() / 1000;
        const nonce = util_1.createNonceStr();
        const array = [APP_SECRET, nonce, curTime];
        const hashCode = crypto.createHash('sha1');
        const checkSum = hashCode.update(array.join(""), 'utf8').digest('hex');
        return new Promise((resolve, reject) => {
            request(NeteaseHelper.TOKEN_URL, {
                headers: {
                    AppKey: APP_KEY,
                    Nonce: nonce,
                    CurTime: curTime,
                    CheckSum: checkSum,
                    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
                },
                form: {
                    accid: uid.toString()
                },
                method: "post"
            }, (err, res) => {
                //
                if (err) {
                    reject(err);
                    return;
                }
                if (res.statusCode === 200) {
                    let result = objectHelper_1.default.parseJSON(res.body);
                    if (result) {
                        if (result.code === 200) {
                            resolve(result.info);
                        }
                        else {
                            reject(result);
                        }
                    }
                    else {
                        reject({
                            success: false,
                            message: "解析出错"
                        });
                    }
                }
                else {
                    reject({
                        success: false,
                        message: res.statusCode
                    });
                }
            });
        });
    }
    static getInstance() {
        return this._instance || (this._instance = new this());
    }
}
NeteaseHelper.TOKEN_URL = "https://api.netease.im/nimserver/user/create.action";
exports.default = NeteaseHelper;
