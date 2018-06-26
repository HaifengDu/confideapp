import { ERoleStatus } from "../../enum/ERoleStatus";
import { EBindPhoneStatus } from "../../enum/EBindPhoneStatus";
import { ERole } from "../../enum/ERole";

export interface IUser{
    id?:number,
    weixinid?:string,
    sex?:number,
    birthday?:string,
    address?:string,
    role?:ERole,
    status?:ERoleStatus,
    follow?:string,
    nickname?:string
    headimgurl?:string,
    resume?:string,
    phone?:string,
    phonebindstatus?:EBindPhoneStatus
}
export default IUser;