import { EEvaluateStatus } from "../../enum/EEvaluateStatus";

export interface IEvaluate{
    id?:number;
    uid?:number;
    lid?:number;
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