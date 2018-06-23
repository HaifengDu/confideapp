import { IUser } from "./IUser";

export interface IListener{
    id?:number,
    uid?:number,
    job?:number,
    family?:number,
    edu?:number,
    maintitles?:string,
    recivestatus?:number,
    isopentime?:number,
    status:number,
    user:IUser
}
export default IListener;