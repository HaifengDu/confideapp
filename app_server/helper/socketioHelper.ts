// tslint:disable-next-line:no-unused-expression
import { ERole } from "../enum/ERole";
import { ChatSocket } from "../controller/ChatSocket";

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
            const role = socket.handshake.query.role === "0"?ERole.Pourouter:ERole.Listener;
            ChatSocket.getInstance(socket,role);
        });
        this.socketio.on("connect",socket=>{
            console.log("socket connect");
        });
    }

    static createInstance(socketio:SocketIO.Server) {
        SocketHelper.getInstance(socketio);
    }

    static getInstance(socketio:SocketIO.Server) {
        return this._instance || (this._instance = new this(socketio));
    }

}

