// tslint:disable-next-line:no-unused-expression
import * as crypto from "crypto";
import MongoChatRecord from "../model/mongo/MongoChatModel";
import { IOnlyChatRecord, IChatRecord } from "../interface/mongomodel/IChatRecord";
import { EChatMsgStatus } from "../enum/EChatMsgStatus";
import { retryInsertMongo } from "./util";
import { ERole } from "../enum/ERole";
import EChatMsgType from "../enum/EChatMsgType";
import _ = require("lodash");

export = class SocketHelper {
    private socketio:SocketIO.Server;
    private static _instance: SocketHelper;
    private static readonly RETRY_COUNT = 5;
    private static readonly MAX_MSG_LENGTH = 100;
    private readonly chatPath = "/chat";
    
    private readonly joinEvent = "join";
    private readonly sendEvent = "send";
    private readonly notifyEvent = "notify";
    private readonly createOwnRoom = "createOwn";
    private constructor(socketio:SocketIO.Server) {
        this.socketio = socketio;
        this.initEvent();
    }

    private initEvent(){
        this.socketio.of(this.chatPath).on("connection",socket=>{
            const roomDic:{[index:string]:Array<IOnlyChatRecord>}={};
            const role = socket.handshake.query.role === "0"?ERole.Pourouter:ERole.Listener;
            // socket.on()
            socket.on(this.joinEvent,(res)=>{
                const pid = res.pid;//倾诉者
                const lid = res.lid;//倾听者
                const roomid = this.createRoom(pid,lid);
                socket.join(roomid);
                socket.to(roomid).broadcast.emit(this.joinEvent,{msg:`${name}加入房间`,roomid});   
            });
            socket.on(this.sendEvent,res=>{
                let tempsenduid = res.pid;
                let temptouid = res.lid;
                if(role===ERole.Listener){
                    tempsenduid = res.lid;
                    temptouid = res.pid;
                }
                const roomid = this.createRoom(res.pid,res.lid);
                const msgObj:IOnlyChatRecord = {
                    roomid,
                    senduid:tempsenduid,
                    touid:temptouid,
                    date:new Date(),
                    status:EChatMsgStatus.Send,
                    type:EChatMsgType.Text,
                    msg:res.msg
                }
                if(res.type===EChatMsgType.Audio){
                    msgObj.isload=false;
                    msgObj.mediaid = res.mediaid;
                    msgObj.type = EChatMsgType.Audio
                }
                roomDic[roomid].push(msgObj);
                //当消息长度大于最大限制时，插入库中并删除
                if(roomDic[roomid].length>=SocketHelper.MAX_MSG_LENGTH){
                    setTimeout(()=>{
                        const shouldInsertedRecord = roomDic[roomid].splice(0,SocketHelper.MAX_MSG_LENGTH);
                        retryInsertMongo(SocketHelper.RETRY_COUNT)(MongoChatRecord,<IChatRecord[]>shouldInsertedRecord);
                    });
                }
                socket.to(roomid).broadcast.emit(this.sendEvent,msgObj);
                //去指定的用户通知
                socket.to(temptouid).broadcast.emit(this.notifyEvent,msgObj);
            });
            socket.on('disconnect', (reason) => {
                const values = _.values(roomDic);
                const records = _.flatten(values);
                if(records.length){
                    retryInsertMongo(SocketHelper.RETRY_COUNT)(MongoChatRecord,<IChatRecord[]>records,(err,docs)=>{
                        for(let key in roomDic){
                            delete roomDic[key];
                        }
                    });
                }
            });
            socket.on("leave",(res)=>{
                const roomid = res.roomid;
                if(roomid){
                    socket.leave(roomid);
                    if(roomDic[roomid]&&roomDic[roomid].length){
                        retryInsertMongo(SocketHelper.RETRY_COUNT)(MongoChatRecord,<IChatRecord[]>roomDic[roomid],(err,docs)=>{
                            delete roomDic[roomid];
                        });
                    }
                }
            });
            socket.on("error",()=>{
                for(let key in roomDic){
                    delete roomDic[key];
                }
            });       
        });
        this.socketio.on("connect",socket=>{
            console.log("socket connect");
        })
    }

    public createRoom(source:number,target:number){
        return source+"_"+target;
    }

    static createInstance(socketio:SocketIO.Server) {
        SocketHelper.getInstance(socketio);
    }

    static getInstance(socketio:SocketIO.Server) {
        return this._instance || (this._instance = new this(socketio));
    }

}

