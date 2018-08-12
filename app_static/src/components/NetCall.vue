<template>
    <div style="height:100%;   background: #616161; width: 100%;color: #d1d1d1;">
        <div v-show="status===ENetCallStatus.WaitCall">
            <div @click="makeCall" class="phone-btn-wrapper">
                <div class="phone-btn">
                    <i class="fa fa-phone" aria-hidden="true"></i>
                </div>
                <div>千寻不会记录您的任何倾诉内容，请放心使用</div>
            </div> 
        </div>
        <div class="call-container" v-show="status===ENetCallStatus.BeCalling">
            <img :src="toUser.headimgurl" class="call-img"/>
            <div class="call-nick-name">{{toUser.nickname}}</div>
            <div class="call-word">邀请音频通话...</div>
            <div class="call-handle-btn">
                <mt-button @click="accept" type="primary">接受</mt-button>
                <mt-button @click="reject" type="danger">拒绝</mt-button>
            </div>
        </div>
        <div class="call-container" v-show="status===ENetCallStatus.Calling||status===ENetCallStatus.Talking">
            <img :src="toUser.headimgurl" class="call-img"/>
            <div class="call-nick-name">{{toUser.nickname}}</div>
            <div class="call-word" v-show="status===ENetCallStatus.Calling">等待对方接听……</div>
            <div class="call-word" v-show="status===ENetCallStatus.Talking">通话中</div>
            <div class="call-handle-btn">
                <mt-button @click="hangup" type="danger">挂断</mt-button>
            </div>
        </div>
        <audio ref="localVideo" muted autoplay></audio>
        <!-- 远端视频流 -->
        <audio ref="remoteVideo" autoplay></audio>

    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import {Component,Prop} from "vue-property-decorator"
import {NetCallHelper, ENetCallCode,max_calling_time} from '../helper/NetCallHelper';
import { INetCallListener } from '../interface/action/INetCallListener';
import ENetCallStatus from "../enum/ENetCallStatus";
import { IUser } from '../interface/model/IUser';
import { mapGetters } from 'vuex';
import TencentHelper from '../helper/TencentHelper';
import TencentService from "../api/TencentService";
import { ITencentListener } from '../interface/action/ITencentListener';

class NetCallListener implements INetCallListener{
    private tencentService:TencentService;
    constructor(private netCallVue:NetCall){
        this.tencentService = TencentService.getInstance();
    }

    calling(){
        this.netCallVue.status = ENetCallStatus.BeCalling;
    }
    accept(){
        this.tencentService.getUserSig().then(res=>{
            const data = res.data;
            if(!data.success){
                this.netCallVue.$toast(data.message);
                return;
            }
            this.netCallVue.createRoom(<string>data.data).then(res=>{
                this.netCallVue.status = ENetCallStatus.Talking;
            },err=>{
                this.netCallVue.status = ENetCallStatus.WaitCall;
            });
        },err=>{
            this.netCallVue.$toast(err.message);
        });
    }
    reject(){
        this.netCallVue.status = ENetCallStatus.WaitCall;
    }
    close(){
        this.netCallVue.status = ENetCallStatus.WaitCall;
    }
    handup(){
        this.netCallVue.status = ENetCallStatus.WaitCall;
        this.netCallVue.tencentHelper.quit();
    }
    waittimeout(){
        this.netCallVue.status = ENetCallStatus.WaitCall;
    }
}

class TencentListener implements ITencentListener{
    constructor(private netCallVue:NetCall){

    }

    onRemoteStreamRemove(userid:string){
        this.netCallVue.$toast("远程已关闭");
        this.netCallVue.hangup();
    }
    onWebSocketClose(){
        this.netCallVue.$toast("网络已断开");
        this.netCallVue.hangup();
    }
    onRelayTimeout(){
        this.netCallVue.$toast("网络超时");
        this.netCallVue.hangup();
    }
    onKickout(){
        this.netCallVue.$toast("当前用户已在其他地方登录");
        this.netCallVue.hangup();
    }
}

