import * as Mongoose from "mongoose";
import { IClickRate } from "../../interface/mongomodel/IClickRate";
const MongoFavoriteModel = new Mongoose.Schema({
    pid:Number,
    lid:Number,
    ldate:String
});
export const MongoFavorite = Mongoose.model<IClickRate>('favorite', MongoFavoriteModel);
export default MongoFavorite;