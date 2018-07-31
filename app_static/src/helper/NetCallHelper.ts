import { getSocket } from "../socketLaunch";
import { INetCallListener } from "../interface/action/INetCallListener";
import ErrorMsg from "../model/ErrorMsg";
import { IUser } from "../interface/model/IUser";
import { play, stopPlay } from "./AudioPlayer";
const eventkey_prefix = "netcall_";
const max_wait_time=3000;
export const max_calling_time = 60*1000;

class NetCallEventConstant{
    public static readonly calling = `${eventkey_prefix}calling`;
    public static readonly reject = `${eventkey_prefix}reject`;
    public static readonly close = `${eventkey_prefix}close`;
    public static readonly accept = `${eventkey_prefix}accept`;
    public static readonly hangup = `${eventkey_prefix}hangup`;
    public static readonly busy = `${eventkey_prefix}busy`;
}
export enum ENetCallCode{
    Servicing=1,
    Calling
}
export class NetCallHelper {
    private static isCalling = false;
    private static isBeCalling = false;
    private static isTalking = false;

    private socketWrapper = getSocket();
    private beCallingFlag:number;
    private callingFlag:number;
    private ringSound:Howl;
    private calling = (obj:{fromid:number,fromname:string})=>{
        if(NetCallHelper.isCalling||NetCallHelper.isBeCalling){
            this.socketWrapper.emit(NetCallEventConstant.busy,{
                touid:obj.fromid
            });
            return;
        }
        NetCallHelper.isBeCalling = true;
        this.ringSound = play("ring",true).sound; 
        this.beCallingFlag = setTimeout(()=>{
            stopPlay(this.ringSound);
            // tslint:disable-next-line:no-unused-expression
            this.listener.close&&this.listener.close();
            NetCallHelper.isBeCalling = false;
        },max_calling_time),
        this.listener.calling();
        
    };
    private acceptCb = (obj:{fromid:number,fromname:string})=>{
        //TODO:调用腾讯云 createRoom成功
        NetCallHelper.isTalking = true;
        NetCallHelper.isCalling = false;
        stopPlay(this.ringSound);
        clearTimeout(this.callingFlag);
        this.listener.accept();
    }

    private rejectCb = (obj:{fromid:number,fromname:string})=>{
        stopPlay(this.ringSound);
        play("reject");
        clearTimeout(this.callingFlag);
        NetCallHelper.resetStatus();
        this.listener.reject();
    }

    private handupCb = ()=>{      
        stopPlay(this.ringSound);  
        clearTimeout(this.callingFlag);
        NetCallHelper.resetStatus();
        this.listener.handup();
    }

    private close = ()=>{
        stopPlay(this.ringSound);  
        NetCallHelper.resetStatus();
        clearTimeout(this.callingFlag);
        clearTimeout(this.beCallingFlag);
        NetCallHelper.resetStatus();
        // tslint:disable-next-line:no-unused-expression
        this.listener.close&&this.listener.close();
    }

    private busy = ()=>{
        stopPlay(this.ringSound);  
        NetCallHelper.resetStatus();
        clearTimeout(this.callingFlag);
        clearTimeout(this.beCallingFlag);
        play("busy");
        // tslint:disable-next-line:no-unused-expression
        this.listener.close&&this.listener.close();
    }

    public constructor(private listener:INetCallListener) {
        //private listener:INetCallListener
    }

