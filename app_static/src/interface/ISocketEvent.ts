import {Socket} from "socket.io";
export interface ISocketEvent{
    connect?:(socket: Socket)=>void;
    connection?:(socket: Socket)=>void;
    connect_error?:(socket: Socket)=>void;
    connect_timeout?:(socket:Socket)=>void;
    reconnect?:(socket:Socket)=>void;
    reconnect_attempt?:(socket:Socket)=>void;
    reconnect_error?:(socket:Socket)=>void;
    reconnect_failed?:(socket:Socket)=>void;
    error?:(socket:Socket)=>void;
    disconnect?:(socket:Socket)=>void;
}
export default ISocketEvent;