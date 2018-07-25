<template>
    <div style="height:calc(100vh - 58px);background-color:#eee">
        <div class="info-container">
          <div class="status">
            名字 - 可接单
          </div>
          <div class="info">
            <div class="icon">
              <user-icon size="4"></user-icon>
              <div class="follow" @click="follow">+关注</div>
            </div>
            <div class="summary">
              <div class="base">
                <div class="item">
                  <div class="num">1234</div>
                  <div class="text">已售时长</div>
                </div>
                <div class="item">
                  <div class="num">99.99%</div>
                  <div class="text">好评率</div>
                </div>
                <div class="item">
                  <div class="num">1234</div>
                  <div class="text">帮助人数</div>
                </div>
              </div>
              <div class="base">
                <div class="item single">
                  <div class="comment" v-if="true">有独创性的人杰</div>
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
          <div class="price">36元起</div>
          <div class="switch">
            <div class="word fa fa-commenting-o"></div>
            <div class="phone fa fa-phone"></div>
          </div>
          <div class="order">马上下单</div>
        </div>
        <div class="chat-wrapper">
            <div :class="{'chat-my':item.ismy}" class="chat-record" v-for="(item, index) in msgList" :key="index">
              <template v-if="item.ismy">
                <div class="msg-status">{{item.status==2?'已读':'已发送'}}</div>
                <div v-if="item.type!=2" class="msg-text">{{item.msg}}</div>
                <div v-if="item.type==2" @click="playRecord(item)">播放语言</div>
                <user-icon size="4"></user-icon>
              </template>
              <template v-else>
                <user-icon size="4"></user-icon>
                <div v-if="item.type!=2" class="msg-text">{{item.msg}}</div>
                <div v-if="item.type==2" @click="playRecord(item)">播放语言</div>
              </template>
            </div>
        </div>
        <div class="big-wrapper">
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
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import {Component} from "vue-property-decorator";
import { EChatMsgStatus } from '../enum/EChatMsgStatus';
import {startRecord,stopRecord,playRecord} from "../helper/WeixinHelper"
import { EChatMsgType } from '../enum/EChatMsgType';
import UserIcon from '@/components/UserIcon'
import ChatManagerBiz,{ChatListener} from "../biz/ChatManagerBiz";
import { IOnlyChatRecord } from '../interface/mongomodel/IChatRecord';

@Component({
    components:{
      UserIcon
    }
})
export default class Chat extends Vue{
    private biz:ChatManagerBiz;
    private chatListener:ChatListener;
    private msg = "";
    private msgList:any[]=[];
    private chatType = EChatMsgType.Text;
    private role = ""
    follow(){

    }
    constructor(){
        super();
        this.biz = new ChatManagerBiz();
    }
    created(){
        this.biz.getData(parseInt(this.$route.query.uid)).then(data=>{
            //TODO:根据订单和角色验证
            const listener = data.listener;
            if(listener){
                this.chatListener = this.biz.joinRoom(this,<number>listener.id);
                this.chatListener.addEvent();
                this.onSocketEvent();
            }
            (<any>this).role = data.roles
        });
    }
    onSocketEvent(){

        this.$on(ChatListener.sendEvent,(data:IOnlyChatRecord)=>{
            this.msgList.push(data);
        });
        this.$on(ChatListener.readEvent,(tokenid:string)=>{
            const current = this.msgList.find(item=>item.tokenid===tokenid);
            if(current){
                current.status = EChatMsgStatus.Readed;
            }
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
            });
        }
        this.msg = "";
    }
    beforeDestroy() {
        if(this.chatListener){
            this.chatListener.leave();
            this.chatListener.removeEvent();
        }
    }
}
</script>

<style lang="less" scoped>
@import "../assets/common.less";
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
    margin:20px 20px 20px 20px;
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


