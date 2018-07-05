import EChatMsgStatus from "../../enum/EChatMsgStatus";
import * as Mongoose  from "mongoose";
import { EChatMsgType } from "../../enum/EChatMsgType";
export interface IOnlyChatRecord{
    senduid:number,
    touid:number,
    roomid:string,
    msg?:string,
    mediaid?:string,
    type?:EChatMsgType,
    isload?:boolean,
    date:Date,
    status:EChatMsgStatus
}

export interface IChatRecord extends IOnlyChatRecord,Mongoose.Document{
}
export default IChatRecord;