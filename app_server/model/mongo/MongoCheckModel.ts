import * as Mongoose from "mongoose";
import { IChatRecord } from "../../interface/mongomodel/IChatRecord";
const MongoCheckModel = new Mongoose.Schema({
    senduid:Number,
    touid:Number,
    roomid:String,
    msg:String,
    date:Date,
    status:Number
});
const MongoCheckRecord = Mongoose.model<IChatRecord>('chatrecord', MongoCheckModel);
export default MongoCheckRecord;