import { EHelpStatus } from "../../enum/EHelpStatus";
import { IHelpRecieve } from "./IHelpRecieve";

export interface IHelp{
    id?:number,
    uid?:number,
    content?:string,
    labelid?:number|string,
    status?:EHelpStatus,
    money?:number|string,
    recieveid?:number,
    accept?:IHelpRecieve
}
export default IHelp;