import SocketWrapper from "./socket";
import { ISocketEvent } from "./interface/ISocketEvent";
let socketWrapper:SocketWrapper;
export function launchSocket(userid:number){
    return function(events:ISocketEvent){
        return socketWrapper||(socketWrapper=new SocketWrapper(userid,events));
    }
}
export function getSocket(){
    return socketWrapper;
}
export function getOrderSocket(){
    return socketWrapper.getOrderSocket();
}