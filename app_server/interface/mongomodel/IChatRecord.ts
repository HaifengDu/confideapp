import EChatMsgStatus from "../../enum/EChatMsgStatus";
import * as Mongoose  from "mongoose";

export interface IChatRecord extends Mongoose.Document{
    senduid:number,
    touid:number,
    roomid:string,
    msg:string,
    date:Date,
    status:EChatMsgStatus
}
export default IChatRecord;