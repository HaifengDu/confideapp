import * as Mongoose from "mongoose";
import { IClickRate } from "../../interface/mongomodel/IClickRate";
const MongoClickRateModel = new Mongoose.Schema({
    pid:Number,
    lid:Number,
    ldate:String
});
const MongoClickRate = Mongoose.model<IClickRate>('clickrate', MongoClickRateModel);
export default MongoClickRate;