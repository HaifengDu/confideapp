import { IUser } from "./IUser";
import { ERoleStatus } from "../../enum/ERoleStatus";

export interface IListener{
    id?:number,
    uid?:number,
    job?:number,
    family?:number,
    edu?:number,
    labelids?:string,
    labeldesc?:string,
    expids?:string,
    expdesc?:string,
    recivestatus?:number,
    isopentime?:number,
    certificateurls?:string,
    user:IUser
}
export default IListener;