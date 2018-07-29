<template>
    <div>
        <div v-show="status===ENetCallStatus.WaitCall">
            <div @click="makeCall">打电话</div> 
            <div>千寻不会记录您的任何倾诉内容，请放心使用</div>
        </div>
        <div v-show="status===ENetCallStatus.Calling">
            <div>等待通话</div>
        </div>
        <div v-show="status===ENetCallStatus.Talking">
            <div></div>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import {Component} from "vue-property-decorator"
import NetCallHelper from '../helper/NetCallHelper';
import { INetCallListener } from '../interface/action/INetCallListener';
import ENetCallStatus from "../enum/ENetCallStatus";
class NetCallListener implements INetCallListener{
    constructor(private netCallVue:NetCall){

    }
    calling(){
        this.netCallVue.status = ENetCallStatus.Calling;
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
}
@Component
export default class NetCall extends Vue{
    private ENetCallStatus = ENetCallStatus;
    private netCallHelper:NetCallHelper;
    public status:ENetCallStatus = ENetCallStatus.WaitCall;

    created(){
        this.netCallHelper = new NetCallHelper(NetCallListener);
        this.netCallHelper.initCallEvent();
    }

    beforeDestroy() {
        this.netCallHelper.handup();
        this.netCallHelper.removeListener();
    }

    makeCall(){
        this.netCallHelper.call().then(data=>{
            this.status = ENetCallStatus.Calling;
        });
    }
}
</script>

<style lang="less" scoped>

</style>

