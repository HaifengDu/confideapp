import { EPriceCircle } from "../../enum/EPriceCircle";
import { EPriceStatus } from "../../enum/EPriceStatus";
import { EPriceType } from "../../enum/EPriceType";

export interface IPriceSetting{
    id?:number,
    uid?:number,
    type?:EPriceType,
    timecircle?:number,
    price?:number,
    taxprice?:number,
    status?:EPriceStatus
}
export default IPriceSetting;