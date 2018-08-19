import { IEvaluate } from "../../interface/model/IEvaluate";

export interface IEvaluateModel{
    timerate:number,
    serviceattitude:number,
    servicepower:number,
    applauserate?:number,
    labels?:{text:string,count:number}[]
}
export default IEvaluateModel;