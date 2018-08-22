<template>
    <div class="chat-container" :class="{'chat-on-container':topChatType===1}">
        <div class="info-container" v-if="toRole===1&&showDetail">
          <div class="status">
            {{toUser.nickname}}
            <template v-if="toRole===1">
              - {{ERecieveStatus[toUser.listener.recievestatus]}}
            </template>
          </div>
          <div class="info">
            <div class="icon">
              <user-icon size="4" :user="toUser"></user-icon>
              <div class="follow" @click="follow">+关注</div>
            </div>
            <div class="summary">
              <div class="base">
                <div class="item">
                  <div class="num">{{summaryData.stime}}</div>
                  <div class="text">已售时长</div>
                </div>
                <div class="item">
                  <div class="num">99.99%</div>
                  <div class="text">好评率</div>
                </div>
                <div class="item">
                  <div class="num">{{summaryData.ucount}}</div>
                  <div class="text">帮助人数</div>
                </div>
              </div>
              <div class="base">
                <div class="item single">
                  <div class="comment" v-if="!toUser.listener.authstatus">有独创性的人杰</div>
                  <div class="auth" v-else>认证</div>
                </div>
                <div class="item single">
                  评价（12345）
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="tab">
          <div class="price" v-if="toRole===1">{{toUser.listener.minprice}}元起</div>
          <div class="switch">
            <div class="word fa fa-commenting-o" :class="{'active':topChatType==1}" @click="changeTab(EChatType.word)"></div>
            <div class="phone fa fa-phone" :class="{'active':topChatType==2}" @click="changeTab(EChatType.phone)"></div>
          </div>
          <div class="order" v-if="toRole===1" @click="orderRightNow">马上下单</div>
        </div>
        <div v-show="topChatType===1" class="chat-wrapper" ref="scrollContainer">
            <div :class="{'chat-my':item.ismy}" class="chat-record" v-for="(item, index) in msgList" :key="index">
              <template v-if="item.ismy">
                <div class="msg-status">{{item.status==2?'已读':'已发送'}}</div>
                <div v-if="item.type!=2" class="msg-text">{{item.msg}}</div>
                <div v-if="item.type==2" @click="playRecord(item)">播放语言</div>
                <user-icon size="4" :user="user"></user-icon>
              </template>
              <template v-else>
                <user-icon size="4" :user="toUser"></user-icon>
                <div v-if="item.type!=2" class="msg-text">{{item.msg}}</div>
                <div v-if="item.type==2" @click="playRecord(item)">播放语言</div>
              </template>
            </div>
        </div>
        <div v-show="topChatType===1" class="big-wrapper">
            <div class="send-wrapper">
                <mt-button @click="changeType" class="microphone-btn" type="default">
                    <i v-show="chatType===1" class="fa fa-microphone" aria-hidden="true"></i>
                    <i v-show="chatType===2" class="fa fa-keyboard-o" aria-hidden="true"></i>
                </mt-button>
                <mt-field ref="field" v-show="chatType===1" style="display:none;" placeholder="请输入信息" v-model="msg" @keyup.enter="send"></mt-field>
                <button
                v-show="chatType===2"
                plain
                @touchstart="touchstart"
                @touchend="touchend"
                class="mint-field tell-btn mint-button mint-field tell-btn mint-button--default mint-button--normal is-plain">
                    按住说话
                </button>
                <mt-button v-show="chatType===1" type="primary" @click="send">发送</mt-button>
            </div>
        </div>
        <select-order :toUser="toUser" v-if="orderSelectShow"></select-order>
        <net-call v-show="topChatType===2" :roomid="tencentRoomid" :to-user="toUser"></net-call>
        <select-order v-show="false" :toUser="toUser"></select-order>
    </div>
</template>
<script lang="ts">
import Vue ,{VNode }from 'vue'
import {mapGetters} from 'vuex'
import {Component} from "vue-property-decorator";
import { EChatMsgStatus } from '../enum/EChatMsgStatus';
import {startRecord,stopRecord,playRecord} from "../helper/WeixinHelper"
import { EChatMsgType } from '../enum/EChatMsgType';
import UserIcon from '@/components/UserIcon'
import ChatManagerBiz,{ChatListener,ChatEventContants} from "../biz/ChatManagerBiz";
import { IOnlyChatRecord } from '../interface/mongomodel/IChatRecord';
import { IOrder } from '../interface/model/IOrder';
import { IUser } from '../interface/model/IUser';
import { ERole } from '../enum/ERole';
import { EOrderStatus } from '../enum/order/EOrderStatus';
import {EChatType} from '../enum/EChatType';
import {ERecieveStatus} from '../enum/ERecieveStatus';
import SelectOrder from '@/components/SelectOrder';
import NetCall from "@/components/NetCall"

