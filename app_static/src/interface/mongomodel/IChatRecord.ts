import EChatMsgStatus from "../../enum/EChatMsgStatus";
import { EChatMsgType } from "../../enum/EChatMsgType";
export interface IOnlyChatRecord{
    tokenid?:string,
    senduid:number,
    touid:number,
    roomid:string,
    msg?:string,
    mediaid?:string,
    type?:EChatMsgType,
    isload?:boolean,
    date:Date,
    status:EChatMsgStatus
}

export default IOnlyChatRecord;