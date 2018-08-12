// tslint:disable-next-line:no-unused-expression
import { ERole } from "../enum/ERole";
import { ChatSocket } from "../controller/ChatSocket";
import SocketMananger from "../controller/SocketManger";
import { NetCallSocket } from "../controller/NetCallSocket";
import { OrderSocket } from "../controller/OrderSocket";
const socketManager = SocketMananger.getInstance();
export = class SocketHelper {
    private socketio:SocketIO.Server;
    private static _instance: SocketHelper;
    private readonly chatPath = "/chat";
    private readonly orderPath = "/order";
    private constructor(socketio:SocketIO.Server) {
        this.socketio = socketio;
        this.initEvent();
        this.initOrderEvent();
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
            socket.on("close",()=> {
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

    /**
     * 初始化order socket
     */
    private initOrderEvent(){
        this.socketio.of(this.orderPath).on("connection",socket=>{
            //
            let uid = socket.handshake.query.uid;
            if(uid){
                OrderSocket.getInstance(socket,parseInt(uid));
            }
        });
        this.socketio.on("connect",socket=>{
            console.log("socket connect");
        });
        this.socketio.on('close',socket=>{
            console.log("socket close");
        });
        this.socketio.on('error',()=>{
            console.log("socket error");
        });
    }

    static createInstance(socketio:SocketIO.Server) {
        SocketHelper.getInstance(socketio);
    }

    static getInstance(socketio:SocketIO.Server) {
        return this._instance || (this._instance = new this(socketio));
    }

}

