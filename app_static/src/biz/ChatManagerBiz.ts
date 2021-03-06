import { ERole } from "../enum/ERole";
import MyService from "../api/UserService";
import rootStore from "../store";
import ErrorMsg from "../model/ErrorMsg";
import OrderService from "../api/OrderService";
import IUser from "../interface/model/IUser";
import { IOrder } from "../interface/model/IOrder";
import { getSocket, getOrderSocket } from "../socketLaunch";
import Vue from "vue";
import EChatMsgType from "../enum/EChatMsgType";
import { IOnlyChatRecord } from "../interface/mongomodel/IChatRecord";
import { EChatMsgStatus } from "../enum/EChatMsgStatus";
import _ from "lodash";
import ChatService from "../api/ChatService";
import { EOrderStatus } from "../enum/EOrderStatus";
const orderService = OrderService.getInstance();
const userService = MyService.getInstance();
declare var wx:any;

/**
 * 聊天权限实体
 */
class ChatRole{
    private _current:ERole;
    set Current(value:ERole){
        this._current = value;
    }
    get Current(){
        return this._current;
    }

    private _to:ERole;
    set To(value:ERole){
        this._to = value;
    }
    get To(){
        return this._to;
    }
}

export class ChatEventContants{
    public static readonly joinEvent = "join";
    public static readonly sendEvent = "send";
    public static readonly notifyEvent = "notify";
    public static readonly readEvent = "read";
    public static readonly leaveEvent = "leave";
    public static readonly addCount = "add_count";
    public static readonly commitCount = "add_count";
    public static readonly compeleteOrderEvent = 'complete_order';
    public static readonly vueDefaultRecordEvent = "vueDefaultRecordEvent";
    public static readonly vueOrderComplete = "vueOrderComplete";

    public static readonly MAX_CHAT_COUNT = 5;
}

/**
 * socket聊天管理
 */
export class ChatListener{
    private static readonly MAX_COUNT = 3000;

    private static _VUE:Vue;

    private roomid:string;
    private uid:number;
    private touid:number;
    private chatCount = 0;

    private chatService:ChatService;
    private checkOrderFlag:number;

    private isUpdating=false;

    public get Roomid(){
        return this.roomid;
    }
    static send(obj:IOnlyChatRecord){
        if(obj.type===EChatMsgType.Audio){
            wx.downloadVoice({
                serverId: obj.serverId, // 需要下载的音频的服务器端ID，由uploadVoice接口获得
                isShowProgressTips: 1, // 默认为1，显示进度提示
                success: function (res:any) {
                    obj.localId = res.localId; // 返回音频的本地ID
                },
                fail:function(res:any){
                    console.log(res);
                }
            });
        }
        const socketWrapper = getSocket();
        //NOTE:不能改成this
        ChatListener._VUE.$emit(ChatEventContants.sendEvent,obj);
        //接受消息，更新已读
        socketWrapper.emit(ChatEventContants.readEvent,{
            tokenid:obj.tokenid,
            roomid:obj.roomid
        });
    }

    static read(tokenid:string|string[]){
        let tempTokenId:string[] = [];
        if(_.isString(tokenid)){
            tempTokenId = [tokenid]
        }else{
            tempTokenId = tokenid;
        }
        ChatListener._VUE.$emit(ChatEventContants.readEvent,tempTokenId);
    }

    /**
     *
     * @param vue
     * @param currentRole 暂时聊天对倾听者和倾诉者使用统一限制
     * @param order
     */
    constructor(vue:Vue,private currentRole:ERole,private order?:IOrder){
        ChatListener._VUE = vue;
        this.chatService = ChatService.getInstance();
    }

    private reconnect = ()=>{
        this.join(this.uid,this.touid,"");
    }

    setOrder(order:IOrder){
        this.order = order;
    }

    /**
     * 加入房间
     * @param uid
     * @param lid
     * @param username
     */
    join(uid:number,lid:number,username:string){
        this.uid = uid;
        this.touid = lid;
        const socketWrapper = getSocket();
        return new Promise<string>((resolve,reject)=>{
            const flag = setTimeout(function(){
                reject(new ErrorMsg(false,"socket无应答"));
            },ChatListener.MAX_COUNT);
            socketWrapper.emit(ChatEventContants.joinEvent,{
                pid:uid,lid:lid,name:username
            },(roomid:string)=>{
                clearTimeout(flag);
                this.roomid = roomid;
                resolve(roomid);
            });
        }).then(roomid=>{
            socketWrapper.on("reconnect",this.reconnect);
            this.chatService.getDefaultChatRecords(roomid).then(res=>{
                const data = res.data;
                if(data.success&&data.data){
                    ChatListener._VUE.$emit(ChatEventContants.vueDefaultRecordEvent,data.data);
                    const tokenids = data.data.map(item=>{
                        if(item.senduid===this.uid){
                            item.ismy = true;
                        }
                        return item;
                    })
                    .filter(item=>item.status===EChatMsgStatus.Send&&item.touid===this.uid)
                    .map(item=>item.tokenid);
                    if(tokenids.length){
                        const socketWrapper = getSocket();
                        //将收到的消息标记为已读
                        socketWrapper.emit(ChatEventContants.readEvent,{
                            tokenid:tokenids,
                            roomid:roomid
                        });
                    }
                }
            });
            return roomid;
        });
    }

