import { EGeneralStatus } from "../../enum/EGeneralStatus";
import { EGeneralPosition } from "../../enum/EGeneralPosition";
import IListener from "./IListener";

export interface IGeneralSetting{
    id?:number,
    uid?:number,
    position?:EGeneralPosition,
    price?:number,
    status?:EGeneralStatus,
    listener:IListener
}
export default IGeneralSetting;