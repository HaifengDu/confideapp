import { EEvaluateStatus } from "../../enum/EEvaluateStatus";
import EEvaluateType from "../../enum/EEvaluateType";
import { IUser } from "./IUser";
import { EEvaluateSatisfyStatus } from "../../enum/EEvaluateSatisfyStatus";

export interface IEvaluate{
    id?:number;
    uid?:number;
    lid?:number;
    default?:EEvaluateType;
    orderid?:number;
    timerate?:number|string;
    serviceattitude?:number|string;
    servicepower?:number|string;
    satisfaction?:EEvaluateSatisfyStatus;
    labels?:string|string[];
    totalrate?:number;
    status:EEvaluateStatus
    leavemessage?:string;
    replymessage?:string;
    user?:IUser
}
export default IEvaluate;