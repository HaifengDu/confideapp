import * as Mongoose from "mongoose";
import { IMongoSortFilterModel } from "../../interface/mongomodel/IMongoSortFilterModel";
const MongoSortFilterModelSchema = new Mongoose.Schema({
    uid:Number,
    generalprice:Number,
    auth:Boolean,
    praisepercent:Number,
    minprice:Number,
    sex:Number,
    family:Number,
    birthday:Date,
    edu:Number,
    sealtimes:Number,
    receivestatus:Number,
    labelids:Mongoose.SchemaTypes.Array
});
const MongoSortFilterModel = Mongoose.model<IMongoSortFilterModel>('sortfiltermodel', MongoSortFilterModelSchema);
export default MongoSortFilterModel;