import { EChatMsgType } from "../enum/EChatMsgType";

export interface IChatModel{
    pid:number,
    lid:number,
    msg?:string,
    mediaid?:string,
    type:EChatMsgType
}

export default IChatModel;