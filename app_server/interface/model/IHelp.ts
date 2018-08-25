import { EHelpStatus } from "../../enum/EHelpStatus";
import { IHelpRecieve } from "./IHelpRecieve";

export interface IHelp{
    id?:number,
    uid?:number,
    content?:string,
    labelid?:number,
    status?:EHelpStatus,
    money?:number,
    recieveid?:number,
    accept:IHelpRecieve
}
export default IHelp;