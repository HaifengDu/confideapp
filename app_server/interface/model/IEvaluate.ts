import { EEvaluateStatus } from "../../enum/EEvaluateStatus";
import EEvaluateType from "../../enum/EEvaluateType";

export interface IEvaluate{
    id?:number;
    uid?:number;
    lid?:number;
    default?:EEvaluateType;
    orderid?:number;
    timerate?:number|string;
    serviceattitude?:number|string;
    servicepower?:number|string;
    satisfaction?:number;
    labels?:string|string[];
    totalrate?:number;
    status:EEvaluateStatus
    leavemessage?:string;
    replymessage?:string;
}
export default IEvaluate;