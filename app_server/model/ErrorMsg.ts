const errMsg:string = "服务器内部错误,请稍后重试";
export default class ErrorMsg{
    private static readonly isDebug = true;
    constructor(private success=true,private msg?:string){
        if(ErrorMsg.isDebug){
            //this.msg = "服务器内部错误";
            //写入日志；
            if(!this.msg&&!this.success){
                this.msg = errMsg;
            }
        }else{
            if(this.success===false){
                this.msg = errMsg;
            }
        }
    }
}