@Component({
    components:{
      UserIcon,
      SelectOrder,
      NetCall
    },
    methods:{

    },
    computed:{
      ...mapGetters({
        "user":"user"
      })
    }
})
export default class Chat extends Vue{
    private biz:ChatManagerBiz;
    private chatListener:ChatListener;
    private msg = "";
    private msgList:any[]=[];
    private chatType = EChatMsgType.Text;
    private order?:IOrder;
    private currentRole:ERole = ERole.Pourouter;
    private toRole:ERole = ERole.Pourouter;
    private toUser:IUser={};
    private topChatType:EChatType = EChatType.word;
    private EChatType:EChatType;
    private ERecieveStatus:ERecieveStatus;
    private summaryData:any;
    private showDetail:boolean = true;
    private orderSelectShow:boolean = false;
    private user:IUser;
    private tencentRoomid="";
    follow(){

    }
    constructor(){
        super();
        this.biz = new ChatManagerBiz();
    }
    created(){
        (<any>this).EChatType = EChatType;
        (<any>this).ERecieveStatus = ERecieveStatus;
        this.biz.getData(parseInt(this.$route.params.uid)).then(data=>{
            //TODO:根据订单和角色验证
            const listener = data.listener;
            this.order = data.order;
            this.currentRole = data.roles.Current;
            this.toRole = data.roles.To;
            this.summaryData = data.summaryData||''
            if(listener){
                this.toUser = listener;
                this.biz.joinRoom(this,<number>listener.id).then(listener=>{
                    this.chatListener = listener;
                    this.tencentRoomid = this.createTencentRoomid();
                    this.chatListener.addEvent();
                    this.onSocketEvent();
                });
            }
        });
    }

    private createTencentRoomid(){
        const sortArr:number[] = [<number>this.user.id,<number>this.toUser.id].sort();
        if(sortArr[0].toString().length<16){
            sortArr[0] = 1e16 + sortArr[0];
        }
        if(sortArr[1].toString().length<16){
            sortArr[1] = 1e16 + sortArr[1];
        }
        return sortArr.join('');
    }

    onSocketEvent(){
        this.$on(ChatEventContants.sendEvent,(data:IOnlyChatRecord)=>{
          this.msgList.push(data);
          this.scrollToBottom()
        });
        this.$on(ChatEventContants.readEvent,(tokenids:string[])=>{
            const lists = this.msgList.filter(item=>tokenids.indexOf(item.tokenid)>-1);
            if(lists&&lists.length){
                lists.forEach(item=>{
                    item.status = EChatMsgStatus.Readed;
                });
            }
        });

        //获取最近的20条消息
        this.$on(ChatEventContants.vueDefaultRecordEvent,(datas:IOnlyChatRecord[])=>{
            this.msgList = datas.reverse()||[];
            this.scrollToBottom()
        });

        this.$on(ChatEventContants.vueOrderComplete,(order:IOrder)=>{
            this.biz.completeOrder(order).then(res=>{
                const data = res.data;
                if(data.success){
                    Object.assign(this.order,data.data);
                }
            },err=>{
                this.$toast(err.message);
            });
        });
    }

    mounted() {
        const input = (<any>this.$refs.field).$refs.input;
        input.addEventListener('keyup',(event:any)=>{
            if(event.keyCode===13){
                this.send();
            }
        });
    }
    changeTab(type:any){
      this.topChatType = type
    }
    changeType(){
        if(this.chatType===EChatMsgType.Text){
            this.chatType=EChatMsgType.Audio;
        }else{
            this.chatType=EChatMsgType.Text;
        }
    }
    touchstart(event:MouseEvent){
        startRecord();
        event.preventDefault();
    }
    touchend(event:MouseEvent){
        stopRecord().then((obj:{
            serverId:string,
            localId:string
        })=>{
            this.chatListener.sendMsg({
                localId:obj.localId,
                serverId:obj.serverId,
            }).then(data=>{
                this.msgList.push(data);
                this.scrollToBottom()
            });
        });

        event.preventDefault();
    }
    playRecord(msgObj:IOnlyChatRecord){
        if(msgObj.localId){
            playRecord(msgObj.localId);
        }
    }
    send(){
        if(!this.msg){
            this.$toast("消息不能为空");
            return;
        }
        if(this.chatListener){
            this.chatListener.sendMsg({
                msg:this.msg
            }).then(data=>{
                data.ismy = true;
                this.msgList.push(data);
                this.scrollToBottom()
            },err=>{
                this.$toast(err.message);
            });
        }
        this.msg = "";
    }
    scrollToBottom(){
      setTimeout(() => {
        let scrollContainer = <HTMLDivElement>this.$refs.scrollContainer
        scrollContainer.scrollTop = scrollContainer.offsetHeight+500
      }, 200);
    }
    orderRightNow(){
      this.orderSelectShow = true
    }
    beforeDestroy() {
        if(this.chatListener){
            this.chatListener.leave();
            this.chatListener.removeEvent();
        }
        if(this.order&&<EOrderStatus>this.order.status<EOrderStatus.Awaiting_Comment){
            this.biz.updateServicetime(this.order).then(data=>{
                console.log("更新时长成功")
            },err=>{
                this.$toast(err.message);
            });
        }
    }
}
</script>

