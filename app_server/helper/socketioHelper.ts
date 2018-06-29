// tslint:disable-next-line:no-unused-expression
import * as crypto from "crypto";
import MongoChatRecord from "../model/mongo/MongoChatModel";
import { IOnlyChatRecord, IChatRecord } from "../interface/mongomodel/IChatRecord";
import { EChatMsgStatus } from "../enum/EChatMsgStatus";
import { retryInsertMongo } from "./util";

export = class SocketHelper {
    private socketio:SocketIO.Server;
    private static _instance: SocketHelper;
    private static readonly RETRY_COUNT = 5;
    private static readonly MAX_MSG_LENGTH = 100;
    private readonly chatPath = "/chat";
    
    private readonly joinEvent = "join";
    private readonly sendEvent = "send";
    private roomDic:{[index:string]:Array<IOnlyChatRecord>}={};
    private constructor(socketio:SocketIO.Server) {
        this.socketio = socketio;
        this.initEvent();
    }

    private initEvent(){
        this.socketio.of(this.chatPath).on("connection",socket=>{
            // console.log("socket get new connnection");   
            const roomid = socket.handshake.query.roomid;
            const senduid = socket.handshake.query.senduid;
            const touid = socket.handshake.query.touid;
            if(!roomid||!senduid||!touid){
                socket.disconnect(true);
                return;
            }
            socket.join(roomid);
            if(!this.roomDic[roomid]){
                this.roomDic[roomid] = [];
            }
            socket.on(this.joinEvent,name=>{
                socket.to(roomid).broadcast.emit(this.joinEvent,`${name}加入房间`);   
            });
            socket.on(this.sendEvent,msg=>{
                this.roomDic[roomid].push({
                    roomid,
                    senduid,
                    touid,
                    msg,
                    date:new Date(),
                    status:EChatMsgStatus.Send
                });
                //当消息长度大于最大限制时，插入库中并删除
                if(this.roomDic[roomid].length>=SocketHelper.MAX_MSG_LENGTH){
                    setTimeout(()=>{
                        retryInsertMongo(SocketHelper.RETRY_COUNT)(MongoChatRecord,<IChatRecord[]>this.roomDic[roomid],(err,docs)=>{
                           this.roomDic[roomid].splice(0,SocketHelper.MAX_MSG_LENGTH); 
                        });
                    });
                }
                socket.to(roomid).broadcast.emit(this.sendEvent,msg);
            });
            socket.on('disconnect', (reason) => {
                if(this.roomDic[roomid].length){
                    retryInsertMongo(SocketHelper.RETRY_COUNT)(MongoChatRecord,<IChatRecord[]>this.roomDic[roomid],(err,docs)=>{
                        delete this.roomDic[roomid];
                    });
                }
            });
            socket.on("error",()=>{
                delete this.roomDic[roomid];
            });       
        });
        this.socketio.on("connect",socket=>{
            console.log("socket connect");
        })
    }

    public createRoom(source,target){
        const hashCode = crypto.createHash('sha1');
        const roomid = hashCode.update(`${source}_${target}`, 'utf8').digest('hex');
        return roomid;
    }

    static createInstance(socketio:SocketIO.Server) {
        SocketHelper.getInstance(socketio);
    }

    static getInstance(socketio:SocketIO.Server) {
        return this._instance || (this._instance = new this(socketio));
    }

}