    private checkOrderTimes(){
        if(this.order){
            if(this.order.servicetime >= this.order.payservicetime){
                return new ErrorMsg(false,"请下单后开始聊天");
            }
            this.order.servicetime ++;
            const orderSocket = getOrderSocket();
            orderSocket.emit(ChatEventContants.addCount);
            if(this.order.servicetime===this.order.payservicetime){
                ChatListener._VUE.$emit(ChatEventContants.vueOrderComplete, this.order);
            }
            return new ErrorMsg(true);
        }else{
            if(this.chatCount < ChatEventContants.MAX_CHAT_COUNT){
                this.chatCount++;
                return new ErrorMsg(true);
            }
            return new ErrorMsg(false,"已达到最大聊天数量");
        }
    }

    /**
     * 更新订单服务中
     */
    private checkOrderToServicing(){
        //订单为支付完成时 更新订单
        //NOTE:只会返回已支付和服务中的订单
        if(this.order){
            //倾诉者更新
            if(this.order.status===EOrderStatus.Paid&&this.currentRole===ERole.Pourouter){
                if(this.isUpdating){
                    return;
                }
                this.isUpdating = true;
                orderService.updateServicing(<number>this.order.id).then(res=>{
                    const data = res.data;
                    if(data.success){
                        Object.assign(this.order,data.data);
                        this.isUpdating = false;
                    }
                });
            }
        }
    }


    /**
     * 发送消息
     * @param chatMsgObj
     */
    sendMsg(chatMsgObj:IOnlyChatRecord){
        const checkResult = this.checkOrderTimes();
        if(!checkResult.success){
            return Promise.reject(checkResult);
        }
        this.checkOrderToServicing();
        chatMsgObj.status = EChatMsgStatus.Send;
        chatMsgObj.roomid = this.roomid;
        chatMsgObj.senduid = this.uid;
        chatMsgObj.touid = this.touid;
        if(chatMsgObj.localId){
            chatMsgObj.type = EChatMsgType.Audio;
        }else{
            chatMsgObj.type = EChatMsgType.Text;
        }
        return new Promise<IOnlyChatRecord>((resolve,reject)=>{
            const flag = setTimeout(function(){
                reject(new ErrorMsg(false,"socket无应答"));
            },ChatListener.MAX_COUNT);
            const socketWrapper = getSocket();
            socketWrapper.emit(ChatEventContants.sendEvent,chatMsgObj,function(obj:any){
                chatMsgObj.ismy = true;
                chatMsgObj.tokenid = obj.tokenid;
                chatMsgObj.status = EChatMsgStatus.Send;
                clearTimeout(flag);
                resolve(chatMsgObj);
            });
        });
    }
    
    // completeOrder() {
    //     const chatsocket = getSocket();
    //     chatsocket.emit(ChatEventContants.compeleteOrderEvent,{
    //         roomid:this.roomid
    //     });
    // }

    // onCompleteOrder(){
    //     if(this.order){
    //         this.order.status = EOrderStatus.Awaiting_Comment;
    //     }
    // }

    /**
     * 离开房间
     */
    leave(){
        clearInterval(this.checkOrderFlag);
        const socketWrapper = getSocket();
        socketWrapper.emit(ChatEventContants.leaveEvent,{
            roomid:this.roomid
        });
    }

    addEvent(){
        const socketWrapper = getSocket();
        socketWrapper.on(ChatEventContants.readEvent,ChatListener.read);
        socketWrapper.on(ChatEventContants.sendEvent,ChatListener.send);
        // socketWrapper.on(ChatEventContants.compeleteOrderEvent,this.completeOrder.bind(this));
    }

    removeEvent(){
        const socketWrapper = getSocket();
        
        socketWrapper.on("reconnect",this.reconnect);
        socketWrapper.remove(ChatEventContants.sendEvent,ChatListener.send);
        socketWrapper.remove(ChatEventContants.readEvent,ChatListener.read)
    }
}

/**
 * chat页面管理器
 */
export default class ChatManagerBiz{
    private chatRole:ChatRole = new ChatRole();
    private userService:MyService;