<style lang="less" scoped>
@import "../assets/common.less";
.chat-container{
    height:100vh;
}
.chat-on-container{
    height:~'calc(100vh - 58px)';
    background-color:#eee;
}
.info-container{
  height:10rem;
  background:#fff;
  .status{
    height:3rem;
    line-height:3rem;
    border-bottom:.1rem solid #f5f5f5;
  }
  .info{
    height:6.8rem;
    border-bottom:.1rem solid #f5f5f5;
    display:flex;
    .fs(1.1rem);
    .icon{
      width:7rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .follow{
        .fs(1.1rem);
      }
    }
    .summary{
      flex:1;
      border-left:.1rem solid #f5f5f5;
      .base{
        display:flex;
        height:3.4rem;
        border-bottom:.1rem solid #f5f5f5;
        .item{
          flex:1;
          .fs(1rem);
          .text{
            .fs(1.1rem);
          }
          &.single{
            height:3.3rem;
            line-height:3.3rem;
            div{
              .fs(1.1rem);
            }
          }
        }
      }
    }
  }
}
.tab{
  display:flex;
  justify-content: space-between;
  align-items:center;
  height:4rem;
  margin:0 1rem;
  position:relative;
  .price{
    position:absolute;
    top:.4rem;
    left:7rem;
    height:1.6rem;
    line-height:1.6rem;
    border-top-left-radius:.6rem;
    border-top-right-radius:.6rem;
    border-bottom-right-radius:.6rem;
    background:@mainColor;
    color:#fff;
    padding:.1rem .4rem;
    .fs(1.2rem);
  }
  .switch{
    width:8rem;
    height:2.4rem;
    .bs(1.2rem);
    background:#fff;
    display:flex;
    .fs(2rem);
    .word{
      border-right:1px solid #d3d3d3;
      flex:1;
    }
    .phone{
      flex:1;
      padding-top:.2rem;
    }
    .active{
      color:@mainColor;
    }
  }
  .order{
    width:7rem;
    background:@mainColor;
    color:#fff;
    height:2.4rem;
    line-height: 2.4rem;
    .fs(1.3rem);
    .bs(1.2rem);
  }
}
.big-wrapper{
    width: 100%;
    position:fixed;
    bottom: 0;
}
.send-wrapper{
    max-width: @maxLength;
    display: flex;
    height:48px;
    padding:5px 0;
    background:#f5f5f5;
    .mint-field{
        flex-grow: 1;
    }
    .mint-cell {
        border-bottom: none;
    }
    button{
        height: 48px;
        border-radius: 0;
    }
    button.microphone-btn{
        background: transparent;
        border: none;
        box-shadow: none;
    }
    button.tell-btn{
        margin:0 20px;
        justify-content: center;
        border-radius: 5px;
        border-color: #999;
    }
}
.chat-wrapper{
    margin:10px;
    overflow: auto;
    height: ~'calc(100vh - 22rem)';
    .chat-record{
        margin:15px 0;
        max-width: 85%;
        display: flex;
        &.chat-my{
          margin-left:15%;
          .msg-text{
              background: #74e9f5;
              color: #fff;
          }
        }
        /deep/ .fbui-user-icon{
          margin:0 5px;
        }
        .icon{
          width:4rem;
          flex-shrink: 0;
        }
        .msg-text{
            flex:1;
            display: inline-block;
            text-align: left;
            padding: 5px;
            border-radius: 10px;
            color: #666;
            background-color: #fff;
            word-wrap: break-word;
            word-break: break-all;
        }
        .msg-status{
            font-size: small;
            color: #666;
            padding: 3px;
            width:5rem;
            flex-shrink: 0;
        }
    }
}
</style>


