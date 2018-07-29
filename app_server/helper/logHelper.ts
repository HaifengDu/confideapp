import * as log4js from "log4js";

export class LogHelper {

    private static _instance: LogHelper;
    
    private orderLogger:log4js.Logger;
    private commonLogger:log4js.Logger;

    public static configure(){
        log4js.configure({
            appenders:{
                common:{type: 'dateFile', filename: './log/common/server_confide.log'},
                order:{type:'dateFile',filename:"./log/order/order.log"}
            },
            categories:{
                default:{appenders: [ 'common' ], level: 'debug'},
                order:{appenders:["order"],level:"debug"}
            }
        });
    }

    private constructor() {
        this.configure();
    }

    private configure(){
        this.commonLogger = log4js.getLogger("common");
        this.orderLogger = log4js.getLogger("order");
    }

    private addDate(obj:any){
        if(obj){
            obj.date = new Date();
        }
    }

    public appendOrder(obj:any){
        this.addDate(obj);
        this.orderLogger.log(JSON.stringify(obj));
    }

    public errorOrder(obj:any){
        this.addDate(obj);
        this.orderLogger.error(JSON.stringify(obj));
    }

    public append(obj:any){
        this.addDate(obj);
        this.commonLogger.log(JSON.stringify(obj));
    }

    public error(obj:any){
        this.addDate(obj);
        this.commonLogger.error(JSON.stringify(obj));
    }

    static createInstance() {
        LogHelper.getInstance();
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }
}
export default LogHelper;