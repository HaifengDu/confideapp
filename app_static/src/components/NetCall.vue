<template>
    <div>
        <div v-show="status===ENetCallStatus.WaitCall">
            <div @click="makeCall">打电话</div> 
            <div>千寻不会记录您的任何倾诉内容，请放心使用</div>
        </div>
        <div v-show="status===ENetCallStatus.BeCalling">
            <div>等待通话</div>
            <div>
                <button @click="accept">接受</button>
                <button @click="reject">拒绝</button>
            </div>
        </div>
        <div v-show="status===ENetCallStatus.Calling||status===ENetCallStatus.Talking">
            <div v-show="status===ENetCallStatus.Calling">等待接听中</div>
            <div v-show="status===ENetCallStatus.Talking">通话中</div>
            <div>
                <button @click="hangup">挂断</button>
            </div>
        </div>
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
class NetCallListener implements INetCallListener{
    constructor(private netCallVue:NetCall){
    }

    calling(){
        this.netCallVue.status = ENetCallStatus.BeCalling;
    }
    accept(){
        this.netCallVue.status = ENetCallStatus.Talking;
    }
    reject(){
        this.netCallVue.status = ENetCallStatus.WaitCall;
    }
    close(){
        this.netCallVue.status = ENetCallStatus.WaitCall;
    }
    handup(){
        this.netCallVue.status = ENetCallStatus.WaitCall;
    }
    waittimeout(){
        this.netCallVue.status = ENetCallStatus.WaitCall;
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
    private user:IUser;
    private timeFlag:number;
    public status:ENetCallStatus = ENetCallStatus.WaitCall;

    @Prop({
        required:true
    })
    private toUser:IUser;
    private isMyCall=false;

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
        const {uid,touid} = this.getIds();
        this.netCallHelper.accept(uid,touid).then(res=>{
            this.status = ENetCallStatus.Talking;
        },err=>{
            this.status = ENetCallStatus.WaitCall;
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

</style>

