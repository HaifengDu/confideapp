import * as Mongoose from "mongoose";
import { IChatRecord } from "../../interface/mongomodel/IChatRecord";
const MongoChatModel = new Mongoose.Schema({
    tokenid:String,
    senduid:Number,
    touid:Number,
    roomid:String,
    msg:String,
    serverId:String,
    type:Number,
    isload:Boolean,
    date:Date,
    status:Number
});
const MongoChatRecord = Mongoose.model<IChatRecord>('chatrecord', MongoChatModel);
export default MongoChatRecord;