    private order?:IOrder;
    private chatListener:ChatListener;
    constructor(){
        this.userService = MyService.getInstance();
        this.chatRole.Current = <ERole>rootStore.state.user.role;
    }

    /**
     * 加入房间
     * @param vue
     * @param uid
     * @param touid
     */
    public joinRoom(vue:Vue,touid:number){
        this.chatListener = new ChatListener(vue,this.chatRole.Current,this.order);
        const currentUid = <number>rootStore.state.user.id;
        //NOTE:暂时没有名字
        return this.chatListener.join(currentUid,touid,<string>rootStore.state.user.nickname).then(res=>{
            return this.chatListener;
        });
    }

    /**
     * 完成订单
     * @param order 
     */
    public completeOrder(order:IOrder){
        if(!order.id){
            return Promise.reject(new ErrorMsg(false,"订单非法"));
        }
        if(!('servicetime' in order)){
            return Promise.reject(new ErrorMsg(false,"服务时长不正确"));
        } //倾诉者
        if(this.chatRole.Current===ERole.Pourouter){
            return orderService.chatComplete(order.id,order.servicetime);
        }
        return Promise.reject(new ErrorMsg(true,"非本人单据，默认完成成功"));
    }

    public commitChatCount(order:IOrder){
        if(!order.id){
            return Promise.reject(new ErrorMsg(false,"订单非法"));
        }
        if(this.chatRole.Current===ERole.Pourouter){
            const orderSocket = getOrderSocket();
            return orderSocket.emit(ChatEventContants.commitCount);
        }
        return Promise.reject(new ErrorMsg(true,"非本人单据，默认完成成功"));
    }

    /**
     * 更新服务时长
     */
    public updateServicetime(order:IOrder) {
        if(!order.id){
            return Promise.reject(new ErrorMsg(false,"订单非法"));
        }
        if(!('servicetime' in order)){
            return Promise.reject(new ErrorMsg(false,"服务时长不正确"));
        }
        //倾诉者
        if(this.chatRole.Current===ERole.Pourouter){
            return orderService.updateServicetime(order.id,order.servicetime);
        }
        return Promise.reject(new ErrorMsg(true,"非本人单据，默认更新成功"));
    }

    /**
     * 验证当前用户角色
     * @param lid
     */
    public getData(lid:number) {
        return this.userService.getUser(lid).then(res=>{
            const data =res.data;
            if(data.success&&data.data){
                this.chatRole.To = <ERole>data.data.role;
                return Promise.resolve(res);
            }
            return Promise.reject(new ErrorMsg(false,"获取用户错误"));
        }).then<{roles:ChatRole,listener?:IUser,order?:IOrder}>(listenerRes=>{
            const currentUid = rootStore.state.user.id;
            return orderService.checkHasOrder(<number>currentUid,lid).then(res=>{
                const data =res.data;
                //都是倾听者  区分倾听者和倾诉者
                if(this.chatRole.Current===ERole.Listener&&this.chatRole.To===ERole.Listener){
                    this.checkRole(data.data);
                }
                this.order = data.data;
                return {
                    roles:this.chatRole,
                    listener:listenerRes.data.data,
                    order:data.data
                }
            });
        }).then(data=>{
          const tempData:any = data;
          if (data.listener&&data.listener.role === ERole.Listener) {
            return userService
              .getSummaryData(<number>data.listener.id)
              .then(res => {
                const data = res.data;
                if(data.success){
                  tempData.summaryData = data.data;
                }
                return tempData;
              });
          }
          return tempData;
        });
    }

    /**
     * 获取订单
     * @param lid 
     */
    public getOrder(lid:number){
        const currentUid = rootStore.state.user.id;
        return orderService.checkHasOrder(<number>currentUid,lid).then(res=>{
            const data =res.data;
            if(data.success&&data.data){
                this.chatListener.setOrder(data.data);
            }else{
                return Promise.reject(new ErrorMsg(false,"无可用订单"));
            }
            return Promise.resolve(data.data);
        });
    }

    /**
     * 根据订单验证当前角色
     * @param lid
     * @param order
     */
    private checkRole(order?:IOrder){
        //存在订单 区分倾听者和倾诉者
        const currentUid = rootStore.state.user.id;
        if(order){
            if(currentUid===order.uid){
                this.chatRole.Current = ERole.Pourouter;
                this.chatRole.To = ERole.Listener;
            }else{
                this.chatRole.Current = ERole.Listener;
                this.chatRole.To = ERole.Pourouter;
            }
        }else{
            //不存在订单，看谁谁是倾听者
            this.chatRole.Current = ERole.Pourouter;
            this.chatRole.To = ERole.Listener;
        }
    }
}
