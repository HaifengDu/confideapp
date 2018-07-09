"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errMsg = "服务器内部错误,请稍后重试";
class ErrorMsg {
    constructor(success = true, message, err) {
        this.success = success;
        this.message = message;
        if (ErrorMsg.isDebug) {
            //this.msg = "服务器内部错误";
            //写入日志；//错误没有信息，添加默认信息
            if (!this.message && !this.success) {
                this.message = errMsg;
            }
        }
        else {
            //线上有错误栈 直接赋值全局错误
            if (this.success === false && err && err.stack) {
                this.message = errMsg;
            }
        }
    }
}
ErrorMsg.isDebug = true;
exports.default = ErrorMsg;
