<template>
    <div style="height:calc(100vh - 58px);background-color:#eee">
        <div class="info-container">
          <div class="status">
            名字 - 可接单
          </div>
          <div class="info">
            <div class="icon">
              <user-icon :size="4"></user-icon>
              <div class="follow">+关注</div>
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
        <div class="chat-wrapper">
            <div :class="{'chat-my':item.ismy}" class="chat-record" v-for="(item, index) in msgList" :key="index">
                <span class="msg-status" v-if="item.ismy">{{item.status==2?'已读':'已发送'}}</span>
                <span v-if="item.type!=2" class="msg-text">{{item.msg}}</span>
                <span v-if="item.type==2" @click="playRecord(item)">播放语言</span>
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
import { getSocket } from '../socketLaunch';
import {Component} from "vue-property-decorator";
import {mapGetters} from "vuex";
import SocketWrapper from '../socket';
import { EChatMsgStatus } from '../enum/EChatMsgStatus';
import {startRecord,stopRecord,playRecord} from "../helper/WeixinHelper"
import { EChatMsgType } from '../enum/EChatMsgType';
import UserIcon from '@/components/UserIcon'
declare var wx:any;
@Component({
    computed:{
        ...mapGetters(["user"])
    },
    components:{
      UserIcon
    }
})
export default class Chat extends Vue{
    private sockeWrapper:SocketWrapper;
    private roomid:string;
    private msg = "";
    private msgList:any[]=[];
    private chatType=1;
    private sendM = (obj:any)=>{
        this.msgList.push(obj);
        if(obj.type===EChatMsgType.Audio){
            wx.downloadVoice({
                serverId: obj.mediaid, // 需要下载的音频的服务器端ID，由uploadVoice接口获得
                isShowProgressTips: 1, // 默认为1，显示进度提示
                success: function (res:any) {
                    obj.localId = res.localId; // 返回音频的本地ID
                },
                fail:function(res:any){
                    console.log(res);
                }
            });
        }
        this.sockeWrapper.emit('read',{
            tokenid:obj.tokenid,
            roomid:obj.roomid
        });
    }
    private readM = (tokenid:string)=>{
        const current = this.msgList.find(item=>item.tokenid===tokenid);
        if(current){
            current.status = EChatMsgStatus.Readed;
        }
    }
    constructor(){
        super();
        this.sockeWrapper = getSocket();
    }
    created(){
        this.sockeWrapper.emit("join",{
            pid:1,lid:2,name:"杜海峰"
        },(roomid:string)=>{
            this.roomid = roomid;
        });
        this.sockeWrapper.on("send",this.sendM);
        this.sockeWrapper.on('read',this.readM);
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
        //先测试一下
        if(this.chatType===1){
            this.chatType=2;
        }else{
            this.chatType=1;
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
            const msgObj:any = {
                msg:this.msg,
                tokenid:"",
                status:-1,
                pid:1,
                lid:2,
                type:EChatMsgType.Audio,
                localId:obj.localId,
                mediaid:obj.serverId,
                ismy:true
            }
            this.msgList.push(msgObj);
            this.sockeWrapper.emit("send",msgObj,function(obj:any){
                msgObj.tokenid = obj.tokenid;
                msgObj.status = EChatMsgStatus.Send;
            });
        });

        event.preventDefault();
    }
    playRecord(msgObj:any){
        playRecord(msgObj.localId);
    }
    send(){
        if(!this.msg){
            this.$toast("消息不能为空");
            return;
        }
        const msgObj:any = {
            msg:this.msg,
            tokenid:"",
            status:-1,
            pid:1,
            lid:2,
            ismy:true
        };
        this.sockeWrapper.emit("send",msgObj,function(obj:any){
            msgObj.tokenid = obj.tokenid;
            msgObj.status = EChatMsgStatus.Send;
        });
        this.msgList.push(msgObj)
        this.msg = "";
    }
    beforeDestroy() {
       this.sockeWrapper.emit("leave",{
           roomid:this.roomid
       });
       this.sockeWrapper.remove("send",this.sendM);
       this.sockeWrapper.remove("readM",this.readM);
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
    padding:10px;
    .chat-record{
        text-align: left;
        margin:25px 0;
        &.chat-my{
            text-align: right;
            .msg-text{
                background: #74e9f5;
                color: #fff;
            }
        }
        .msg-text{
            max-width: 85%;
            display: inline-block;
            text-align: left;
            font-weight: bold;
            padding: 5px;
            border-radius: 10px;
            color: #74e9f5;
            background-color: #fff;
        }
        .msg-status{
            font-size: small;
            color: #666;
            padding: 3px;
        }
    }
}
</style>


