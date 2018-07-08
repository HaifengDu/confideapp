import MongoChatRecord from "../model/mongo/MongoChatModel";
import * as Bluebird from "bluebird";
import ErrorMsg from "../model/ErrorMsg";
import { ObjectID } from "bson";
import { EChatMsgType } from "../enum/EChatMsgType";
import WinxinHelper from "../helper/winxinHelper";

export default class ChatSyncService {

    private static _instance: ChatSyncService;
    private winxinHelper:WinxinHelper;

    private constructor() {
        this.winxinHelper = WinxinHelper.getInstance();
    }

    public syncAudio(ids:string[]){
        if(!ids||!ids.length){
            return Bluebird.reject(new ErrorMsg(false,"参数不能为空"));
        }
        const objIds = ids.map(item=>new ObjectID(item));
        MongoChatRecord.find({
            "_id":{
                "$in":objIds
            }
        }).then(res=>{
            if(res.length){
                const list = res.filter(item=>item.type===EChatMsgType.Audio&&!item.isload&&item.mediaid);
                this.winxinHelper.getAccessToken().then(res=>{
                    Promise.all(list.map(item=>{
                        return this.winxinHelper.downLoadFile(res.access_token,item.roomid,item.mediaid).then(data=>{
                            return MongoChatRecord.update({
                                isload:true
                            },{
                                _id:item._id
                            });
                        });
                    }));
                })
            }
        });
    }

    static createInstance() {
        ChatSyncService.getInstance();
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

}