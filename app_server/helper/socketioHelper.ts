// tslint:disable-next-line:no-unused-expression
import { ERole } from "../enum/ERole";
import { ChatSocket } from "../controller/ChatSocket";
import SocketMananger from "../controller/SocketManger";
import { NetCallSocket } from "../controller/NetCallSocket";
const socketManager = SocketMananger.getInstance();
export = class SocketHelper {
    private socketio:SocketIO.Server;
    private static _instance: SocketHelper;
    private readonly chatPath = "/chat";
    private constructor(socketio:SocketIO.Server) {
        this.socketio = socketio;
        this.initEvent();
    }

    private initEvent(){
        this.socketio.of(this.chatPath).on("connection",socket=>{
            let uid = socket.handshake.query.uid;
            if(uid){
                ChatSocket.getInstance(socket);
                NetCallSocket.getInstance(socket);
            }
            socket.on("disconnect",()=>{
                socketManager.remove(socket);
            });
            socketManager.add(uid,socket);
        });
        this.socketio.on("connect",socket=>{
            console.log("socket connect");
        });
        this.socketio.on('close',socket=>{
            socketManager.clear();
        });
        this.socketio.on('error',()=>{
            socketManager.clear();
        });
    }

    static createInstance(socketio:SocketIO.Server) {
        SocketHelper.getInstance(socketio);
    }

    static getInstance(socketio:SocketIO.Server) {
        return this._instance || (this._instance = new this(socketio));
    }

}

