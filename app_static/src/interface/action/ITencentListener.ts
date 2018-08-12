export interface ITencentListener{
    onRemoteStreamRemove(userid:string):void;
    onWebSocketClose():void;
    onRelayTimeout():void;
    onKickout():void;
}
export default ITencentListener;