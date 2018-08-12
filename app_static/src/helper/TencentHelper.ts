import { ITencentListener } from "../interface/action/ITencentListener";
import ErrorMsg from "../model/ErrorMsg";

declare var WebRTCAPI:any;
export default class TencentHelper{
    private RTC:any;
    constructor(private localDom:HTMLVideoElement,private remoteDom:HTMLVideoElement){

    }

    public initEvent(listener:ITencentListener){
        this.RTC.on( 'onRemoteStreamUpdate' , ( data:any )=>{
            if( data && data.stream){
                const stream = data.stream
                console.debug( data.userId + 'enter this room with unique videoId '+ data.videoId  )
                this.remoteDom.srcObject = stream
            }else{
                console.debug( 'somebody enter this room without stream' )
            }
        });
        this. RTC.on( 'onRemoteStreamRemove' , function( data:any ){
            console.debug( data.userId + ' leave this room with unique videoId '+ data.videoId  )
            listener.onRemoteStreamRemove(data.userId);
        });
        this.RTC.on( 'onWebSocketClose' , function( data:any ){
            //
            listener.onWebSocketClose();
        });
        this.RTC.on( 'onRelayTimeout' , function( data:any ){
            //视频服务器超时
            listener.onRelayTimeout();
        });
        this.RTC.on( 'onKickout' , function( data:any ){
            //退出房间
            listener.onKickout();
        });
        this.RTC.on("onLocalStreamAdd", (data:any)=>{
            if( data && data.stream){
                this.localDom.srcObject = data.stream;
            }
        });
    }

    public initRtc(
        sdkappid:string,
        userId:string,
        userSig:string,
        accountType='0'){
            return new Promise((resolve,reject) => {
                this.RTC = new WebRTCAPI({
                    "userId": userId,
                    "userSig": userSig,
                    "sdkAppId":  sdkappid,
                    "accountType": accountType,
                    "video":false
                },function(){
                    //初始化完成后调用进房接口
                    resolve();
                },function(error:any){
                    reject(error);
                });
            })
    }

    public createRoom(roomid:string,privateMapKey:string){
        if(!this.RTC){
            return Promise.reject(new ErrorMsg(false,"未初始化RTC"));
        }
        return new Promise((resolve,reject)=>{
            this.RTC.createRoom({
                roomid : parseInt(roomid),
                privateMapKey: privateMapKey,
                role : "user",   //画面设定的配置集名 （见控制台 - 画面设定 )
            },function(){
                resolve();
            },function(e:any){
                reject(e)
            });
        });
    }

    public quit(){
        if(!this.RTC){
            return Promise.reject(new ErrorMsg(false,"未初始化RTC"));
        }
        return new Promise((resolve,reject)=>{
            this.RTC.quit(function(){
                resolve();
            },function(e:any){
                reject(e)
            });
        });
    }
}