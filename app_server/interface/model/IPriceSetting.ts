import { EPriceCircle } from "../../enum/EPriceCircle";
import { EPriceStatus } from "../../enum/EPriceStatus";

export interface IPriceSetting{
    id?:number,
    uid?:number,
    type?:EPriceCircle,
    timecircle?:EPriceCircle,
    price?:number,
    taxprice?:number,
    status?:EPriceStatus
}
export default IPriceSetting;