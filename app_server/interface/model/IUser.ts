import { ERoleStatus } from "../../enum/ERoleStatus";
import { EBindPhoneStatus } from "../../enum/EBindPhoneStatus";

export interface IUser{
    id?:number,
    weixinid?:string,
    sex?:number,
    birthday?:string,
    address?:string,
    role?:number,
    status?:ERoleStatus,
    follow?:string,
    nickname?:string
    headimgurl?:string,
    resume?:string,
    phone?:string,
    phonebindstatus?:EBindPhoneStatus
}
export default IUser;