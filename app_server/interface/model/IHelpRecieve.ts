import { EHelpRecieveStatus } from "../../enum/EHelpRecieveStatus";

export interface IHelpRecieve{
    id?:number,
    helpid?:number,
    content?:string,
    uid?:number,
    likecount?:number,
    recieveid?:number,
    status?:EHelpRecieveStatus,
    recieved:IHelpRecieve,
    next:IHelpRecieve,
    prev:IHelpRecieve
}
export default IHelpRecieve;