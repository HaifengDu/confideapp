"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
const crypto = require("crypto");
const objectHelper_1 = require("./objectHelper");
const ErrorMsg_1 = require("../model/ErrorMsg");
const SERVER_URL = "https://api.netease.im/sms/sendcode.action";
const APP_KEY = "bb2a6dc8d4531caefdf8ed83f7c0921a";
const APP_SECRET = "5f96e8914778";
const NONCE = "123456";
const TEMPLATEID = "4132052";
const CODELEN = "6";
class MailHelper {
    constructor() {
        this.maxTime = 5 * 60 * 1000;
    }
    checkCode(source, checkModel) {
        if (!source || !source.code || !source.date || !checkModel || !checkModel.code) {
            return new ErrorMsg_1.default(false, "参数非法");
        }
        if (Date.now() > source.date + this.maxTime) {
            return new ErrorMsg_1.default(false, "验证码过期");
        }
        if (source.phone.toString() === checkModel.phone.toString() && source.code.toString() === checkModel.code.toString()) {
            return new ErrorMsg_1.default(true);
        }
        return new ErrorMsg_1.default(false, "验证码错误");
    }
    getCode(mobile) {
        const curTime = Date.now() / 1000;
        const array = [APP_SECRET, NONCE, curTime];
        const hashCode = crypto.createHash('sha1');
        const checkSum = hashCode.update(array.join(""), 'utf8').digest('hex');
        return new Promise((resolve, reject) => {
            request(SERVER_URL, {
                headers: {
                    AppKey: APP_KEY,
                    Nonce: NONCE,
                    CurTime: curTime,
                    CheckSum: checkSum,
                    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
                },
                form: {
                    templateid: TEMPLATEID,
                    mobile: mobile,
                    codeLen: CODELEN
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
                        let codeobj = {
                            code: result.obj,
                            date: Date.now(),
                            phone: mobile
                        };
                        resolve(codeobj);
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
    static createInstance() {
        MailHelper.getInstance();
    }
    static getInstance() {
        return this._instance || (this._instance = new this());
    }
}
exports.default = MailHelper;
