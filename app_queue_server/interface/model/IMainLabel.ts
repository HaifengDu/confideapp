import { ELabelCType, ELabelSType } from "../../enum/ELabelType";
import { ELabelStatus } from "../../enum/ELabelStatus";
import EListenerLabelStatus from "../../enum/EListenerLabelStatus";

export interface IMainLabel{
    id?:number,
    name:string,
    ctime?:number,
    cuid?:number,
    ctype?:ELabelCType,
    stype?:ELabelSType,
    status?:ELabelStatus
}

export interface IListenLabel extends IMainLabel{
    desc?:string,
    lsstatus?:EListenerLabelStatus
}
export default IMainLabel;