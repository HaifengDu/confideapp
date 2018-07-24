import EChatMsgStatus from "../../enum/EChatMsgStatus";
import * as Mongoose  from "mongoose";
import { EChatMsgType } from "../../enum/EChatMsgType";
export interface IOnlyChatRecord{
    tokenid?:string,
    senduid:number,
    touid:number,
    roomid:string,
    msg?:string,
    serverId?:string,
    type?:EChatMsgType,
    isload?:boolean,
    date:Date,
    status:EChatMsgStatus
}

export interface IChatRecord extends IOnlyChatRecord,Mongoose.Document{
}
export default IChatRecord;