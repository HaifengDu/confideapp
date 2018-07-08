import * as Mongoose from "mongoose";

export interface IOnlyClickRate{
    pid:number//倾诉者
    lid:number//倾听者
    ldate:Date//最后点击时间
}

export interface IClickRate extends IOnlyClickRate,Mongoose.Document{}
export default IClickRate