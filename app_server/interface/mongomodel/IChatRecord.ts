import EChatMsgStatus from "../../enum/EChatMsgStatus";
import * as Mongoose  from "mongoose";
export interface IOnlyChatRecord{
    senduid:number,
    touid:number,
    roomid:string,
    msg:string,
    date:Date,
    status:EChatMsgStatus
}

export interface IChatRecord extends IOnlyChatRecord,Mongoose.Document{
}
export default IChatRecord;