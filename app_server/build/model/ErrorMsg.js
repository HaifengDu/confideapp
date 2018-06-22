"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errMsg = "服务器内部错误,请稍后重试";
class ErrorMsg {
    constructor(success = true, msg) {
        this.success = success;
        this.msg = msg;
        if (ErrorMsg.isDebug) {
            //this.msg = "服务器内部错误";
            //写入日志；
            if (!this.msg && !this.success) {
                this.msg = errMsg;
            }
        }
        else {
            if (this.success === false) {
                this.msg = errMsg;
            }
        }
    }
}
ErrorMsg.isDebug = true;
exports.default = ErrorMsg;
