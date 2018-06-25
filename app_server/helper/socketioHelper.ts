// tslint:disable-next-line:no-unused-expression
import * as crypto from "crypto";
import MongoCheckRecord from "../model/mongo/MongoCheckModel";

export = class SocketHelper {
    private socketio:SocketIO.Server;
    private static _instance: SocketHelper;

    private readonly chatPath = "/chat";
    
    private readonly joinEvent = "join";
    private readonly sendEvent = "send";
    private constructor(socketio:SocketIO.Server) {
        this.socketio = socketio;
        this.initEvent();
        MongoCheckRecord.create({senduid:1,touid:2,roomid:"123123123123",msg:"测试",date:new Date(),status:1})
    }

    private initEvent(){
        this.socketio.of(this.chatPath).on("connection",socket=>{
            // console.log("socket get new connnection");   
            const roomid = socket.handshake.query.roomid;
            if(!roomid){
                socket.disconnect();
                return;
            }
            socket.join(roomid);
            socket.on(this.joinEvent,name=>{
                socket.to(roomid).broadcast.emit(this.joinEvent,`${name}加入房间`);   
            });
            socket.on(this.sendEvent,msg=>{
                socket.to(roomid).broadcast.emit(this.sendEvent,msg);
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

