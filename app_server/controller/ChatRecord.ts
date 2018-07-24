import ErrorMsg from "../model/ErrorMsg";
import MongoChatRecord from "../model/mongo/MongoChatModel";
import { EChatMsgStatus } from "../enum/EChatMsgStatus";

export default class ChatRecordService {
    private readonly DEFAULT_LENGTH = 20;

    private static _instance: ChatRecordService;

    private constructor() {
    }

    public getRecord(roomid:string){
        if(!roomid){
            Promise.reject(new ErrorMsg(false,"roomid不能为空"));
        }
        return MongoChatRecord.find({
            roomid:roomid,
        }).sort({
            date:-1
        }).limit(this.DEFAULT_LENGTH).then(res=>{
            const list = res.filter(item=>item.status===EChatMsgStatus.Send);
            //找出未读，更新为已读
            if(list.length){
                MongoChatRecord.update({
                    _id:{
                        '$in':list.map(item=>item._id)
                    }
                },{
                    status:EChatMsgStatus.Readed
                });
            }
            return res;
        });
    }

    static createInstance() {
        ChatRecordService.getInstance();
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

}