@Component({
    computed:{
        ...mapGetters({
            user:"user"
        })
    }
})
export default class NetCall extends Vue{
    private ENetCallStatus = ENetCallStatus;
    private netCallHelper:NetCallHelper;
    public user:IUser;
    public tencentHelper:TencentHelper;
    private tencentService:TencentService;
    public status:ENetCallStatus = ENetCallStatus.WaitCall;

    @Prop({
        required:true
    })
    private toUser:IUser;
    @Prop({
        required:true
    })
    public roomid:string;

    getIds(){
        const uid = <number>this.user.id;
        const touid = <number>this.toUser.id;
        return {
            uid,
            touid
        }
    }

    created(){
        this.netCallHelper = new NetCallHelper(new NetCallListener(this));
        this.netCallHelper.initCallEvent();
        this.tencentService = TencentService.getInstance();
    }

    mounted() {
        this.tencentHelper = new TencentHelper((<HTMLVideoElement>this.$refs.localVideo),(<HTMLVideoElement>this.$refs.localVideo));        
    }

    beforeDestroy() {
        const {uid,touid} = this.getIds();
        NetCallHelper.resetStatus();
        this.netCallHelper.handup(uid,touid).then(res=>{
            console.log(res);
        },err=>{
            console.log(err);
        });
        this.netCallHelper.removeListener();
        this.tencentHelper.quit().then(()=>{},err=>{});
    }

    makeCall(){
        const {uid,touid} = this.getIds();
        this.netCallHelper.call(touid,this.user).then(data=>{
            this.status = ENetCallStatus.Calling;
        },err=>{
            this.status = ENetCallStatus.WaitCall;
            this.$toast("网络或服务器异常，请稍后重试");
        });
    }

    accept(){
        this.tencentService.getUserSig().then(res=>{
            const data = res.data;
            if(!data.success){
                this.$toast(data.message);
                return;
            }
            this.createRoom(<string>data.data).then(res=>{
                const {uid,touid} = this.getIds();
                this.netCallHelper.accept(uid,touid).then(res=>{
                    this.status = ENetCallStatus.Talking;
                },err=>{
                    this.status = ENetCallStatus.WaitCall;
                });
            });;
            
        },err=>{
            this.$toast(err.message);
        });
        // })
    }

    public createRoom(key:string){
        return this.tencentHelper.initRtc("1400106449",(<number>this.user.id).toString(),key,"30119").then(res=>{
            this.tencentHelper.initEvent(new TencentListener(this));
            return this.tencentHelper.createRoom(this.roomid,key);
        });
    }
    reject(){
        const {uid,touid} = this.getIds();
        this.netCallHelper.reject(uid,touid).then(res=>{
            this.status = ENetCallStatus.WaitCall;
        },err=>{
            this.status = ENetCallStatus.WaitCall;
        });
    }

    hangup(){
        this.tencentHelper.quit();
        const {uid,touid} = this.getIds();
        this.netCallHelper.handup(uid,touid).then(res=>{
            this.status = ENetCallStatus.WaitCall;
        },err=>{
            this.status = ENetCallStatus.WaitCall;
        }); 
    }
}
</script>

<style lang="less" scoped>
@import "../assets/common.less";
.phone-btn-wrapper{
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    flex-direction: column;
    width: 100%;
    top: 40%;
}
.phone-btn{
    margin:3px;
    height: 6rem;
    width: 6rem;
    line-height: 6rem;
    background: @mainColor;
    color: #fff;
    font-size: 4rem;
    border-radius: 50%;
}
.call-img{
    width: 8rem;
    height: 8rem;
    border-radius: 50%;
}
.call-word{
    margin:5px;
}

.call-handle-btn{
    position: fixed;
    bottom:10rem;
    width:100%;
    button{
        padding:0 20px;
        margin:0 10px;
    }
}

.call-container{
    padding-top:30%;
}

.call-nick-name{
    font-size: 1.2rem;
    font-weight: bold;
    color: #fff;
}
</style>

