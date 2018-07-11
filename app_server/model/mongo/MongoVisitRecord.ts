import * as Mongoose from "mongoose";
import { IClickRate } from "../../interface/mongomodel/IClickRate";
const MongoVisitRecordModel = new Mongoose.Schema({
    pid:Number,
    lid:Number,
    ldate:String
});
export const MongoVisitRecord = Mongoose.model<IClickRate>('clickrate', MongoVisitRecordModel);
export default MongoVisitRecord;