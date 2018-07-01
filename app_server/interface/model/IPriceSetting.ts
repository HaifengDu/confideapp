import { EPriceCircle } from "../../enum/EPriceCircle";
import { EPriceStatus } from "../../enum/EPriceStatus";

export interface IPriceSetting{
    id?:number,
    uid?:number,
    type?:EPriceCircle,
    timecircle?:EPriceCircle,
    price?:Number,
    taxprice?:Number,
    status?:EPriceStatus
}
export default IPriceSetting;