import { IUser } from "./IUser";
import { EAuthStatus } from "../../enum/EAuthStatus";
import { ERecieveStatus } from "../../enum/ERecieveStatus";

export interface IListener{
    id?:number,
    uid?:number,
    job?:number,
    family?:number,
    edu?:number,
    labelids?:string|any[],
    labeldesc?:string|any[],
    expids?:string|any[],
    expdesc?:string|any[],
    recievestatus?:ERecieveStatus,
    isopentime?:number,
    certificateurls?:string,
    authstatus:EAuthStatus,
    user:IUser,
}
export default IListener;