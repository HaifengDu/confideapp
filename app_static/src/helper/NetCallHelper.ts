import { getSocket } from "../socketLaunch";
import { INetCallListener } from "../interface/action/INetCallListener";
import ErrorMsg from "../model/ErrorMsg";
import { IUser } from "../interface/model/IUser";
const socketWrapper = getSocket();
const eventkey_prefix = "netcall_";
const max_wait_time=3000;
const max_calling_time = 60*1000;
class NetCallEventConstant{
    public static readonly calling = `${eventkey_prefix}calling`;
    public static readonly reject = `${eventkey_prefix}reject`;
    public static readonly close = `${eventkey_prefix}close`;
    public static readonly accept = `${eventkey_prefix}accept`;
    public static readonly hangup = `${eventkey_prefix}hangup`
}
export enum ENetCallCode{
    Servicing=1,
    Calling
}
export class NetCallHelper {
    private static isServicing = false;
    private static isCalling = false;
    private static isTalking = false;
    private callingFlag:number;
    private calling = (obj:{fromid:number,fromname:string})=>{
        if(NetCallHelper.isServicing||NetCallHelper.isCalling){
            socketWrapper.emit(NetCallEventConstant.close,{
                uid:obj.fromid
            });
            return;
        }
        NetCallHelper.isCalling = true;
        this.callingFlag = setTimeout(()=>{
            NetCallHelper.isCalling = false;
        },max_calling_time),
        this.listener.calling();
        
    };
    private acceptCb = (obj:{fromid:number,fromname:string})=>{
        //TODO:调用腾讯云 createRoom成功
        NetCallHelper.isTalking = true;
        this.listener.accept();
    }

    private rejectCb = (obj:{fromid:number,fromname:string})=>{
        this.listener.reject();
    }

    private handupCb = ()=>{
        this.listener.handup();
    }

    private constructor(private listener:INetCallListener) {
    }

    public call(touid:number,user:IUser){
        if(NetCallHelper.isServicing||NetCallHelper.isCalling){
            return Promise.reject({
                code:ENetCallCode.Servicing,
                ...new ErrorMsg(false,"")
            });
        }
        NetCallHelper.isServicing = true;
        return new Promise((resolve,reject)=>{
            const flag = setTimeout(()=>{
                NetCallHelper.isServicing=false;
                reject();
            },max_wait_time);
            socketWrapper.emit(NetCallEventConstant.calling,{
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
        clearTimeout(this.callingFlag);
        if(NetCallHelper.isCalling){
            return Promise.reject({
                code:ENetCallCode.Calling,
                ...new ErrorMsg(false,"")
            });
        }
        return new Promise((resolve,reject)=>{
            const flag = setTimeout(()=>{
                reject();
            },max_wait_time);
            socketWrapper.emit(NetCallEventConstant.accept,{
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
        clearTimeout(this.callingFlag);
        if(NetCallHelper.isCalling){
            return Promise.reject({
                code:ENetCallCode.Calling,
                ...new ErrorMsg(false,"")
            });
            
        }
        return new Promise((resolve,reject)=>{
            const flag = setTimeout(()=>{
                reject();
            },max_wait_time);
            socketWrapper.emit(NetCallEventConstant.reject,{
                uid:uid,
                touid:touid
            },()=>{
                clearTimeout(flag);
                resolve();
            });
        });
    }

    public handup(uid:number,touid:number){
        if(NetCallHelper.isCalling){
            return Promise.reject({
                code:ENetCallCode.Calling,
                ...new ErrorMsg(false,"")
            });
            
        }
        return new Promise((resolve,reject)=>{
            const flag = setTimeout(()=>{
                reject();
            },max_wait_time);
            socketWrapper.emit(NetCallEventConstant.hangup,{
                uid:uid,
                touid:touid
            },()=>{
                clearTimeout(flag);
                resolve();
            });
        });
    }

    public initCallEvent(){
        socketWrapper.on(NetCallEventConstant.calling,this.calling);
        socketWrapper.on(NetCallEventConstant.accept,this.acceptCb);
        socketWrapper.on(NetCallEventConstant.reject,this.rejectCb);
        socketWrapper.on(NetCallEventConstant.hangup,this.handupCb);
    }

    public removeListener(){
        socketWrapper.remove(NetCallEventConstant.calling,this.calling);
        socketWrapper.remove(NetCallEventConstant.accept,this.acceptCb);
        socketWrapper.remove(NetCallEventConstant.reject,this.rejectCb);
        socketWrapper.remove(NetCallEventConstant.hangup,this.handupCb);
    }
}

export default NetCallHelper;