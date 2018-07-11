import * as Mongoose from "mongoose";
import { IClickRate } from "../../interface/mongomodel/IClickRate";
const MongoHomeClickRateModel = new Mongoose.Schema({
    pid:Number,
    lid:Number,
    ldate:String
});
const MongoHomeClickRate = Mongoose.model<IClickRate>('homeclickrate', MongoHomeClickRateModel);
export default MongoHomeClickRate;