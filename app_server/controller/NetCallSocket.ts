import SocketMananger from "./SocketManger";
const socketMananger = SocketMananger.getInstance();

const eventkey_prefix = "netcall_";
class NetCallEventConstant{
    public static readonly calling = `${eventkey_prefix}calling`;
    public static readonly reject = `${eventkey_prefix}reject`;
    public static readonly close = `${eventkey_prefix}close`;
    public static readonly accept = `${eventkey_prefix}accept`;
    public static readonly hangup = `${eventkey_prefix}hangup`
}
export class NetCallSocket{
    constructor(private socket:SocketIO.Socket){
        this.initEvent();
    }

    private initEvent(){
        this.socket.on(NetCallEventConstant.calling,this.calling.bind(this));
        this.socket.on(NetCallEventConstant.accept,this.accept.bind(this));
        this.socket.on(NetCallEventConstant.reject,this.reject.bind(this));
        this.socket.on(NetCallEventConstant.hangup,this.hangup.bind(this));
    }

    private calling(obj:{
        uid:number,
        touid:number,
        name:string
    },ackFn:(...args:any[])=>void){
        const toSocket = socketMananger.get(obj.touid);
        if(toSocket){
            toSocket.emit(NetCallEventConstant.calling,{
                fromid:obj.uid,fromname:obj.name
            });
            ackFn();
        }
    }

    /**
     * 接受
     * @param obj 
     * @param ackFn 
     */
    private accept(obj:{
        uid:number,
        touid:number
    },ackFn:(...args:any[])=>void){
        const toSocket = socketMananger.get(obj.touid);
        if(toSocket){
            toSocket.emit(NetCallEventConstant.accept,{
                fromid:obj.uid,fromname:""
            });
            ackFn();
        }
    }
    /**
     * 拒绝
     * @param obj 
     * @param ackFn 
     */
    private reject(obj:{
        uid:number,
        touid:number
    },ackFn:(...args:any[])=>void){
        const toSocket = socketMananger.get(obj.touid);
        if(toSocket){
            toSocket.emit(NetCallEventConstant.reject,{
                fromid:obj.uid,fromname:""
            });
            ackFn();
        }
    }

    /**
     * 挂断
     * @param obj 
     * @param ackFn 
     */
    private hangup(obj:{
        uid:number,
        touid:number
    },ackFn:(...args:any[])=>void){
        const toSocket = socketMananger.get(obj.touid);
        if(toSocket){
            toSocket.emit(NetCallEventConstant.hangup,{
                fromid:obj.uid,fromname:""
            });
            ackFn();
        }
    }
    static getInstance(socket:SocketIO.Socket){
        return new NetCallSocket(socket);
    }
}