    public call(touid:number,user:IUser){
        if(NetCallHelper.isCalling||NetCallHelper.isBeCalling){
            return Promise.reject({
                code:ENetCallCode.Servicing,
                ...new ErrorMsg(false,"")
            });
        }
        NetCallHelper.isCalling = true;
        const {sound,promise} = play("connect");
        let isSoundStop = false;
        promise.then(()=>{
            if(!isSoundStop){
                this.ringSound = play("ring",true).sound; 
            }
        });
        return new Promise((resolve,reject)=>{
            const flag = setTimeout(()=>{
                NetCallHelper.isCalling=false;
                this.socketWrapper.emit(NetCallEventConstant.close,{
                    uid:user.id,
                    touid:touid
                });
                isSoundStop = true;
                stopPlay(this.ringSound);
                stopPlay(sound);
                reject();
            },max_wait_time);
            this.callingFlag = setTimeout(()=>{
                this.listener.waittimeout();
                stopPlay(this.ringSound);
                play("noresponse");
                this.handup(<number>user.id,touid);
            },max_calling_time);
            this.socketWrapper.emit(NetCallEventConstant.calling,{
                uid:user.id,
                touid:touid,
                name:user.nickname
            },()=>{
                clearTimeout(flag);
                resolve();
            });
        });
    }

    /**
     * 接受
     * @param uid 
     * @param touid 
     */
    public accept(uid:number,touid:number){
        clearTimeout(this.beCallingFlag);
        if(!NetCallHelper.isBeCalling){
            return Promise.reject({
                code:ENetCallCode.Calling,
                ...new ErrorMsg(false,"")
            });
        }
        stopPlay(this.ringSound);  
        NetCallHelper.isBeCalling = false;
        return new Promise((resolve,reject)=>{
            const flag = setTimeout(()=>{
                reject();
            },max_wait_time);
            this.socketWrapper.emit(NetCallEventConstant.accept,{
                uid:uid,
                touid:touid
            },()=>{
                ////TODO:调用腾讯云 createRoom成功
                NetCallHelper.isTalking = true;
                clearTimeout(flag);
                resolve();
            });
        });
    }

    /**
     * 拒绝
     * @param uid 
     * @param touid 
     */
    public reject(uid:number,touid:number){
        clearTimeout(this.beCallingFlag);
        if(!NetCallHelper.isBeCalling){
            return Promise.reject({
                code:ENetCallCode.Calling,
                ...new ErrorMsg(false,"")
            });            
        }
        NetCallHelper.isBeCalling = false;
        stopPlay(this.ringSound);  
        return new Promise((resolve,reject)=>{
            const flag = setTimeout(()=>{
                reject();
            },max_wait_time);
            this.socketWrapper.emit(NetCallEventConstant.reject,{
                uid:uid,
                touid:touid
            },()=>{
                clearTimeout(flag);
                resolve();
            });
        });
    }

    public handup(uid:number,touid:number){
        return new Promise((resolve,reject)=>{
            const flag = setTimeout(()=>{
                NetCallHelper.resetStatus();
                reject();
            },max_wait_time);
            stopPlay(this.ringSound);  
            clearTimeout(this.callingFlag);
            this.socketWrapper.emit(NetCallEventConstant.hangup,{
                uid:uid,
                touid:touid
            },()=>{
                NetCallHelper.resetStatus();
                clearTimeout(flag);
                resolve();
            });
        });
    }

    public initCallEvent(){
        this.socketWrapper.on(NetCallEventConstant.calling,this.calling);
        this.socketWrapper.on(NetCallEventConstant.accept,this.acceptCb);
        this.socketWrapper.on(NetCallEventConstant.reject,this.rejectCb);
        this.socketWrapper.on(NetCallEventConstant.hangup,this.handupCb);
        this.socketWrapper.on(NetCallEventConstant.close,this.close);
        this.socketWrapper.on(NetCallEventConstant.busy,this.busy);
    }
    public removeListener(){
        this.socketWrapper.remove(NetCallEventConstant.calling,this.calling);
        this.socketWrapper.remove(NetCallEventConstant.accept,this.acceptCb);
        this.socketWrapper.remove(NetCallEventConstant.reject,this.rejectCb);
        this.socketWrapper.remove(NetCallEventConstant.hangup,this.handupCb);
        this.socketWrapper.remove(NetCallEventConstant.close,this.close);
        this.socketWrapper.remove(NetCallEventConstant.busy,this.busy);
    }

    public static resetStatus(){
        NetCallHelper.isBeCalling = false;
        NetCallHelper.isCalling = false;
        NetCallHelper.isTalking = false;
    }
}

export default NetCallHelper;