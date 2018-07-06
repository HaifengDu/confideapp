import { IErrorMsg } from "../interface/IErrorMsg";

const errMsg = "服务器内部错误,请稍后重试";
export default class ErrorMsg implements IErrorMsg{
    private static readonly isDebug = true;
    constructor(public success=true,public message?:string,err?:Error){
        if(ErrorMsg.isDebug){
            //this.msg = "服务器内部错误";
            //写入日志；
            if(!this.message&&!this.success){
                this.message = errMsg;
            }
        }else{
            if(this.success===false&&err.stack){
                this.message = errMsg;
            }
        }
    }
}