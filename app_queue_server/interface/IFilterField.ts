import { ESex } from "../enum/ESex";

export interface IFilterField{
    uid?:number,
    //开始位置
    start:number,
    //页数
    page:number,
    price?:{
        min:number,
        max:number
    }
    //是否认证
    auth?:boolean,
    //好评率
    // praisepercent?:number,
    //性别
    sex?:ESex,
    //家庭状态
    family?:number,
    //年龄
    age?:[number,number],
    //教育水平
    edu?:number,
    //已售时长
    // sealtimes?:number,
    //标签id
    labelid?:number,
    sort:"sealtimes"|"praisepercent"
}
export default IFilterField;