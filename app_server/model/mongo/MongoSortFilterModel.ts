import * as Mongoose from "mongoose";
import { IMongoSortFilterModel } from "../../interface/mongomodel/IMongoSortFilterModel";
const MongoSortFilterModelSchema = new Mongoose.Schema({
    uid:Number,
    generalprice:Number,//起步价
    address:Number,
    auth:Boolean,//认证
    praisepercent:Number,//好评率
    sex:Number,//性别
    family:Number,//家庭状况
    birthday:Date,
    edu:Number,
    sealtimes:Number,//已售时长
    receivestatus:Number,//接受状态
    labelids:Array//标签
});
const MongoSortFilterModel = Mongoose.model<IMongoSortFilterModel>('sortfiltermodel', MongoSortFilterModelSchema);
export default MongoSortFilterModel;